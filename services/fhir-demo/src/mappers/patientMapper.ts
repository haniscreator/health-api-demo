import { InternalPatient, FhirPatient, MappingExplanation } from '../types/fhir';

/**
 * Maps an internal CP Patient object to a valid HL7 FHIR R4 Patient resource.
 * Follows the official HL7 Patient R4 specification.
 */
export const mapToFhirPatient = (internal: InternalPatient): FhirPatient => {
  // Parse Name into given and family names where possible, while retaining the full text
  const nameParts = internal.Name.trim().split(/\s+/);
  const family = nameParts.length > 1 ? nameParts[nameParts.length - 1] : undefined;
  const given = nameParts.length > 1 ? nameParts.slice(0, -1) : nameParts;

  // Map gender from numeric database values to FHIR administrative gender strings
  // 1 -> male, 2 -> female, 3 -> other, default -> unknown
  let fhirGender: 'male' | 'female' | 'other' | 'unknown' = 'unknown';
  if (internal.Gender === 1) {
    fhirGender = 'male';
  } else if (internal.Gender === 2) {
    fhirGender = 'female';
  } else if (internal.Gender === 3) {
    fhirGender = 'other';
  }

  // Build the FHIR Patient resource
  const fhirPatient: FhirPatient = {
    resourceType: 'Patient',
    active: true,
    
    // Hospital Registration No. (HNO) maps to Patient.identifier
    identifier: [
      {
        use: 'official',
        system: 'http://cpintl.org/hno', // Custom system URI representing HNO identification
        value: internal['Hospital Registration No. (HNO)']
      }
    ],

    // Name maps to Patient.name
    name: [
      {
        use: 'official',
        text: internal.Name,
        family,
        given
      }
    ],

    // Phone No. maps to Patient.telecom
    telecom: [
      {
        system: 'phone',
        value: internal['Phone No.'],
        use: 'mobile'
      }
    ],

    // Gender maps to Patient.gender
    gender: fhirGender,

    // Date of Birth maps to Patient.birthDate
    birthDate: internal['Date of Birth'],

    // Address maps to Patient.address
    address: [
      {
        use: 'home',
        text: internal.Address,
        line: [internal.Address]
      }
    ],

    // Extensions are used for fields that do not fit standard FHIR Patient resource attributes
    extension: [
      /*
       * Source Information (distributor/message) extension:
       * Explaining Why: Source Information describes the external ingestion channel or source
       * of this record. It is not part of the standard FHIR core Patient definition,
       * so we represent it using a custom extension with a unique URL.
       */
      {
        url: 'http://cpintl.org/fhir/StructureDefinition/source-information',
        valueString: internal['Source information (distributor/message)']
      },
      /*
       * Assessable Platform extension:
       * Explaining Why: Indicates which client application (e.g. web, mobile, desktop) was used 
       * to perform the patient assessment. Since this is specific to clinical platform workflow,
       * it is defined as an extension.
       */
      {
        url: 'http://cpintl.org/fhir/StructureDefinition/assessable-platform',
        valueString: internal['Assessable Platform']
      }
    ]
  };

  return fhirPatient;
};

/**
 * Explanation of how the internal database schema fields map to the HL7 FHIR standard
 */
export const MAPPING_EXPLANATION: MappingExplanation = {
  'Hospital Registration No. (HNO)': 'Mapped to Patient.identifier containing a system URI http://cpintl.org/hno and value matching the HNO.',
  'Name': 'Mapped to Patient.name, providing the full text name along with parsed given and family names.',
  'Age': 'Calculated from birthDate. Age is NOT stored in the FHIR Patient resource as it changes over time. Instead, birthDate is used as the single source of truth.',
  'Date of Birth': 'Mapped directly to Patient.birthDate in YYYY-MM-DD format.',
  'Gender': 'Mapped from internal numeric code (1=Male, 2=Female, 3=Other, default=Unknown) to the FHIR standard administrative gender string (male, female, other, unknown).',
  'Address': 'Mapped to Patient.address as a home-use address resource with text and line populated.',
  'Phone No.': 'Mapped to Patient.telecom as a mobile phone contact point.',
  'Source information (distributor/message)': 'Mapped to a custom FHIR Extension with URL http://cpintl.org/fhir/StructureDefinition/source-information since it is specific context not covered by core attributes.',
  'Drug allergy': 'Excluded from the Patient resource. In FHIR, drug allergies must be represented separately using the AllergyIntolerance resource, referencing this Patient.',
  'Assessable Platform': 'Mapped to a custom FHIR Extension with URL http://cpintl.org/fhir/StructureDefinition/assessable-platform as it represents workflow metadata.'
};
