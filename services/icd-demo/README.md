# WHO ICD-11 API Integration POC

This repository contains a Proof of Concept (POC) Node.js/Express service implementing integration with the official WHO ICD-11 API. It provides authenticated access, token caching, automatic token refreshing, disease searching, and entity details lookup.

## Folder Structure

```
services/icd-demo/
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── icdAuthController.ts
│   │   └── icdController.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── icdAuthRoutes.ts
│   │   └── icdRoutes.ts
│   ├── services/
│   │   ├── icdAuthService.ts
│   │   └── icdService.ts
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
└── README.md
```

## Installation

To install dependencies, navigate to this directory and run:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root of the `icd-demo` folder (modeled after `.env.example`):

```env
PORT=3000
ICD_CLIENT_ID=your_who_icd_client_id
ICD_CLIENT_SECRET=your_who_icd_client_secret
```

*Note: The `.env` file containing secrets is ignored by Git using `.gitignore` for security.*

## Running Locally

To run the server in development mode (with auto-reload):

```bash
npm run dev
```

To build and compile TypeScript files:

```bash
npm run build
```

To run the production-built JavaScript files:

```bash
npm run start
```

## Available APIs & Examples

### 1. Health Check
* **Endpoint:** `GET /health`
* **Description:** Check if the API server is up and running.
* **Example Request:** `curl http://127.0.0.1:3000/health`
* **Response:**
  ```json
  {
    "success": true,
    "message": "ICD Demo API Running"
  }
  ```

### 2. Retrieve OAuth Token
* **Endpoint:** `GET /api/icd/token`
* **Description:** Fetches or retrieves the cached WHO ICD OAuth token. Token caching and auto-background refresh logic are used.
* **Example Request:** `curl http://127.0.0.1:3000/api/icd/token`
* **Response:**
  ```json
  {
    "success": true,
    "token_type": "Bearer",
    "expires_in": 3599,
    "access_token": "eyJhbGciOiJSUzI1Ni..."
  }
  ```

### 3. Disease Search
* **Endpoint:** `GET /api/icd/search?q=:query`
* **Description:** Search for categories/diseases within the ICD-11 classification.
* **Example Request:** `curl http://127.0.0.1:3000/api/icd/search?q=diabetes`
* **Response:**
  ```json
  {
    "success": true,
    "query": "diabetes",
    "total": 2,
    "results": [
      {
        "id": "250688797",
        "code": "",
        "title": "Diabetes mellitus"
      },
      {
        "id": "2114593305",
        "code": "",
        "title": "Postprocedural diabetes mellitus"
      }
    ]
  }
  ```

### 4. Disease/Entity Details
* **Endpoint:** `GET /api/icd/entity/:id`
* **Description:** Retrieve detailed hierarchy, description, and metadata about a specific ICD-11 entity.
* **Example Request:** `curl http://127.0.0.1:3000/api/icd/entity/250688797`
* **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "250688797",
      "code": "5A10",
      "title": "Diabetes mellitus",
      "definition": "Diabetes mellitus is a chronic metabolic disease characterized by elevated levels of blood glucose...",
      "parent": "12345678",
      "children": [
        "2114593305"
      ]
    }
  }
  ```
