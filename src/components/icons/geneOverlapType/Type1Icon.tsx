/* eslint-disable max-len */
import React from 'react';
import cx from 'classnames';

import { IconProps } from '..';

const Type1Icon = ({ className = '', width = '24', height = '24' }: IconProps) => (
  <svg
    className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 15V17H22V15H2Z" fill="#8F8F8F" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 6.05664L14.924 10.735L14.076 11.265L12 7.94344L9.92405 11.265L9.07605 10.735L12 6.05664Z"
      fill="#8F8F8F"
    />
    <path d="M10.8 12H6V10H10.8V12Z" fill="black" />
    <path d="M13.2 12H18V10H13.2V12Z" fill="black" />
  </svg>
);
export default Type1Icon;
