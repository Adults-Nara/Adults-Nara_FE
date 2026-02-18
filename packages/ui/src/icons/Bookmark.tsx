import * as React from "react";
import type { SVGProps } from "react";
const SvgBookmark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 28"
    {...props}
  >
    <path
      fill="currentColor"
      d="M17.14 0H2.846C1.272 0 0 1.298 0 2.885v24.522l9.993-7.212L20 27.407V2.885C20 1.298 18.713 0 17.14 0m0 21.637L9.994 16.77l-7.148 4.868V2.885H17.14z"
    />
  </svg>
);
export default SvgBookmark;
