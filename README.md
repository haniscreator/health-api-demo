# Health API Integration Demos

This repository contains Proof of Concept (POC) services demonstrating healthcare API integrations:

1. **ICD-11 API Demo (`services/icd-demo`)**: Integrates with the official WHO ICD-11 API, featuring OAuth authentication, token caching, disease searching, and entity details lookups.
2. **FHIR R4 Integration Demo (`services/fhir-demo`)**: Maps internal patient data structures to the HL7 FHIR R4 Patient standard, performs schema validation, and interacts with public FHIR servers.

## Services Overview

### 1. WHO ICD-11 API Demo
Located in [services/icd-demo](file:///Users/pph-air-m2/Equal%20Health/Dev/Web/health-api-demo/services/icd-demo).
- **Core Features**: WHO ICD-11 OAuth token cache & refresh, disease search, and entity details lookup.
- **Port**: Runs on port `3000`.

### 2. HL7 FHIR R4 Integration Demo
Located in [services/fhir-demo](file:///Users/pph-air-m2/Equal%20Health/Dev/Web/health-api-demo/services/fhir-demo).
- **Core Features**: Custom patient-to-FHIR R4 resource mapper, standard schema validation, and live upload to public HAPI FHIR servers.
- **Port**: Runs on port `3001`.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
To install dependencies for all services, navigate to each service's directory and run:

```bash
# Install ICD-11 Demo dependencies
cd services/icd-demo
npm install

# Install FHIR Demo dependencies
cd ../fhir-demo
npm install
```

### Running the Services

Navigate to the respective service directory and run:

```bash
# Start in development mode (with hot-reloading)
npm run dev

# Or build and start in production mode
npm run build
npm start
```
