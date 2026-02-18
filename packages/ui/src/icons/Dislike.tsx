import * as React from "react";
import type { SVGProps } from "react";
const SvgDislike = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.767}
      d="M20.007 12.436h-4.154V1.934h4.154a.876.876 0 0 1 .876.877v8.748a.876.876 0 0 1-.876.877M15.853 12.436l-4.452 7.116a1.91 1.91 0 0 1-1.647.911 1.944 1.944 0 0 1-2.016-1.928v-5.1H2.833a2.014 2.014 0 0 1-1.927-2.313l1.402-8.486A2 2 0 0 1 4.288.883h8.708a3.5 3.5 0 0 1 1.578.368l1.261.631M15.853 12.436V2.493"
    />
  </svg>
);
export default SvgDislike;
