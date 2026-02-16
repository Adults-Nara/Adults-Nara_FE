import * as React from "react";
import type { SVGProps } from "react";
const SvgUpArrow = (props: SVGProps<SVGSVGElement>) => (
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
      d="m21.179 12.357-10-10-10 10"
    />
  </svg>
);
export default SvgUpArrow;
