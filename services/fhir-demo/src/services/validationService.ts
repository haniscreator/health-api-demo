import { FhirPatient } from '../types/fhir';

/**
 * Validates a FHIR Patient resource against the core specification rules.
 * Checks resourceType, identifiers, gender, birthDate, and basic schema rules.
 */
export const validateFhirPatient = (resource: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!resource || typeof resource !== 'object') {
    return { valid: false, errors: ['Resource must be a non-null object.'] };
  }

  // 1. Validate resourceType
  if (!resource.resourceType) {
    errors.push('Missing required field: "resourceType".');
  } else if (resource.resourceType !== 'Patient') {
    errors.push(`Invalid "resourceType": expected "Patient", received "${resource.resourceType}".`);
  }

  // 2. Validate identifier
  if (!resource.identifier) {
    errors.push('Missing required field: "identifier".');
  } else if (!Array.isArray(resource.identifier) || resource.identifier.length === 0) {
    errors.push('Field "identifier" must be a non-empty array.');
  } else {
    resource.identifier.forEach((ident: any, index: number) => {
      if (!ident.system || typeof ident.system !== 'string' || ident.system.trim() === '') {
        errors.push(`Identifier[${index}] must contain a valid "system" URI string.`);
      }
      if (!ident.value || typeof ident.value !== 'string' || ident.value.trim() === '') {
        errors.push(`Identifier[${index}] must contain a valid "value" string.`);
      }
    });
  }

  // 3. Validate gender
  const validGenders = ['male', 'female', 'other', 'unknown'];
  if (!resource.gender) {
    errors.push('Missing required field: "gender".');
  } else if (!validGenders.includes(resource.gender)) {
    errors.push(`Invalid "gender": expected one of ${validGenders.join(', ')}, received "${resource.gender}".`);
  }

  // 4. Validate birthDate
  if (!resource.birthDate) {
    errors.push('Missing required field: "birthDate".');
  } else if (typeof resource.birthDate !== 'string') {
    errors.push('Field "birthDate" must be a string.');
  } else {
    // Check format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(resource.birthDate)) {
      errors.push(`Invalid "birthDate" format: expected YYYY-MM-DD, received "${resource.birthDate}".`);
    } else {
      const parsedDate = Date.parse(resource.birthDate);
      if (isNaN(parsedDate)) {
        errors.push(`Invalid date value in "birthDate": "${resource.birthDate}" is not a valid date.`);
      }
    }
  }

  // Additional sanity checks: name structure
  if (resource.name) {
    if (!Array.isArray(resource.name)) {
      errors.push('Field "name" must be an array.');
    } else {
      resource.name.forEach((nameObj: any, index: number) => {
        if (nameObj.given && !Array.isArray(nameObj.given)) {
          errors.push(`Name[${index}] "given" must be an array of strings.`);
        }
      });
    }
  }

  // telecom structure
  if (resource.telecom) {
    if (!Array.isArray(resource.telecom)) {
      errors.push('Field "telecom" must be an array.');
    } else {
      resource.telecom.forEach((tel: any, index: number) => {
        if (tel.system && typeof tel.system !== 'string') {
          errors.push(`Telecom[${index}] "system" must be a string.`);
        }
        if (tel.value && typeof tel.value !== 'string') {
          errors.push(`Telecom[${index}] "value" must be a string.`);
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
