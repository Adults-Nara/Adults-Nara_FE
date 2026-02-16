import * as React from "react";
import type { SVGProps } from "react";
const SvgDownArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 23 14"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={3.333}
      d="m21.179 1.179-10 10-10-10"
    />
  </svg>
);
export default SvgDownArrow;
