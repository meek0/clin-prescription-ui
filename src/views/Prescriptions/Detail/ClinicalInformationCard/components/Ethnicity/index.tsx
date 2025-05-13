import { useCodeSystem, useObservationEthnicityEntity } from 'graphql/prescriptions/actions';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { useLang } from 'store/global';

type IDOwnProps = {
  id: string;
};

export const Ethnicity = ({ id }: IDOwnProps) => {
  const { ethValue } = useObservationEthnicityEntity(id);
  const { codeInfo } = useCodeSystem('qc-ethnicity');
  const lang = useLang();

  const values =
    codeInfo?.concept.reduce((ethnicities: string[], ethn: any) => {
      ethValue?.valueCodeableConcept?.coding.forEach((coding: any) => {
        const designation =
          ethn.designation?.find((d: any) => d.language === lang)?.value || ethn.display;
        if (coding.code === ethn.code) ethnicities.push(designation);
      });
      return ethnicities;
    }, []) || [];

  return <>{values.length ? values.join(' | ') : EMPTY_FIELD}</>;
};
