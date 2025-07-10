export type ResourceType =
  | 'Practitioner'
  | 'Patient'
  | 'Observation'
  | 'ClinicalImpression'
  | 'FamilyMemberHistory'
  | 'ServiceRequest'
  | 'Organization'
  | 'PractitionerRole'
  | 'Group'
  | 'Bundle'
  | 'Task'
  | 'DocumentReference'
  | 'Specimen';

export type BundleMethod = 'PUT' | 'GET' | 'POST';

export interface Patient {
  id?: string;
  resourceType: ResourceType;
  meta: Meta;
  extension: Extension[];
  identifier: Identifier[];
  active: boolean;
  name: Name[];
  birthDate?: string;
  gender: string;
  generalPractitioner: Reference[];
  managingOrganization: Reference;
}

export interface ServiceRequestCodeConcept {
  code: string;
  display: string;
  designation: {
    language: 'fr' | 'en';
    value: string;
  }[];
}

export interface ServiceRequestCode {
  concept: ServiceRequestCodeConcept[];
}

export interface Reference {
  reference: string;
}

export interface Meta {
  profile: string[];
  lastUpdated?: string;
}

export interface Telecom {
  system: string;
  value: string;
  use: string;
  rank?: number;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Coding {
  system?: string;
  code: string;
  display?: string;
}

export interface Age {
  value: number;
  unit: string;
  system: string;
  code: string;
}

export interface Identifier {
  use?: string;
  type: CodeableConcept;
  value: string;
  assigner?: Reference;
}

export interface Extension<TReference = Reference> {
  url: string;
  valueCoding?: CodeableConcept;
  valueReference?: TReference;
  valueBoolean?: boolean;
  valueAge?: Age;
  valueCodeableConcept?: CodeableConcept;
  extension?: Extension<TReference>[];

  [key: string]: any;
}

export interface Name {
  use?: string;
  family: string;
  given: string;
  prefix?: string[];
  suffix?: string[];
}

export interface BundleEntry<T> {
  request: {
    method: BundleMethod;
    url: string;
  };
  fullUrl?: string;
  resource?: T;
}

export interface Bundle<FhirResource> {
  resourceType: ResourceType;
  id?: string;
  type: string;
  entry: BundleEntry<FhirResource>[];
}

export interface Patient {
  id?: string;
  resourceType: ResourceType;
  meta: Meta;
  extension: Extension[];
  identifier: Identifier[];
  active: boolean;
  name: Name[];
  birthDate?: string;
  gender: string;
  generalPractitioner: Reference[];
  managingOrganization: Reference;
}

export interface PractitionerRole {
  resourceType: ResourceType;
  id: string;
  meta: Meta;
  active: boolean;
  practitioner: Reference;
  organization: Reference;
  telecom: Telecom[];
  code: CodeableConcept[];
}

export type PractitionerBundleType = (Practitioner | PractitionerRole)[];

export interface Practitioner {
  id: string;
  name: [
    {
      family: string;
      given: string[];
    },
  ];
  resourceType: string;
}

export interface Investigation {
  item: {
    item?: {
      code?: {
        coding: Coding;
      };
      focus: Reference;
    };
    reference: string;
    resource: {
      code: CodeableConcept;
      interpretation: CodeableConcept;
      value: CodeableConcept;
    };
  }[];
}

export interface ClinicalImpression {
  id?: string;
  resourceType: ResourceType;
  investigation: Investigation[];
}

export interface Person {
  id: string;
  birthdate: string;
  ramq: string;
  name: Name[];
}

// For Bio Analysis Entity Page
export interface AnalysisTaskSample {
  code: string;
  id: string;
  value: string;
  parent: {
    resource: {
      code: string;
      id: string;
      value: string;
    };
  }[];
}

export interface AnalysisTaskExperiment {
  name: string;
  alias: string;
  experimentalStrategy: string;
  platform: string;
  captureKit: string;
  sequencerId: string;
  runDate: string;
  aliquotId: string;
}

export interface AnalysisTaskWorkflow {
  name: string;
  version: string;
  genomeBuild: string;
}

// For Prescription Entity Page
export interface ServiceRequestEntity {
  id: string;
  authoredOn: string;
  status: string;
  meta: Meta;
  priority: string;
  code: string;
  category: {
    text: string;
    coding: {
      code: string;
    }[];
  }[];
  note: {
    text: string;
  };
  requester: RequesterType;
  orderDetail: {
    text: string;
  };
  observation: {
    id: string;
    investigation: {
      item: {
        id: string[];
        resourceType: string;
        focus?: Reference;
        note: {
          text: string;
        };
        relationship: {
          coding: {
            code: string;
          };
        };
        coding: {
          code: string;
        };
        category: {
          coding: {
            code: string;
          }[];
        }[];
      }[];
    };
  };
  extensions: ServiceRequestEntityExtension[];
  performer: {
    resource: {
      alias: string;
      name: string;
    };
  };
  subject: {
    reference: string;
    resource: PatientServiceRequestFragment;
  };
  basedOn: { reference: string };
}

export type ServiceRequestEntityExtension = Extension<{
  reference: string;
  resource: PatientServiceRequestFragment;
}>;

export interface PatientRequestSpecimen {
  reference: string;
  resource: {
    parent?: Reference[];
    accessionIdentifier: {
      system: string;
      value: string;
    };
  };
}

export interface PatientRequest {
  category?: {
    text: string;
    coding: {
      code: string;
    }[];
  }[];
  authoredOn: string;
  id: string;
  status: string;
  specimen: PatientRequestSpecimen[];
}

export interface PatientServiceRequestFragment {
  id: string;
  gender: string;
  mrn: string;
  managingOrganization: Reference;
  clinicalImpressions: ClinicalImpression[];
  person: Person[];
  requests: PatientRequest[];
}

export type PhenotypeRequestEntity = {
  id: string;
  extension: {
    valueCoding: {
      code: string;
    };
  };
  valueCodeableConcept: {
    coding: {
      code: string;
    };
  };
  interpretation: {
    coding: {
      code: string;
    };
  };
  focus: {
    resource: any;
    reference: any;
  };
};

export type ParaclinicEntity = {
  id: string;
  code: string;
  interpretation: {
    coding: {
      code: string;
    };
  };
  category: string;
  valueString: string;
  valueCodeableConcept: {
    coding: {
      code: string;
    }[];
  };
};

export type CodeListEntity = {
  concept: {
    code: string;
    display: string;
    designation: {
      value: string;
      language: string;
    }[];
  }[];
};

export type FamilyMemberHistoryEntity = {
  id: string;
  relationship: {
    coding: {
      code: string;
    }[];
  };
  note: {
    text: string;
  };
};

export type RequesterType = {
  id: string;
  organization: {
    reference: string;
  };
  practitioner: {
    id: string;
    name: {
      family: string;
      given: string[];
    };
    identifier: {
      value: string;
    };
  };
};
