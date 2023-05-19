import { ArrangerNodeData } from 'graphql/models';

export type ITableSequencingResult = SequencingResult & {
  key: string;
};

export interface SequencingResult extends ArrangerNodeData {
  id: string;
  score: number;
  analysis_code: string;
  created_on: string;
  ep: string;
  ldm: string;
  patient_id: string;
  patient_mrn: string;
  prenatal: boolean;
  prescription_id: string;
  priority: string;
  requester: string;
  security_tags: string;
  status: string;
  timestamp: string;
  request_id: string;
  sample: string;
}
