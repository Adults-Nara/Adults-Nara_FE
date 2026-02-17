import * as React from "react";
import type { SVGProps } from "react";
const SvgLogout = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      clipPath="url(#Logout_svg__a)"
    >
      <path d="M9.5 10.5v2a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2M6.5 7h6M11 5l2 2-2 2" />
    </g>
    <defs>
      <clipPath id="Logout_svg__a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgLogout;
