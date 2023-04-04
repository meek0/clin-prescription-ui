/* eslint-disable max-len */
import React from 'react';
import cx from 'classnames';

import { IconProps } from '..';

const Type2Icon = ({ className = '', width = '24', height = '24' }: IconProps) => (
  <svg
    className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 15V17H12V15H2Z" fill="#8F8F8F" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 6.05664L16.924 10.735L16.076 11.265L14 7.94344L11.924 11.265L11.076 10.735L14 6.05664Z"
      fill="#8F8F8F"
    />
    <path d="M12.4 12H6V10H12.4V12Z" fill="black" />
    <path d="M15.6 12H22V10H15.6V12Z" fill="black" />
  </svg>
);
export default Type2Icon;
