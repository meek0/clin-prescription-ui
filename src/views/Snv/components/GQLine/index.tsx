import { Space } from 'antd';

import QgHighBadgeIcon from 'components/icons/QgBadgeIconHighIcon';
import QgLowBadgeIcon from 'components/icons/QgBadgeIconLowIcon';
import { TABLE_EMPTY_PLACE_HOLDER } from 'utils/constants';

import style from './index.module.scss';

interface OwnProps {
  value?: number;
}

const GqLine = ({ value }: OwnProps) =>
  value || typeof value === 'number' ? (
    <Space>
      {value < 20 ? (
        <QgLowBadgeIcon svgClass={style.low} />
      ) : (
        <QgHighBadgeIcon svgClass={style.high} />
      )}
      {value}
    </Space>
  ) : (
    <>{TABLE_EMPTY_PLACE_HOLDER}</>
  );

export default GqLine;
