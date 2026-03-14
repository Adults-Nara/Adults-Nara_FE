import type { SVGProps } from 'react';
const SvgPause = ({
  fill = 'rgba(255,255,255,0.8)',
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill={fill} {...props}>
    <rect x="5" y="3" width="4" height="18" />
    <rect x="15" y="3" width="4" height="18" />
  </svg>
);
export default SvgPause;
