# HL7 FHIR Key Resources Overview

This document introduces the core HL7 FHIR R4 resources used in clinical workflows and describes their purposes.

---

## 1. Patient
* **Purpose**: Demographics and administrative information about an individual receiving care.
* **Key Elements**: Name, identifier (national ID, hospital MRN), birthDate, gender, telecom, address, generalPractitioner.
* **CP International Use**: Used to map patient demographics (HNO, Name, Date of Birth, Gender, Address, Phone No.).

---

## 2. AllergyIntolerance
* **Purpose**: Risk of harmful or undesirable physiological reactions associated with exposure to a substance (e.g. food, drug, environmental).
* **Key Elements**: Substance code, criticality (low, high, unable-to-assess), type (allergy, intolerance), clinicalStatus (active, inactive), patient (Reference).
* **CP International Use**: Used to map the patient's drug allergy (e.g., Penicillin) separately from the core demographic patient resource.

---

## 3. Encounter
* **Purpose**: Represents an interaction between a patient and healthcare provider(s) for the purpose of providing healthcare services or assessing the health status of a patient.
* **Key Elements**: Status (planned, arrived, in-progress, finished), class (ambulatory, inpatient, home), period, reasonCode, subject (Patient Reference).
* **CP International Use**: Represents clinic bookings, checkups, or online consultations.

---

## 4. Practitioner
* **Purpose**: A person who is directly or indirectly involved in the provisioning of healthcare (e.g. doctor, nurse, pharmacist, technician).
* **Key Elements**: Name, identifier, telecom, qualification, address.
* **CP International Use**: Represents clinical staff, therapists, or doctors responsible for treating the patient.

---

## 5. Appointment
* **Purpose**: A booking agreement that lists the date, time, participants (Patient, Practitioner), and location details for an encounter.
* **Key Elements**: Status (proposed, pending, booked, cancelled), start, end, description, participant.
* **CP International Use**: Used in scheduling systems to manage future checkups before they become active Encounters.

---

## 6. Observation
* **Purpose**: Vital measurements, laboratory results, clinical assessments, or social history facts.
* **Key Elements**: Category, code (LOINC/SNOMED), value (Quantity/String/CodeableConcept), status (preliminary, final), effectiveDateTime, subject (Patient Reference).
* **CP International Use**: Captures patient vitals (e.g., blood pressure, weight, heart rate) or laboratory tests.

---

## 7. Condition
* **Purpose**: Detailed clinical information about a disease, diagnosis, or health concern.
* **Key Elements**: Code (ICD-10/ICD-11/SNOMED), clinicalStatus (active, remission, inactive), verificationStatus (confirmed, differential), subject (Patient Reference).
* **CP International Use**: Represents diagnoses mapped from the ICD database integration.

---

## 8. MedicationRequest
* **Purpose**: An instruction or prescription for a medication to be dispensed and administered to a patient.
* **Key Elements**: Medication (CodeableConcept or Reference), dosageInstruction, intent (order, proposal), status (active, completed), requester (Practitioner Reference).
* **CP International Use**: Represents prescriptions given during checkups.
