export interface InternalPatient {
  'Hospital Registration No. (HNO)': string;
  'Name': string;
  'Age': number;
  'Date of Birth': string;
  'Gender': number; // 1 = Male, 2 = Female, 3 = Other, 0 = Unknown
  'Address': string;
  'Phone No.': string;
  'Source information (distributor/message)': string;
  'Drug allergy': string;
  'Assessable Platform': string;
}

export interface FhirExtension {
  url: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDecimal?: number;
}

export interface FhirIdentifier {
  use?: string;
  system?: string;
  value?: string;
}

export interface FhirName {
  use?: string;
  text?: string;
  family?: string;
  given?: string[];
}

export interface FhirTelecom {
  system?: string;
  value?: string;
  use?: string;
}

export interface FhirAddress {
  use?: string;
  text?: string;
  line?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface FhirPatient {
  resourceType: 'Patient';
  id?: string;
  active?: boolean;
  identifier?: FhirIdentifier[];
  name?: FhirName[];
  telecom?: FhirTelecom[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: FhirAddress[];
  extension?: FhirExtension[];
}

export interface MappingExplanation {
  'Hospital Registration No. (HNO)': string;
  'Name': string;
  'Age': string;
  'Date of Birth': string;
  'Gender': string;
  'Address': string;
  'Phone No.': string;
  'Source information (distributor/message)': string;
  'Drug allergy': string;
  'Assessable Platform': string;
}

export interface MappingResponse {
  internalPatient: InternalPatient;
  mappingExplanation: MappingExplanation;
  fhirPatient: FhirPatient;
}
