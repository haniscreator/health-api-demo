import axios from 'axios';
import { FhirPatient } from '../types/fhir';

const getBaseUrl = (): string => {
  return process.env.FHIR_BASE_URL || 'https://hapi.fhir.org/baseR4';
};

/**
 * Fetches the CapabilityStatement / Metadata from the public FHIR server.
 */
export const getMetadata = async (): Promise<any> => {
  const url = `${getBaseUrl()}/metadata`;
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/fhir+json, application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`[fhirService.getMetadata] Error fetching metadata from ${url}:`, error.message);
    throw error;
  }
};

/**
 * Fetches a list of patient resources from the public FHIR server.
 * Limits default results to 10 for performance.
 */
export const getPatients = async (): Promise<any> => {
  const url = `${getBaseUrl()}/Patient`;
  try {
    const response = await axios.get(url, {
      params: {
        _count: 10,
        _sort: '-_lastUpdated' // Sort by most recently updated
      },
      headers: {
        Accept: 'application/fhir+json, application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`[fhirService.getPatients] Error fetching patients from ${url}:`, error.message);
    throw error;
  }
};

/**
 * Fetches a single patient resource by its ID from the public FHIR server.
 */
export const getPatientById = async (id: string): Promise<any> => {
  // Sanitize ID to prevent path traversal issues
  const sanitizedId = id.replace(/[^a-zA-Z0-9-_]/g, '');
  const url = `${getBaseUrl()}/Patient/${sanitizedId}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/fhir+json, application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`[fhirService.getPatientById] Error fetching patient ${sanitizedId} from ${url}:`, error.message);
    throw error;
  }
};

/**
 * Uploads a Patient resource to the public FHIR server.
 */
export const uploadPatient = async (fhirPatient: FhirPatient): Promise<any> => {
  const url = `${getBaseUrl()}/Patient`;
  try {
    const response = await axios.post(url, fhirPatient, {
      headers: {
        'Content-Type': 'application/fhir+json;charset=utf-8',
        'Accept': 'application/fhir+json, application/json'
      }
    });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error: any) {
    console.error(`[fhirService.uploadPatient] Error uploading patient to ${url}:`, error.message);
    if (error.response) {
      // The server responded with a status code out of the 2xx range
      return {
        status: error.response.status,
        data: error.response.data,
        error: true
      };
    }
    throw error;
  }
};
