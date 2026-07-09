# CP International FHIR R4 Integration Proof of Concept

This service acts as a Proof of Concept (POC) demonstrating how CP International can support the HL7 FHIR R4 standard without modifying the existing internal database schema structure. It maps internal patient data schemas to standard FHIR resources, performs local validations, and interacts with public FHIR servers.

## Tech Stack
* **Node.js** & **TypeScript**
* **Express.js** (Web API Framework)
* **Axios** (HTTP Client)
* **dotenv** (Configuration)
* **Helmet** & **CORS** (Security Headers)

## Directory Structure
```text
services/fhir-demo/
├── docs/                      # Architectural & mapping documentation
│   ├── ARCHITECTURE.md
│   ├── FHIR-MAPPING.md
│   └── FHIR-RESOURCES.md
├── src/
│   ├── config/                # Configuration and environment loaders
│   ├── controllers/           # Slim request handler controllers
│   ├── mappers/               # Data schema converters / transformers
│   ├── middleware/            # Global Express middleware (errors, security)
│   ├── mock/                  # Sample database patient JSON records
│   ├── routes/                # Express API routing mappings
│   ├── services/              # Business logic (Axios, local validation)
│   ├── types/                 # TypeScript type interfaces
│   ├── app.ts                 # Express initialization
│   └── server.ts              # Entry point starting the HTTP listener
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── prettier.config.js
├── tsconfig.json
└── README.md
```

## Setup & Running the Project

### 1. Installation
Navigate to the `services/fhir-demo` directory and install the packages:
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run in Development Mode
Starts the server with nodemon and ts-node:
```bash
npm run dev
```
The server will start listening at `http://127.0.0.1:3001` (local loopback interface).

### 4. Build & Production Start
Compile to JavaScript and run:
```bash
npm run build
npm start
```

---

## Available Endpoints

### 🩺 Health check
* **`GET /health`**
  - Returns api status message.

### 🌐 Public FHIR Read Proxy
These endpoints call the public HAPI FHIR server (`https://hapi.fhir.org/baseR4`) and proxy results:
* **`GET /api/fhir/metadata`**
  - Fetches the server's CapabilityStatement describing supported resources.
* **`GET /api/fhir/patient`**
  - Fetches recent Patient resources from the public server (limit 10).
* **`GET /api/fhir/patient/:id`**
  - Fetches a single Patient resource by its unique FHIR ID.

### 🧪 CP International Demo & Mapping
* **`GET /api/demo/patient`**
  - Returns the static database schema mockup, the FHIR R4 Patient resource mapping result, and an element-by-element mapping translation matrix.
* **`GET /api/demo/patient/validate`**
  - Runs local validation logic on the generated patient resource to verify standard compliance without external network hits.
* **`POST /api/demo/patient/upload`**
  - Performs mapping, validates it, and posts the resulting Patient resource to the public HAPI FHIR R4 server, returning status details and a direct query link.
