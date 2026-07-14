# CP to FHIR Patient Mapping Specification

This document provides a field-by-field mapping specification between CP's internal patient data structure and the HL7 FHIR R4 Patient resource.

## Mapping Table

| **Hospital Registration No. (HNO)** | `Patient.identifier` | `Identifier` | Unique patient registration ID. Mapped using system `http://cpintl.org/hno` (type: official) to isolate database identifiers. |
| **Name** | `Patient.name` | `HumanName[]` | String parsed: Full name is stored in `text`. Split by space into `given` (first name(s)) and `family` (last name). |
| **Age** | *Excluded* | `integer` | **Do NOT store Age in the FHIR Patient resource.** Age is dynamic and changes. It must be computed on the client/system side by comparing the current date to `birthDate`. |
| **Date of Birth** | `Patient.birthDate` | `date` | Birthdate mapped directly in `YYYY-MM-DD` format. |
| **Gender** | `Patient.gender` | `code` | Maps internal numeric representation to FHIR code strings:<br>• `1` ➔ `"male"`<br>• `2` ➔ `"female"`<br>• `3` ➔ `"other"`<br>• Default/other ➔ `"unknown"`. |
| **Address** | `Patient.address` | `Address[]` | Home address mapped to `address.text` and array `address.line` for maximum parser compatibility. |
| **Phone No.** | `Patient.telecom` | `ContactPoint[]` | Mapped as system: `"phone"`, value: standard text, use: `"mobile"`. |
| **Source Information (distributor/message)** | `Patient.extension` | `Extension` | Custom extension URL: `http://cpintl.org/fhir/StructureDefinition/source-information`. Represents ingestion source. |
| **Drug Allergy** | *Excluded* | `string` | **Do NOT store drug allergies in the Patient resource.** Allergies represent discrete clinical statements and belong in the `AllergyIntolerance` FHIR resource, referencing the patient. |
| **Assessable Platform** | `Patient.extension` | `Extension` | Custom extension URL: `http://cpintl.org/fhir/StructureDefinition/assessable-platform`. Represents assessment application environment. |

---

## Detailed Element Explanations

### 1. Hospital Registration No. (HNO)
* **FHIR Location**: `Patient.identifier`
* **Implementation**:
  ```json
  "identifier": [
    {
      "use": "official",
      "system": "http://cpintl.org/hno",
      "value": "45912/2569"
    }
  ]
  ```

### 2. Name
* **FHIR Location**: `Patient.name`
* **Implementation**:
  ```json
  "name": [
    {
      "use": "official",
      "text": "Jane Smith",
      "family": "Smith",
      "given": ["Jane"]
    }
  ]
  ```

### 3. Age (Calculation vs Storage)
Age is a calculated property. In a standard HL7 FHIR workflow:
* Storage of "Age" inside a patient record is forbidden because it goes stale immediately.
* Systems calculate age using the patient's `birthDate`:
  $$\text{Age} = \text{Current Year} - \text{Birth Year}$$

### 4. Custom Extensions (Ingestion & Platforms)
Since FHIR's Patient resource does not have fields for the registration source channel or platform information, we model them as custom extensions.
* **Source Information Extension**:
  ```json
  {
    "url": "http://cpintl.org/fhir/StructureDefinition/source-information",
    "valueString": "distributor"
  }
  ```
* **Assessable Platform Extension**:
  ```json
  {
    "url": "http://cpintl.org/fhir/StructureDefinition/assessable-platform",
    "valueString": "mobile"
  }
  ```

### 5. Allergy Separation
In HL7 FHIR, a patient resource only represents administrative and demographic facts about a person. Clinical events like allergy indicators belong in their own resource type:
* **AllergyIntolerance**: Specifies the substance (e.g. Penicillin) and criticality, containing a reference to the `Patient` resource via `AllergyIntolerance.patient.reference = "Patient/id"`.
