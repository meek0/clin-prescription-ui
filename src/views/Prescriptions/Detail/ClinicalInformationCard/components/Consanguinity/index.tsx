import intl from 'react-intl-universal';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

type IDOwnProps = {
  inbreeding?: boolean;
};

export const Consanguinity = ({ inbreeding }: IDOwnProps) =>
  inbreeding === undefined ? (
    <>{EMPTY_FIELD}</>
  ) : (
    <>{inbreeding ? intl.get('yes') : intl.get('no')}</>
  );
