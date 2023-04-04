/* eslint-disable */
import cx from 'classnames';

import { IconProps } from '.';

const AcmgNoVerdictCheck = ({ className = '', width = '16', height = '16' }: IconProps) => (
  <svg
    className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_1050_33951"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="2"
      width="17"
      height="12"
    >
      <path
        d="M13.1883 2.17459C12.5169 2.42637 12.5869 2.35643 9.80328 5.15401L7.41135 7.55993L6.0825 6.21709C4.61377 4.73437 3.98432 4.3567 3.03314 4.41265C1.04686 4.53854 -0.0441915 6.60875 0.976924 8.32926C1.43852 9.12657 5.92863 13.5048 6.44619 13.6866C7.06165 13.8964 8.12473 13.7985 8.64228 13.4628C8.89407 13.3089 10.7125 11.5605 12.6988 9.57418C16.3916 5.85341 16.5874 5.60162 16.5874 4.52456C16.5874 4.09093 16.2097 3.23767 15.846 2.84601C15.1886 2.13263 14.0836 1.85287 13.1883 2.17459Z"
        fill="black"
      />
    </mask>
    <g mask="url(#mask0_1050_33951)">
      <rect x="0.501221" y="-0.119431" width="16.0861" height="16.0861" fill="url(#pattern1)" />
      <rect
        x="0.501221"
        y="-0.119431"
        width="16.0861"
        height="16.0861"
        fill="#002440"
        style={{ mixBlendMode: 'color' }}
      />
    </g>
    <defs>
      <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_1050_33951" transform="scale(0.0208333)" />
      </pattern>
      <image
        id="image0_1050_33951"
        width="48"
        height="48"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);
export default AcmgNoVerdictCheck;
