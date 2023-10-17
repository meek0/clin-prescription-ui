import React from 'react';
import intl from 'react-intl-universal';
import { Typography } from 'antd';

import styles from './index.module.scss';

const EmptySection = () => (
  <Typography.Text italic className={styles.emptySection}>
    {intl.get('prescription.patient.review.no.data.for.this.section')}
  </Typography.Text>
);

export default EmptySection;
