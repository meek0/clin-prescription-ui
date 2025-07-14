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
