import { Router } from 'express';
import * as fhirController from '../controllers/fhirController';

const router = Router();

// Public FHIR Server Read Proxy Routes
router.get('/api/fhir/metadata', fhirController.getMetadata);
router.get('/api/fhir/patient', fhirController.getPatients);
router.get('/api/fhir/patient/:id', fhirController.getPatientById);

// CP Internal Demo Mapping & Upload Routes
router.get('/api/demo/patient', fhirController.getDemoPatient);
router.post('/api/demo/patient', fhirController.getDemoPatient);
router.get('/api/demo/patient/validate', fhirController.validateDemoPatient);
router.post('/api/demo/patient/validate', fhirController.validateDemoPatient);
router.post('/api/demo/patient/upload', fhirController.uploadDemoPatient);

export default router;
