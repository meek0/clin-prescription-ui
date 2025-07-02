export type TFormConfig = {
  prescribing_institutions: IListNameValueItem[];
  clinical_signs: {
    default_list: IListNameValueItem[];
    onset_age: IListNameValueItem[];
  };
  paraclinical_exams: {
    default_list: IParaclinicalExamItem[];
  };
  history_and_diagnosis: {
    parental_links: IListNameValueItem[];
    ethnicities: IListNameValueItem[];
  };
};

type IParaclinicalExamItem = IListNameValueItem & {
  extra?: IParaclinicalExamItemExtra;
  tooltip?: string;
};

export interface IParaclinicalExamItemExtra {
  type: 'string' | 'multi_select';
  unit?: string;
  required: boolean;
  label?: string;
  options?: IListNameValueItem[];
}

export interface IListNameValueItem {
  name: string;
  value: string;
}

export interface IFormPatient {
  first_name: string;
  last_name: string;
  gender: string;
  ep: string;
  birth_date: string;
  ramq: string;
  mrn: string;
}

export interface IHybridFormPatient {
  first_name: string;
  last_name: string;
  sex: string;
  organization_id: string;
  birth_date: string;
  jhn: string;
  mrn: string;
}

export function hybridToFormPatient(hybridPatient?: IHybridFormPatient): IFormPatient | undefined {
  if (!hybridPatient) return undefined;
  return {
    first_name: hybridPatient.first_name,
    last_name: hybridPatient.last_name,
    gender: hybridPatient.sex,
    ep: hybridPatient.organization_id,
    birth_date: hybridPatient.birth_date,
    ramq: hybridPatient.jhn,
    mrn: hybridPatient.mrn,
  };
}

export interface ISupervisor {
  supervisors: {
    id: string;
    name: string;
    license?: string;
  }[];
}
