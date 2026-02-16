import * as React from "react";
import type { SVGProps } from "react";
const SvgUserCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M2 18v-3a3 3 0 0 1 3-3h6m2.5 2.5 1 1L18 12m-6-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
    />
  </svg>
);
export default SvgUserCheck;
