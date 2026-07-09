import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import * as fhirService from '../services/fhirService';
import { mapToFhirPatient, MAPPING_EXPLANATION } from '../mappers/patientMapper';
import { validateFhirPatient } from '../services/validationService';
import { InternalPatient } from '../types/fhir';

// Helper to read the mock patient file
const readMockPatient = (): InternalPatient => {
  const filePath = path.join(__dirname, '../mock/patient.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as InternalPatient;
};

/**
 * GET /api/fhir/metadata
 * Fetches capability statement from public FHIR server.
 */
export const getMetadata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await fhirService.getMetadata();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/fhir/patient
 * Fetches recent patients from public FHIR server.
 */
export const getPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await fhirService.getPatients();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/fhir/patient/:id
 * Fetches a single patient by ID from public FHIR server.
 */
export const getPatientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const data = await fhirService.getPatientById(id);
    res.status(200).json(data);
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({
        success: false,
        message: `FHIR Patient with ID ${id} not found on public server.`
      });
      return;
    }
    next(error);
  }
};

/**
 * GET /api/demo/patient
 * POST /api/demo/patient
 * Demonstrates internal patient mapping to FHIR Patient resource.
 */
export const getDemoPatient = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const internalPatient = req.body && req.body.internalPatient 
      ? req.body.internalPatient 
      : readMockPatient();
    const fhirPatient = mapToFhirPatient(internalPatient);
    
    res.status(200).json({
      internalPatient,
      mappingExplanation: MAPPING_EXPLANATION,
      fhirPatient
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/demo/patient/validate
 * POST /api/demo/patient/validate
 * Performs local validation of the mapped patient resource.
 */
export const validateDemoPatient = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const internalPatient = req.body && req.body.internalPatient 
      ? req.body.internalPatient 
      : readMockPatient();
    const fhirPatient = mapToFhirPatient(internalPatient);
    const validationResult = validateFhirPatient(fhirPatient);
    
    res.status(200).json({
      success: true,
      valid: validationResult.valid,
      ...(!validationResult.valid ? { errors: validationResult.errors } : {}),
      resource: fhirPatient
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/demo/patient/upload
 * Maps internal patient to FHIR, validates, and uploads it to the public server.
 */
export const uploadDemoPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const internalPatient = req.body && req.body.internalPatient 
      ? req.body.internalPatient 
      : readMockPatient();
    const fhirPatient = mapToFhirPatient(internalPatient);
    
    // Validate locally before upload
    const validationResult = validateFhirPatient(fhirPatient);
    if (!validationResult.valid) {
      res.status(400).json({
        success: false,
        message: 'Local validation failed. Patient resource is not FHIR compliant.',
        errors: validationResult.errors
      });
      return;
    }

    const uploadResult = await fhirService.uploadPatient(fhirPatient);
    
    if (uploadResult.error) {
      res.status(uploadResult.status).json({
        success: false,
        message: 'Public FHIR server rejected the resource.',
        response: uploadResult.data
      });
      return;
    }

    const createdPatientId = uploadResult.data.id || 'unknown';
    const baseUrl = process.env.FHIR_BASE_URL || 'https://hapi.fhir.org/baseR4';
    const resourceUrl = `${baseUrl}/Patient/${createdPatientId}`;

    res.status(200).json({
      success: true,
      httpStatus: uploadResult.status,
      createdPatientId,
      resourceUrl,
      response: uploadResult.data
    });
  } catch (error) {
    next(error);
  }
};
