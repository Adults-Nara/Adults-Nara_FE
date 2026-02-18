import * as React from "react";
import type { SVGProps } from "react";
const SvgUnpower = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <g clipPath="url(#Unpower_svg__a)">
      <path
        fill="currentColor"
        d="M10.833 2.5H9.167v8.333h1.666zm4.025 1.808-1.183 1.184A5.77 5.77 0 0 1 15.833 10 5.83 5.83 0 0 1 10 15.833a5.83 5.83 0 0 1-3.683-10.35L5.142 4.308A7.44 7.44 0 0 0 2.5 10a7.5 7.5 0 0 0 15 0 7.44 7.44 0 0 0-2.642-5.692"
      />
    </g>
    <defs>
      <clipPath id="Unpower_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgUnpower;
