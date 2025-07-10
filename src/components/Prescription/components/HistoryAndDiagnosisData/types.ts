import { HybridAnalysis } from 'api/hybrid/models';

export interface IHistoryAndDiagnosisDataType
  extends Pick<
    HybridAnalysis,
    'history' | 'ethnicity_codes' | 'inbreeding' | 'diagnosis_hypothesis'
  > {
  report_health_conditions: boolean;
}
