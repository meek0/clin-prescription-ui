import { Space, Steps, Typography } from 'antd';

import { useGlobals } from 'store/global';
import { usePrescriptionForm } from 'store/prescription';

import styles from './index.module.css';

const { Title } = Typography;

const StepsPanel = () => {
  const { getAnalysisNameByCode } = useGlobals();
  const { config, currentStep } = usePrescriptionForm();

  return (
    <Space direction="vertical" size={24} className={styles.prescriptionStepsPanel}>
      <Space direction="vertical" size={3}>
        <Title className={styles.analyseTitle}>Analyse</Title>
        <Title level={4}>{getAnalysisNameByCode(config?.analysisTitle!, false)}</Title>
      </Space>
      <Steps
        direction="vertical"
        size="small"
        current={currentStep?.index}
        items={config?.steps.map((step) => ({ title: step.title }))}
      />
    </Space>
  );
};

export default StepsPanel;
