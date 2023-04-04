import intl from 'react-intl-universal';
import { Typography } from 'antd';

import styles from './index.module.scss';

interface OwnProps {
  value?: number;
}

const { Text } = Typography;

const GestationalAge = ({ value }: OwnProps) =>
  value ? (
    <Text className={styles.calculatedGestationalAge}>
      {intl.get('prescription.patient.identification.calculated.gestational.age', {
        value,
      })}
    </Text>
  ) : null;

export default GestationalAge;
