import { IListNameValueItem } from 'api/form/models';
import { HybridPatientExam, HybridPatientParaClinical } from 'api/hybrid/models';

export interface IParaclinicalExamSimpleInputExtra {
  name: number;
  label?: string;
}

export interface IParaclinicalExamMultiSelectExtra extends IParaclinicalExamSimpleInputExtra {
  options: IListNameValueItem[];
  required: boolean;
}

export enum ParaclinicalExamStatus {
  NOT_DONE = 'NOT_DONE',
  ABNORMAL = 'ABNORMAL',
  NORMAL = 'NORMAL',
}

export interface IParaclinicalExamItem extends HybridPatientExam {
  value?: string;
}

export interface IParaclinicalExamsDataType extends HybridPatientParaClinical {
  exams: IParaclinicalExamItem[];
}
