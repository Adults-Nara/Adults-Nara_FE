import { Chip } from '@repo/ui';
import React from 'react';

interface IconChipProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  iconWidth?: number;
  iconHeight?: number;
}

export function IconChip({
  icon: Icon,
  label,
  iconWidth,
  iconHeight,
}: IconChipProps) {
  return (
    <Chip>
      <div className="body2 flex flex-row items-center gap-1 text-gray-800">
        <Icon width={iconWidth || 20} height={iconHeight || 20} />
        <p>{label}</p>
      </div>
    </Chip>
  );
}
