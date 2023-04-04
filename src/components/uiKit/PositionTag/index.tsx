import intl from 'react-intl-universal';
import { Tag } from 'antd';

interface OwnProps {
  isParent: boolean | undefined;
}

const PositionTag = ({ isParent }: OwnProps) =>
  isParent ? (
    <Tag color="geekblue">{intl.get('parent')}</Tag>
  ) : (
    <Tag color="red">{intl.get('proband')}</Tag>
  );

export default PositionTag;
