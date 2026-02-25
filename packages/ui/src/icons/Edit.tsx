import * as React from 'react';
import type { SVGProps } from 'react';
const SvgEdit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 14.5"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      clipPath="url(#Edit_svg__a)"
    >
      <path d="M8 2H3.333A1.333 1.333 0 0 0 2 3.333v9.334A1.333 1.333 0 0 0 3.333 14h9.334A1.334 1.334 0 0 0 14 12.667V8" />
      <path d="M12.25 1.75a1.414 1.414 0 1 1 2 2L8.241 9.76a1.33 1.33 0 0 1-.568.336l-1.916.56a.334.334 0 0 1-.413-.413l.56-1.916c.063-.214.179-.41.337-.568z" />
    </g>
    <defs>
      <clipPath id="Edit_svg__a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgEdit;
