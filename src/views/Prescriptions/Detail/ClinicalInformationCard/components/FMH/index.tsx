import { IListNameValueItem, TFormConfig } from 'api/form/models';
import { HybridAnalysis } from 'api/hybrid/models';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

type IDOwnProps = {
  history: HybridAnalysis['history'];
  prescriptionConfig?: TFormConfig;
};

const getFamilyHistoryInfo = (
  historyItem: HybridAnalysis['history'][0],
  parentalLinkCodes: IListNameValueItem[],
) => {
  const fmhValue =
    parentalLinkCodes?.find((code) => code.value === historyItem.parental_link_code)?.name ||
    historyItem.parental_link_code;

  return `${historyItem.condition} (${fmhValue})`;
};

export const FamilyHistory = ({ history, prescriptionConfig }: IDOwnProps) => {
  const parentalLinkCodes = prescriptionConfig?.history_and_diagnosis?.parental_links;

  if (history?.length) {
    const fmhList: string[] = [];
    history.forEach((historyItem) => {
      fmhList.push(getFamilyHistoryInfo(historyItem, parentalLinkCodes || []));
    });
    return <>{fmhList.join(', ')}</>;
  }
  return <>{EMPTY_FIELD}</>;
};
