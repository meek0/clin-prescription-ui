import intl from 'react-intl-universal';
import { Tag } from 'antd';

interface OwnProps {
  familyCode: string | undefined;
}

const PositionTag = ({ familyCode }: OwnProps) =>
  familyCode ? (
    <Tag color="geekblue">{intl.get(familyCode)}</Tag>
  ) : (
    <Tag color="red">{intl.get('proband')}</Tag>
  );

export default PositionTag;
