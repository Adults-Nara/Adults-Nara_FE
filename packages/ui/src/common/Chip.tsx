"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Close } from "../icons";

const chipVariants = cva(
  "body2 inline-flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer  transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-200 text-black hover:bg-gray-500",
        selected: "bg-primary-500 text-white hover:bg-primary-700",
      },
      size: {
        lg: "rounded-lg w-25 h-[50px]",
        md: "rounded-3xl w-fit px-5 h-[35px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chipVariants> {
  selected?: boolean;
  onDelete?: () => void; // X 버튼 클릭 이벤트
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, size, selected, onDelete, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant: selected ? "selected" : variant, size, className }))}
        {...props}
      >
        {children}

        {selected && onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Close className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  },
);

Chip.displayName = "Chip";

export { Chip, chipVariants };
