import * as React from "react";
import type { SVGProps } from "react";
const SvgView = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <circle cx={10} cy={10} r={2.5} stroke="currentColor" strokeWidth={1.667} />
    <path
      stroke="currentColor"
      strokeWidth={1.667}
      d="M16.823 9.112c.324.393.486.589.486.888s-.162.495-.486.888C15.64 12.325 13.03 15 10 15s-5.64-2.675-6.823-4.112c-.324-.393-.486-.589-.486-.888s.162-.495.486-.888C4.36 7.675 6.97 5 10 5s5.64 2.675 6.823 4.112Z"
    />
  </svg>
);
export default SvgView;
