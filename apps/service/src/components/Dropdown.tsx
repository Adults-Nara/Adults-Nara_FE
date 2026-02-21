'use client';

import { cn, DownArrow } from '@repo/ui';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Options {
  id: string;
  label: string;
}

interface DropdownProps {
  onChange: (value: string) => void;
  value: string | null;
  options: Options[];
  placeholder?: string;
  width?: string;
}

const Dropdown = ({
  onChange,
  value,
  options,
  placeholder = '이유를 선택하세요',
  width = 'w-[300px]',
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.id === value);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn(width, 'body2 relative h-[40px]')}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'border-primary flex h-[40px] w-full cursor-pointer items-center justify-between rounded-[10px] border bg-white p-[15px]',
        )}
      >
        {selected?.label ?? placeholder} <DownArrow />
      </button>

      <motion.ul
        className={cn(
          width,
          'no-scrollbar absolute z-10 max-h-[180px] overflow-auto [&>li:first-child]:rounded-t-[10px] [&>li:first-child]:border-none [&>li:last-child]:rounded-b-[10px]',
        )}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {options.map((option) => {
          return (
            <li
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={cn(
                'border-primary hover:bg-primary-100 flex h-[40px] cursor-pointer items-center border-t bg-white p-[15px]',
              )}
            >
              {option.label}
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
};
export default Dropdown;
