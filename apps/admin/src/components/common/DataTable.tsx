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
  isLoading?: boolean;
  selectedIds?: string[]; // 선택된 ID 목록
  onSelectChange?: (ids: string[]) => void; // 선택 변경 핸들러
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
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

  // 전체 선택/해제 토글
  const toggleAll = () => {
    if (selectedIds.length === data.length && data.length > 0) {
      onSelectChange?.([]); // 모두 해제
    } else {
      onSelectChange?.(data.map((item) => item.id)); // 모두 선택
    }
  };
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  return (
    <div className="max-h-150 w-full overflow-auto rounded-lg border border-gray-500 bg-white">
      <table className="w-full min-w-230 table-fixed text-left">
        <thead className="body2 h-12.5 border-b border-gray-500 bg-gray-200 text-gray-900">
          <tr>
            <th className="w-12.5 p-4 text-center">
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
                className={`px-4 ${col.align === 'center' ? 'text-center' : ''}`}
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
                colSpan={columns.length}
                className="p-10 text-center text-gray-400"
              >
                로딩 중...
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  `transition-colors hover:bg-gray-100 ${selectedIds.includes(item.id) ? 'bg-blue-100 hover:bg-blue-100' : ''}`,
                )}
              >
                <td className="w-12.5 p-4">
                  <input
                    type="checkbox"
                    className="h-4.5 w-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleOne(item.id)}
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
