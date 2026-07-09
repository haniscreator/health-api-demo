Project Structure
health-api-demo/
│
├── services/
│   │
│   ├── icd-demo/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── README.md
│   │
│   ├── fhir-demo/
│   │   └── README.md
│   │
│   └── drug-demo/
│       └── README.md
│
├── docs/
├── postman/
├── screenshots/
└── README.md
🚀 Codex Prompt #1 (Project Setup)
You are a senior Node.js backend engineer.

We are building a Healthcare API Research repository.

Repository name:

health-api-demo

This repository contains multiple independent Proof of Concept (POC) projects.

Current task:

Create ONLY the project located at

services/icd-demo

Do NOT create the FHIR or Drug projects.

Technology Stack

- Node.js
- Express.js
- TypeScript
- Axios
- dotenv

Requirements

Create the following structure.

services/
    icd-demo/
        src/
            app.ts
            server.ts

            config/
            controllers/
            middleware/
            routes/
            services/
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
- dotenv
- Axios
- Nodemon
- ESLint
- Prettier

Create npm scripts

- dev
- build
- start

Create endpoint

GET /health

Response

{
    "success": true,
    "message": "ICD Demo API Running"
}

Keep the architecture modular.

Do NOT implement WHO ICD API yet.

Generate a clean README explaining how to run the project.

Do not generate any frontend.
🚀 Codex Prompt #2 (OAuth)
Continue working only inside

services/icd-demo

Do not modify other folders.

Implement WHO ICD API OAuth authentication.

Environment variables

ICD_CLIENT_ID=
ICD_CLIENT_SECRET=

Requirements

Create

src/services/icdAuthService.ts

Responsibilities

- Request OAuth token
- Cache token in memory
- Automatically refresh token before expiration
- Return cached token whenever possible

Create

src/controllers/icdAuthController.ts

Create

src/routes/icdAuthRoutes.ts

Expose endpoint

GET /api/icd/token

Response

{
    "success": true,
    "token_type": "...",
    "expires_in": ...,
    "access_token": "..."
}

Use Axios.

Use TypeScript.

Never hardcode credentials.

Implement proper error handling.

Keep business logic inside services.
🚀 Codex Prompt #3 (Disease Search)
Continue working only inside

services/icd-demo

Implement WHO ICD Search API.

Endpoint

GET /api/icd/search?q=diabetes

Requirements

Create

src/services/icdService.ts

Create

src/controllers/icdController.ts

Create

src/routes/icdRoutes.ts

Business logic

- Get OAuth token from icdAuthService
- Call WHO ICD Search API
- Return simplified response

Example

{
    "success": true,
    "query": "diabetes",
    "total": 2,
    "results": [
        {
            "id": "...",
            "code": "...",
            "title": "..."
        }
    ]
}

Implement proper error handling.

Keep controllers thin.

Use async/await.

Do not duplicate OAuth logic.
🚀 Codex Prompt #4 (Entity Detail)
Continue working only inside

services/icd-demo

Implement WHO ICD Entity Detail endpoint.

Endpoint

GET /api/icd/entity/:id

Requirements

Use the existing OAuth service.

Call WHO ICD Entity API.

Return simplified JSON.

Example

{
    "success": true,
    "data": {
        "id": "...",
        "code": "...",
        "title": "...",
        "definition": "...",
        "parent": "...",
        "children": []
    }
}

Use clean architecture.

Keep business logic inside services.

Use TypeScript.

Implement proper error handling.
🚀 Codex Prompt #5 (Documentation)
Continue working only inside

services/icd-demo

Improve the project documentation.

Generate

- README.md
- .env.example

README should include

- Project Overview
- Folder Structure
- Installation
- Environment Variables
- Available APIs
- Example Requests
- Example Responses
- Running Locally

Also generate

postman/

Create a Postman Collection for

GET /health
GET /api/icd/token
GET /api/icd/search
GET /api/icd/entity/:id

Use environment variables where appropriate.

Do not modify FHIR or Drug folders.
📌 Manager Demo Flow

ဒီလို Demo ပြရင် Professional ဖြစ်ပါတယ်။

Repository
│
├── health-api-demo
│
├── services
│      │
│      ├── icd-demo   ✅ Completed
│      ├── fhir-demo  ⏳ Planned
│      └── drug-demo  ⏳ Research Pending
│
├── docs
├── postman
└── screenshots

ပြီးရင် icd-demo ကိုဖွင့်ပြီး

GET /health
        ↓
Server Running

GET /api/icd/token
        ↓
OAuth Success

GET /api/icd/search?q=diabetes
        ↓
WHO ICD Search

GET /api/icd/entity/{id}
        ↓
Disease Detail

ဒီ Flow နဲ့ပြရင် "ICD API Research & Proof of Concept" ဆိုတဲ့ ရည်ရွယ်ချက်ကို ရှင်းရှင်းလင်းလင်း ပြနိုင်ပါတယ်။