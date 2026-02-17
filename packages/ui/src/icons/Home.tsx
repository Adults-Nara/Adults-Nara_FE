import * as React from "react";
import type { SVGProps } from "react";
const SvgHome = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 27 27"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={2.34}
      d="M1.17 13.125c0-2.079 0-3.118.482-4.032.482-.913 1.386-1.59 3.196-2.943l1.755-1.312c3.27-2.445 4.905-3.668 6.853-3.668s3.583 1.223 6.853 3.668l1.755 1.312c1.81 1.353 2.714 2.03 3.196 2.943.481.914.481 1.953.481 4.032v6.492c0 2.887 0 4.33-1.028 5.227s-2.682.897-5.992.897H8.191c-3.31 0-4.965 0-5.993-.896-1.028-.897-1.028-2.34-1.028-5.228z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.34}
      d="M17.551 25.741v-7.946c0-.781-.633-1.414-1.414-1.414h-5.363c-.78 0-1.413.633-1.413 1.414v7.946"
    />
  </svg>
);
export default SvgHome;
