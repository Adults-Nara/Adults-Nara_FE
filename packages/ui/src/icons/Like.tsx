import * as React from "react";
import type { SVGProps } from "react";
const SvgLike = (props: SVGProps<SVGSVGElement>) => (
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
      d="M1.76 8.912h4.153v10.502H1.76a.876.876 0 0 1-.877-.877V9.79a.876.876 0 0 1 .877-.877M5.914 8.912l4.451-7.116a1.91 1.91 0 0 1 1.648-.911 1.946 1.946 0 0 1 2.015 1.927v5.1h4.905a2.015 2.015 0 0 1 1.928 2.314l-1.402 8.486a2 2 0 0 1-1.98 1.753H8.77a3.5 3.5 0 0 1-1.577-.369l-1.262-.63M5.914 8.912v9.943"
    />
  </svg>
);
export default SvgLike;
