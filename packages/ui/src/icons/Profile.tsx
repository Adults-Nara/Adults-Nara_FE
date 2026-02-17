import * as React from "react";
import type { SVGProps } from "react";
const SvgProfile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 29 29"
    {...props}
  >
    <path
      fill="currentColor"
      d="M14.04 0C6.29 0 0 6.29 0 14.04c0 7.751 6.29 14.041 14.04 14.041 7.751 0 14.041-6.29 14.041-14.04S21.791 0 14.041 0m0 5.616a4.92 4.92 0 0 1 4.915 4.915 4.92 4.92 0 0 1-4.914 4.914 4.92 4.92 0 0 1-4.915-4.914 4.92 4.92 0 0 1 4.915-4.915m0 19.657c-2.85 0-6.22-1.151-8.62-4.043a13.97 13.97 0 0 1 8.62-2.977c3.258 0 6.249 1.123 8.622 2.977-2.401 2.892-5.771 4.043-8.621 4.043"
    />
  </svg>
);
export default SvgProfile;
