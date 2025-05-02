import { TFormConfig } from 'api/form/models';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

type IDOwnProps = {
  ethnicityCodes?: string[];
  prescriptionConfig?: TFormConfig;
};

export const Ethnicity = ({ ethnicityCodes, prescriptionConfig }: IDOwnProps) => (
  <>
    {ethnicityCodes
      ?.map(
        (ethnicityCode) =>
          prescriptionConfig?.history_and_diagnosis?.ethnicities?.find(
            (code) => code.value === ethnicityCode,
          )?.name || ethnicityCode,
      )
      .join(' | ') || EMPTY_FIELD}
  </>
);
