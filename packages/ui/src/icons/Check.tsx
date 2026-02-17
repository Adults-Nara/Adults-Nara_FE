import * as React from "react";
import type { SVGProps } from "react";
const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 10"
    {...props}
  >
    <path
      fill="currentColor"
      d="M4.485 9.523a1 1 0 0 1-.32-.054.74.74 0 0 1-.276-.18L.225 5.624A.8.8 0 0 1 0 5.017a.86.86 0 0 1 .246-.607.8.8 0 0 1 .596-.234q.362 0 .597.234l3.046 3.047L11.708.234A.82.82 0 0 1 12.315 0q.373 0 .607.234a.82.82 0 0 1 .234.607.82.82 0 0 1-.234.608l-7.84 7.84a.74.74 0 0 1-.277.18 1 1 0 0 1-.32.054"
    />
  </svg>
);
export default SvgCheck;
