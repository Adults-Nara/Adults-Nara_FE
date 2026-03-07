import { cn } from '@repo/ui';
import React from 'react';

export interface Column<T> {
  key: keyof T | 'checkbox' | 'actions';
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  selectedIds?: string[]; // 선택된 ID 목록
  onSelectChange?: (ids: string[]) => void; // 선택 변경 핸들러
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading,
  isError,
  selectedIds = [],

  onSelectChange,
}: DataTableProps<T>) {
  // 개별 선택 토글
  const toggleOne = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((itemId) => itemId !== id)
      : [...selectedIds, id];
    onSelectChange?.(newSelection);
  };

  const isAllSelected =
    data.length > 0 &&
    data.every((item) => selectedIds.includes(getRowId(item)));
  const toggleAll = () => {
    const pageIds = data.map((item) => getRowId(item));

    if (isAllSelected) {
      // 현재 페이지 것만 제거
      const newSelection = selectedIds.filter((id) => !pageIds.includes(id));
      onSelectChange?.(newSelection);
    } else {
      // 기존 선택 + 현재 페이지 추가
      const newSelection = Array.from(new Set([...selectedIds, ...pageIds]));
      onSelectChange?.(newSelection);
    }
  };
  return (
    <div className="max-h-150 w-full overflow-auto rounded-lg border border-gray-500 bg-white">
      <table className="w-full min-w-270 table-fixed text-left">
        <thead className="body2 sticky top-0 z-10 h-12.5 bg-gray-200 text-gray-900">
          <tr>
            <th className="w-12.5 content-center p-4 text-center shadow-[inset_0_-1px_0_0_#BEC1C7]">
              <input
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={isAllSelected}
                onChange={toggleAll}
              />
            </th>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className={`px-4 shadow-[inset_0_-1px_0_0_#BEC1C7] ${col.align === 'center' ? 'text-center' : ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="p-10 text-center text-gray-400"
              >
                로딩 중...
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="p-10 text-center text-red-400"
              >
                데이터를 불러오지 못했습니다.
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="p-10 text-center text-gray-400"
              >
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={getRowId(item)}
                className={cn(
                  `transition-colors hover:bg-gray-100 ${selectedIds.includes(getRowId(item)) ? 'bg-blue-100 hover:bg-blue-100' : ''}`,
                )}
              >
                <td className="w-12.5 p-4 text-center">
                  <input
                    type="checkbox"
                    className="h-4.5 w-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedIds.includes(getRowId(item))}
                    onChange={() => toggleOne(getRowId(item))}
                  />
                </td>
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`body2 px-4 py-3 ${col.align === 'center' ? 'text-center' : ''}`}
                  >
                    {col.render
                      ? col.render(item)
                      : (item[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
