Overall Goal

Build a Proof of Concept (POC) that demonstrates how CP International can support the HL7 FHIR R4 standard without changing the existing database structure.

Repository

health-api-demo/
│
├── services/
│   ├── icd-demo/
│   ├── fhir-demo/
│   └── drug-demo/
│
├── docs/
├── postman/
└── README.md
🚀 Prompt #1 — Setup FHIR Demo Project
You are a senior Healthcare Software Engineer specializing in HL7 FHIR.

We already have an existing repository named

health-api-demo

Create ONLY

services/fhir-demo

Technology Stack

- Node.js
- Express.js
- TypeScript
- Axios
- dotenv

Architecture

services/fhir-demo/

    src/

        app.ts
        server.ts

        config/
        controllers/
        middleware/
        routes/
        services/
        mappers/
        mock/
        types/
        utils/

    .env.example
    .gitignore
    package.json
    tsconfig.json
    README.md
    eslint.config.js
    prettier.config.js

Configure

- Express
- TypeScript
- Axios
- dotenv
- ESLint
- Prettier
- Nodemon

Create npm scripts

- dev
- build
- start

Create

GET /health

Response

{
    "success": true,
    "message": "FHIR Demo API Running"
}

Generate a professional README.

Do not implement FHIR logic yet.

This project is API only.
🚀 Prompt #2 — Public FHIR Read Demo
Continue working ONLY inside

services/fhir-demo

Objective

Demonstrate communication with a public HL7 FHIR R4 server.

Use

https://hapi.fhir.org/baseR4

Implement

src/services/fhirService.ts

Create methods

- getMetadata()
- getPatients()
- getPatientById(id)

Create

controllers

routes

Endpoints

GET /api/fhir/metadata

GET /api/fhir/patient

GET /api/fhir/patient/:id

Return the original FHIR response exactly as received.

Use Axios.

Use async/await.

Implement proper error handling.

Keep controllers thin.

Business logic belongs inside services.

Do NOT implement POST, PUT or DELETE.
🚀 Prompt #3 — CP International Internal Patient Mapping

ဒီ Prompt က အရေးကြီးဆုံးပါ။

Continue working ONLY inside

services/fhir-demo

Objective

Demonstrate how an internal CP International patient record can be transformed into a valid HL7 FHIR R4 Patient resource.

Create

src/mock/patient.json

The internal patient object must use the following fields exactly.

Hospital Registration No. (HNO)

Name

Age

Date of Birth

Gender

Address

Phone No.

Source Information

Drug Allergy

Assessable Platform

Use realistic sample values.

Create

src/mappers/patientMapper.ts

Implement a reusable mapper.

Requirements

Convert the internal patient object into a valid HL7 FHIR R4 Patient resource.

Follow the official HL7 Patient specification.

Important

Hospital Registration No.
→ Patient.identifier

Name
→ Patient.name

Date of Birth
→ Patient.birthDate

Gender
→ Patient.gender

Address
→ Patient.address

Phone No.
→ Patient.telecom

Age

Do NOT store Age inside the FHIR Patient resource.

Instead document that Age should be calculated from birthDate.

Drug Allergy

Do NOT place inside Patient.

Document that Drug Allergy belongs to the AllergyIntolerance resource.

Source Information

Implement as a FHIR extension with proper comments explaining why.

Assessable Platform

Implement as a FHIR extension with comments.

Create endpoint

GET /api/demo/patient

Response

{
    "internalPatient": { ... },

    "mappingExplanation": {

        "Hospital Registration No.": "Patient.identifier",

        "Drug Allergy": "AllergyIntolerance",

        "Age": "Calculated from birthDate"

    },

    "fhirPatient": { ... }
}

The goal is educational.

Clearly explain the mapping.

Do not call any external API.
🚀 Prompt #4 — Local Validation
Continue working ONLY inside

services/fhir-demo

Objective

Validate the generated FHIR Patient resource locally.

Requirements

Implement

GET /api/demo/patient/validate

Validate

- required fields

- resourceType

- identifier

- gender

- birthDate

Return

{
    "success": true,

    "valid": true,

    "resource": { ... }
}

If validation fails

Return detailed validation errors.

Use an open-source FHIR validation library if appropriate.

If no library is used, implement basic validation with clear documentation.

Do NOT call the public FHIR server.
🚀 Prompt #5 — Upload to Public FHIR Server
Continue working ONLY inside

services/fhir-demo

Objective

Upload the mapped Patient resource to the public HAPI FHIR R4 server.

Reuse

patient.json

patientMapper.ts

Validation

Flow

Internal Patient

↓

FHIR Patient

↓

POST

https://hapi.fhir.org/baseR4/Patient

Create endpoint

POST /api/demo/patient/upload

Return

{
    "success": true,

    "httpStatus": ...,

    "createdPatientId": "...",

    "resourceUrl": "...",

    "response": { ... }
}

Implement proper error handling.

Do not duplicate mapping logic.

Use clean architecture.

Use async/await.
🚀 Prompt #6 — Documentation & Architecture
Continue working ONLY inside

services/fhir-demo

Generate complete project documentation.

Create

README.md

docs/FHIR-MAPPING.md

docs/ARCHITECTURE.md

docs/FHIR-RESOURCES.md

README should explain

- Project Objective

- Folder Structure

- Installation

- Running the API

- Available Endpoints

FHIR-MAPPING.md

Explain every CP International field and how it maps into FHIR.

Include a comparison table.

ARCHITECTURE.md

Explain

Internal Database

↓

Mapper

↓

FHIR Resource

↓

FHIR REST API

Explain why the internal database is not replaced by FHIR.

Explain why mapping is required.

FHIR-RESOURCES.md

Introduce

Patient

Condition

Observation

Encounter

Practitioner

MedicationRequest

Appointment

AllergyIntolerance

Briefly explain the purpose of each resource.

Also generate

Postman Collection

including every endpoint.
🎯 Final Demo Flow (Manager Presentation)

အောက်က Flow အတိုင်း Demo ပြရင် Manager အတွက် အရမ်းရှင်းပါတယ်။

                     CP International

               Internal Patient JSON
                       │
                       ▼
                 Patient Mapper
                       │
                       ▼
              FHIR Patient Resource
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
 Local Validation           Public HAPI FHIR Server
          │                         │
          ▼                         ▼
     Valid Resource         Created Patient Resource
          │                         │
          └────────────┬────────────┘
                       ▼
             Standard HL7 FHIR Patient