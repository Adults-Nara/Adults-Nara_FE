import * as React from 'react';
import type { SVGProps } from 'react';
const SvgLeftArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 19"
    {...props}
  >
    <path
      fill="currentColor"
      d="m1.048 9.413-.524-.524L0 9.413l.524.523zm20 .74a.74.74 0 1 0 0-1.481v1.481M9.937.523 9.413 0 .523 8.889l.525.524.523.523 8.89-8.888zm-8.89 8.89-.523.523 8.889 8.89.524-.524.523-.524-8.889-8.89zm0 0v.74h20V8.672h-20z"
    />
  </svg>
);
export default SvgLeftArrow;
