import intl from 'react-intl-universal';
import { Descriptions, Divider } from 'antd';

interface OwnProps {
  className?: string;
}

const PrescriptionSummary = ({ className = '' }: OwnProps) => (
  <div className={className}>
    <Descriptions column={1} size="small">
      <Descriptions.Item label={intl.get('prescriptino.add.parent.summary.prescription.id')}>
        -
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescriptino.add.parent.summary.asked.analysis')}>
        -
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescriptino.add.parent.summary.prescriber')}>
        -
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescriptino.add.parent.summary.createdOn')}>
        -
      </Descriptions.Item>
    </Descriptions>
    <Divider style={{ margin: '12px 0' }} />
    <Descriptions column={1} size="small">
      <Descriptions.Item label={intl.get('prescriptino.add.parent.summary.cas.index')}>
        -
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('MTH')}>-</Descriptions.Item>
    </Descriptions>
  </div>
);

export default PrescriptionSummary;
