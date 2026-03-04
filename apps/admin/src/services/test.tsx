'use client';

import React, { useMemo, useState } from 'react';

// const apiUrl = "https://api.asinna.store";
const apiUrl = 'http://localhost:8080';

type MultipartInitRequest = {
  contentType: string;
  sizeBytes: number;
};

type MultipartInitResponse = {
  data: {
    videoId: string;
    objectKey: string;
    uploadId: string;
    partSizeBytes: number;
    expiresAtEpochSeconds: number;
    presignedParts: { partNumber: number; url: string }[];
  };
};

type MultipartCompleteRequest = {
  uploadId: string;
  sizeBytes: number;
  parts: { partNumber: number; eTag: string }[];
};

type UploadPhase =
  | 'IDLE'
  | 'INITING'
  | 'UPLOADING'
  | 'COMPLETING'
  | 'DONE'
  | 'ERROR';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<UploadPhase>('IDLE');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<{ uploaded: number; total: number }>(
    {
      uploaded: 0,
      total: 0,
    },
  );
  const [logLines, setLogLines] = useState<string[]>([]);
  const [concurrency, setConcurrency] = useState<number>(3);

  const progressPct = useMemo(() => {
    if (progress.total <= 0) return 0;
    return Math.floor((progress.uploaded / progress.total) * 100);
  }, [progress]);

  function log(line: string) {
    setLogLines((prev) => [
      ...prev.slice(-200),
      `[${new Date().toISOString()}] ${line}`,
    ]);
  }

  async function apiInit(f: File): Promise<MultipartInitResponse> {
    console.log(f.type);
    const body: MultipartInitRequest = {
      contentType: f.type || 'video/mp4',
      sizeBytes: f.size,
    };

    const res = await fetch(`${apiUrl}/api/v1/videos/upload/multipart/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`init failed: ${res.status} ${text}`);
    }
    return (await res.json()) as MultipartInitResponse;
  }

  async function apiComplete(
    videoId: string,
    req: MultipartCompleteRequest,
  ): Promise<void> {
    const res = await fetch(
      `${apiUrl}/api/v1/videos/${videoId}/upload/multipart/complete`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`complete failed: ${res.status} ${text}`);
    }
  }

  function sliceFileIntoParts(f: File, partSizeBytes: number) {
    const parts: {
      partNumber: number;
      blob: Blob;
      start: number;
      end: number;
    }[] = [];
    const total = f.size;
    let partNumber = 1;

    for (let start = 0; start < total; start += partSizeBytes) {
      const end = Math.min(start + partSizeBytes, total);
      const blob = f.slice(start, end);
      parts.push({ partNumber, blob, start, end });
      partNumber++;
    }
    return parts;
  }

  function normalizeETag(etag: string | null): string {
    if (!etag) return '';
    // Some browsers include quotes, some not. Normalize.
    const t = etag.trim();
    if (t.startsWith('"') && t.endsWith('"') && t.length >= 2)
      return t.slice(1, -1);
    return t;
  }

  async function putPart(url: string, blob: Blob): Promise<string> {
    // NOTE: For presigned UploadPart URLs, do NOT set Content-Type arbitrarily.
    // Browser will set a default; setting custom headers can cause signature mismatch.
    const res = await fetch(url, {
      method: 'PUT',
      body: blob,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`PUT part failed: ${res.status} ${text}`);
    }

    const etag = normalizeETag(res.headers.get('ETag'));
    if (!etag) {
      // ETag should be present for UploadPart responses
      throw new Error('Missing ETag header from S3 response');
    }
    return etag;
  }

  async function uploadWithConcurrency<T>(
    items: T[],
    worker: (item: T) => Promise<void>,
    limit: number,
  ) {
    const queue = [...items];
    const runners: Promise<void>[] = [];

    async function runOne() {
      while (queue.length > 0) {
        const item = queue.shift()!;
        await worker(item);
      }
    }

    const n = Math.max(1, Math.min(limit, items.length));
    for (let i = 0; i < n; i++) {
      runners.push(runOne());
    }

    await Promise.all(runners);
  }

  async function startUpload() {
    if (!file) return;
    setError('');
    setLogLines([]);
    setPhase('INITING');
    setProgress({ uploaded: 0, total: file.size });

    try {
      log(`init start: name=${file.name}, size=${file.size}`);
      const init = await apiInit(file);
      console.log(init);
      log(
        `init ok: videoId=${init.data.videoId}, uploadId=${init.data.uploadId}, partSize=${init.data.partSizeBytes}, parts=${init.data.presignedParts.length}`,
      );

      // local slicing based on partSizeBytes returned by server
      const localParts = sliceFileIntoParts(file, init.data.partSizeBytes);

      // sanity check: server-provided part count should match our calculated one
      if (init.data.presignedParts.length !== localParts.length) {
        log(
          `WARN: part count mismatch (server=${init.data.presignedParts.length}, local=${localParts.length}). Using local count.`,
        );
      }

      // Map partNumber -> presigned URL
      const urlByPartNumber = new Map<number, string>();
      for (const p of init.data.presignedParts)
        urlByPartNumber.set(p.partNumber, p.url);

      // Collect completed parts (partNumber, etag)
      const completed: { partNumber: number; eTag: string }[] = [];

      setPhase('UPLOADING');

      // progress updates
      const uploadedBytes = new Array(localParts.length).fill(0);

      await uploadWithConcurrency(
        localParts,
        async (lp) => {
          const url = urlByPartNumber.get(lp.partNumber);
          if (!url)
            throw new Error(
              `Missing presigned url for partNumber=${lp.partNumber}`,
            );

          log(`PUT part ${lp.partNumber} start (${lp.end - lp.start} bytes)`);
          // Optional: small jitter to reduce bursts
          await sleep(30);

          const etag = await putPart(url, lp.blob);

          completed.push({ partNumber: lp.partNumber, eTag: etag });

          uploadedBytes[lp.partNumber - 1] = lp.end - lp.start;
          const sum = uploadedBytes.reduce((a: number, b: number) => a + b, 0);
          setProgress({ uploaded: sum, total: file.size });

          log(`PUT part ${lp.partNumber} ok, ETag=${etag}`);
        },
        concurrency,
      );

      // sort parts by partNumber for complete
      completed.sort((a, b) => a.partNumber - b.partNumber);

      setPhase('COMPLETING');
      log(`complete start: parts=${completed.length}`);

      const completeReq: MultipartCompleteRequest = {
        uploadId: init.data.uploadId,
        sizeBytes: file.size,
        parts: completed,
      };

      await apiComplete(init.data.videoId, completeReq);

      log(`complete ok: videoId=${init.data.videoId}`);
      setPhase('DONE');
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? 'Unknown error');
      setPhase('ERROR');
      log(`ERROR: ${e?.message ?? e}`);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Multipart Upload Test</h1>

      <div
        style={{
          marginTop: 16,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>Concurrency</span>
          <input
            type="number"
            min={1}
            max={8}
            value={concurrency}
            onChange={(e) => setConcurrency(Number(e.target.value))}
            style={{ width: 80 }}
          />
        </label>

        <button
          onClick={startUpload}
          disabled={
            !file ||
            phase === 'INITING' ||
            phase === 'UPLOADING' ||
            phase === 'COMPLETING'
          }
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid #ccc',
            cursor: 'pointer',
            opacity: !file ? 0.5 : 1,
          }}
        >
          Start Upload
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <div>
          Phase: <b>{phase}</b>
        </div>
        <div style={{ marginTop: 6 }}>
          Progress: <b>{progressPct}%</b> ({progress.uploaded.toLocaleString()}{' '}
          / {progress.total.toLocaleString()} bytes)
        </div>
        <div
          style={{
            marginTop: 8,
            height: 12,
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: 8,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              borderRadius: 8,
            }}
          />
        </div>
        {error && (
          <div style={{ marginTop: 12, color: 'crimson' }}>Error: {error}</div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Logs</h2>
        <pre
          style={{
            background: '#111',
            color: '#eee',
            padding: 12,
            borderRadius: 8,
            height: 360,
            overflow: 'auto',
            fontSize: 12,
          }}
        >
          {logLines.join('\n')}
        </pre>
      </div>

      <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.5 }}>
        <b>주의사항</b>
        <ul>
          <li>
            S3 버킷 CORS에 <code>PUT, OPTIONS</code>와 프론트 origin(예:{' '}
            <code>http://localhost:3000</code>)이 허용되어 있어야 합니다.
          </li>
          <li>
            UploadPart presigned URL은 서명 깨질 수 있으니{' '}
            <b>불필요한 헤더를 추가하지 마세요</b>(특히 Content-Type).
          </li>
          <li>
            Complete는 서버가 <code>uploadId</code> 매칭 검증을 하므로, init
            응답의 uploadId 그대로 보내야 합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
