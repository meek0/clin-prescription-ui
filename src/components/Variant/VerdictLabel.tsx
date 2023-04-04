import React from 'react';
import { Tag } from 'antd';
import { VarsomeVerdict } from 'graphql/variants/models';

type VerdictLabelProps = {
  verdict: VarsomeVerdict;
};

type VerdictInfo = {
  label: string;
  color: string;
};

const getVerdictInfo = (verdict: string = ''): VerdictInfo | null => {
  switch (verdict.toLowerCase()) {
    case 'pathogenic':
      return { label: verdict, color: 'red' };
    case 'likely pathogenic':
      return { label: verdict, color: 'volcano' };
    case 'uncertain significance':
      return { label: verdict, color: 'gold' };
    case 'benign':
      return { label: verdict, color: 'green' };
    case 'likely benign':
      return { label: verdict, color: 'blue' };
    default:
      return null;
  }
};

const VerdictLabel = ({ verdict }: VerdictLabelProps): React.ReactElement => {
  const verdictInfo = getVerdictInfo(verdict?.verdict);

  return verdictInfo ? <Tag color={verdictInfo.color}>{verdictInfo.label}</Tag> : <></>;
};

export default VerdictLabel;
