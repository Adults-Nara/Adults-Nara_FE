'use client';

import { findLabelByValue } from '@/utils/findLabelByValue';
import { useLongPressTTS } from '@/hooks/useLongPressTTS';
import { Chip } from '@repo/ui';
import { Sparkles, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface VideoDescriptionProps {
  aiSummary: string;
  description: string;
  tags: string[];
}

export function VideoDescription({
  aiSummary,
  description,
  tags,
}: VideoDescriptionProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const headerContent = aiSummary ?? description;
  const descTTS = useLongPressTTS(headerContent);
  const fileIcon = (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800">
      <FileText className="h-5 w-5 text-white" />
    </div>
  );
  const headerIcon = aiSummary ? (
    <div className="from-primary-500 to-uplus flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-r">
      <Sparkles className="h-4 w-4 text-white" />
    </div>
  ) : (
    fileIcon
  );

  const headerTitle = aiSummary ? 'AI 요약' : '영상 설명';

  return (
    <div
      className="relative flex flex-col rounded-2xl bg-gray-200/50 p-4"
      onClick={() => setIsDescExpanded(!isDescExpanded)}
    >
      {/* 헤더 */}
      <div className="flex flex-row items-center gap-2">
        {headerIcon}
        <h3 className="title3 shrink-0">{headerTitle}</h3>
        <div className="ml-auto shrink-0">
          {isDescExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {/* 헤더 내용 */}
      <div className="overflow-hidden px-1">
        <p
          {...descTTS}
          className={`body2 mt-2 text-gray-800 transition-all duration-300 ${
            isDescExpanded
              ? 'whitespace-pre-wrap'
              : 'overflow-hidden text-ellipsis whitespace-nowrap'
          }`}
        >
          {headerContent}
        </p>
      </div>

      {/* 확장되는 부분 */}
      <div
        className={`flex flex-col overflow-hidden transition-all duration-300 ${
          isDescExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {aiSummary && (
          <>
            <p className="body4 px-1 text-gray-500">
              AI를 통해 자동 생성된 영상 요약입니다.
            </p>
            <div className="mt-2 flex items-center gap-2 border-t border-gray-300 pt-2">
              {fileIcon}
              <p className="title3 text-gray-900">영상 설명</p>
            </div>
            <div className="body2 px-1 pt-2 text-gray-700">{description}</div>
          </>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((v) => (
            <Chip key={v} className="text-gray-700">
              {`# ${findLabelByValue(v)}`}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
