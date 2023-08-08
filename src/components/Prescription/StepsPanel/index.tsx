import { Space, Steps, Typography } from 'antd';

import { useGlobals } from 'store/global';
import { usePrescriptionForm } from 'store/prescription';

import styles from './index.module.scss';

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
      <Steps direction="vertical" size="small" current={currentStep?.index}>
        {/**
          onStepClick={(index) => {
              dispatch(
                prescriptionFormActions.goTo({
                  index,
                }),
              );
            }} */}
        {config?.steps.map((step) => (
          <Steps.Step className={styles.stepsItem} key={step.index} title={step.title} />
        ))}
      </Steps>
    </Space>
  );
};

export default StepsPanel;
