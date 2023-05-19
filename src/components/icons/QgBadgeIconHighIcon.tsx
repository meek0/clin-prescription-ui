import React from 'react';

import { IconProps } from 'components/icons';

const QgHighBadgeIcon = ({ svgClass = '' }: IconProps) => (
  <svg
    className={svgClass}
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="currentColor"
    stroke="currentStoke"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="4" r="3.5" />
  </svg>
);

export default QgHighBadgeIcon;
