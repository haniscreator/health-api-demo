// CP International FHIR Integration App Logic

// Mock dataset for Randomizer
const FIRST_NAMES_MALE = ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Alex', 'Sukhum', 'Kitti', 'Somchai'];
const FIRST_NAMES_FEMALE = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jane', 'Siriporn', 'Nid', 'Sunisa'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Somsri', 'Rattanakosin', 'Prasert'];
const STREET_NAMES = ['Sukhumvit Road', 'Phahonyothin Road', 'Silom Road', 'Rama IV Road', 'Nimmanhemin Road', 'Charoen Krung Road'];
const CITIES = ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Khon Kaen', 'Nakhon Ratchasima'];
const DRUG_ALLERGIES = ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Amoxicillin', 'None', 'None', 'None'];

document.addEventListener('DOMContentLoaded', () => {
  // Elements Selection
  const randomizeBtn = document.getElementById('randomizeBtn');
  const patientForm = document.getElementById('patientForm');
  const patientHno = document.getElementById('patientHno');
  const patientName = document.getElementById('patientName');
  const patientDob = document.getElementById('patientDob');
  const patientAge = document.getElementById('patientAge');
  const patientGender = document.getElementById('patientGender');
  const patientPhone = document.getElementById('patientPhone');
  const patientAddress = document.getElementById('patientAddress');
  const patientSource = document.getElementById('patientSource');
  const patientPlatform = document.getElementById('patientPlatform');
  const patientAllergy = document.getElementById('patientAllergy');

  const mapBtn = document.getElementById('mapBtn');
  const validateBtn = document.getElementById('validateBtn');
  const uploadBtn = document.getElementById('uploadBtn');

  // Tabs navigation
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  // View Switchers
  const sandboxViewTabs = document.querySelectorAll('#sandboxViewTabs .view-btn');
  const explorerViewTabs = document.querySelectorAll('#explorerViewTabs .view-btn');

  // Sandbox Result panels
  const visualSandboxView = document.getElementById('visualSandboxView');
  const jsonSandboxView = document.getElementById('jsonSandboxView');
  const sandboxPlaceholder = document.getElementById('sandboxPlaceholder');
  const sandboxJsonPlaceholder = document.getElementById('sandboxJsonPlaceholder');
  const mappingContent = document.getElementById('mappingContent');
  const sandboxJsonContent = document.getElementById('sandboxJsonContent');
  const sandboxJsonCode = document.getElementById('sandboxJsonCode');
  const mappingMatrixContainer = document.getElementById('mappingMatrixContainer');
  const validationBadge = document.getElementById('validationBadge');
  const uploadStatusCard = document.getElementById('uploadStatusCard');

  // Explorer Panel
  const lookupPatientId = document.getElementById('lookupPatientId');
  const lookupBtn = document.getElementById('lookupBtn');
  const refreshRecentBtn = document.getElementById('refreshRecentBtn');
  const recentPatientsList = document.getElementById('recentPatientsList');
  const fetchMetadataBtn = document.getElementById('fetchMetadataBtn');

  // Explorer Result panels
  const visualExplorerView = document.getElementById('visualExplorerView');
  const jsonExplorerView = document.getElementById('jsonExplorerView');
  const explorerPlaceholder = document.getElementById('explorerPlaceholder');
  const explorerJsonPlaceholder = document.getElementById('explorerJsonPlaceholder');
  const explorerPatientCard = document.getElementById('explorerPatientCard');
  const explorerMetadataCard = document.getElementById('explorerMetadataCard');
  const explorerJsonContent = document.getElementById('explorerJsonContent');
  const explorerJsonCode = document.getElementById('explorerJsonCode');

  // Profile Card detail elements
  const cardAvatar = document.getElementById('cardAvatar');
  const cardName = document.getElementById('cardName');
  const cardPatientId = document.getElementById('cardPatientId');
  const cardHno = document.getElementById('cardHno');
  const cardDob = document.getElementById('cardDob');
  const cardGender = document.getElementById('cardGender');
  const cardPhone = document.getElementById('cardPhone');
  const cardAddress = document.getElementById('cardAddress');
  const cardSource = document.getElementById('cardSource');
  const cardPlatform = document.getElementById('cardPlatform');

  // Metadata Card detail elements
  const metaFhirVer = document.getElementById('metaFhirVer');
  const metaName = document.getElementById('metaName');
  const metaPublisher = document.getElementById('metaPublisher');
  const metaStatus = document.getElementById('metaStatus');
  const metaDesc = document.getElementById('metaDesc');

  // Initial setup: Prepopulate Form
  resetFormWithMockData();
  calculateAgeFromDob();
  fetchRecentPatients();

  // Event Listeners
  randomizeBtn.addEventListener('click', randomizePatientData);
  patientDob.addEventListener('input', calculateAgeFromDob);

  // Tab switching: Sandbox vs Explorer
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active-tab-content'));
      
      tab.classList.add('active');
      const targetContent = document.getElementById(`${tab.dataset.tab}TabContent`);
      if (targetContent) {
        targetContent.classList.add('active-tab-content');
      }
    });
  });

  // View Switching (Visual vs JSON) - Sandbox
  sandboxViewTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      sandboxViewTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (btn.dataset.view === 'visual') {
        visualSandboxView.style.display = 'block';
        jsonSandboxView.style.display = 'none';
      } else {
        visualSandboxView.style.display = 'none';
        jsonSandboxView.style.display = 'block';
      }
    });
  });

  // View Switching (Visual vs JSON) - Explorer
  explorerViewTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      explorerViewTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (btn.dataset.view === 'visual') {
        visualExplorerView.style.display = 'block';
        jsonExplorerView.style.display = 'none';
      } else {
        visualExplorerView.style.display = 'none';
        jsonExplorerView.style.display = 'block';
      }
    });
  });

  // Action: Map patient details
  mapBtn.addEventListener('click', async () => {
    if (!validateFormValidity()) return;
    const internalPatient = getFormValues();

    try {
      const response = await fetch('/api/demo/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalPatient })
      });
      const data = await response.json();
      
      // Update displays
      hideSandboxPlaceholders();
      renderMappingMatrix(data.internalPatient, data.fhirPatient, data.mappingExplanation);
      renderRawJson(data, sandboxJsonCode);
      
      // Clear validation and upload headers in visual panel
      validationBadge.className = 'validation-status-badge';
      validationBadge.innerHTML = '';
      uploadStatusCard.classList.add('hidden');
      
      // Set visual view active
      activateSandboxView('visual');
    } catch (error) {
      alert('Error mapping patient: ' + error.message);
    }
  });

  // Action: Validate patient compliance
  validateBtn.addEventListener('click', async () => {
    if (!validateFormValidity()) return;
    const internalPatient = getFormValues();

    try {
      const response = await fetch('/api/demo/patient/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalPatient })
      });
      const data = await response.json();
      
      hideSandboxPlaceholders();
      renderMappingMatrix(internalPatient, data.resource, {});
      renderRawJson(data, sandboxJsonCode);
      
      // Render validation status badge
      validationBadge.className = 'validation-status-badge ' + (data.valid ? 'success' : 'error');
      if (data.valid) {
        validationBadge.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
          <span>Resource schema validation check: FHIR R4 Patient Compliant!</span>
        `;
      } else {
        const errorList = data.errors.map(err => `<li>${err}</li>`).join('');
        validationBadge.innerHTML = `
          <div>
            <strong>Validation errors found (${data.errors.length}):</strong>
            <ul class="error-list">${errorList}</ul>
          </div>
        `;
      }
      
      uploadStatusCard.classList.add('hidden');
      activateSandboxView('visual');
    } catch (error) {
      alert('Error validating patient: ' + error.message);
    }
  });

  // Action: Upload patient resource
  uploadBtn.addEventListener('click', async () => {
    if (!validateFormValidity()) return;
    const internalPatient = getFormValues();
    
    // Add loading indicator to upload button
    const originalText = uploadBtn.textContent;
    uploadBtn.innerHTML = 'Uploading... <span class="loader"></span>';
    uploadBtn.disabled = true;

    try {
      const response = await fetch('/api/demo/patient/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalPatient })
      });
      const data = await response.json();
      
      hideSandboxPlaceholders();
      renderRawJson(data, sandboxJsonCode);
      
      if (data.success) {
        renderMappingMatrix(internalPatient, data.response, {});
        
        // Show validation success badge
        validationBadge.className = 'validation-status-badge success';
        validationBadge.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
          <span>FHIR validation passed. Resource created successfully!</span>
        `;

        // Populate upload status details
        uploadStatusCard.classList.remove('hidden');
        uploadStatusCard.innerHTML = `
          <div class="upload-status-header">Created Resource Details</div>
          <div class="upload-status-details">
            <p><strong>FHIR Patient ID:</strong> ${data.createdPatientId}</p>
            <p><strong>Server Status:</strong> ${data.httpStatus} (Created)</p>
            <p><strong>FHIR Endpoint:</strong> <a href="${data.resourceUrl}" target="_blank" class="upload-link">${data.resourceUrl}</a></p>
            <p style="margin-top: 8px;"><button type="button" class="sec-btn-small" id="viewInExplorerBtn" data-id="${data.createdPatientId}">Explore in Dashboard</button></p>
          </div>
        `;

        // Event listener for the explorer button
        document.getElementById('viewInExplorerBtn').addEventListener('click', (e) => {
          const patientId = e.target.dataset.id;
          lookupPatientId.value = patientId;
          document.querySelector('[data-tab="explorer"]').click();
          lookupPatient(patientId);
        });

        // Refresh recent patients list
        fetchRecentPatients();
      } else {
        // Upload failed
        validationBadge.className = 'validation-status-badge error';
        const diagnostics = data.response?.issue?.[0]?.diagnostics || data.message || 'Unknown error';
        validationBadge.innerHTML = `
          <div>
            <strong>Upload rejected by server:</strong>
            <p style="font-size: 13px; font-weight: normal; margin-top: 4px;">${diagnostics}</p>
            <p style="font-size: 11px; font-weight: normal; margin-top: 8px; color: #7f1d1d;">
              Tip: The server does not allow duplicate entries for the same Registration No. Click "Randomize Patient" to generate a unique HNO and retry.
            </p>
          </div>
        `;
        uploadStatusCard.classList.add('hidden');
      }

      activateSandboxView('visual');
    } catch (error) {
      alert('Error uploading patient: ' + error.message);
    } finally {
      uploadBtn.textContent = originalText;
      uploadBtn.disabled = false;
    }
  });

  // Action: Look up patient profile by ID
  lookupBtn.addEventListener('click', () => {
    const id = lookupPatientId.value.trim();
    if (!id) {
      alert('Please enter a valid Patient ID');
      return;
    }
    lookupPatient(id);
  });

  // Action: Refresh recent patients list
  refreshRecentBtn.addEventListener('click', fetchRecentPatients);

  // Action: Fetch Metadata capability statement
  fetchMetadataBtn.addEventListener('click', async () => {
    try {
      explorerPlaceholder.classList.add('hidden');
      explorerPatientCard.classList.add('hidden');
      explorerMetadataCard.classList.remove('hidden');
      
      const response = await fetch('/api/fhir/metadata');
      const data = await response.json();
      
      // Populate metadata card
      metaFhirVer.textContent = data.fhirVersion || 'R4';
      metaName.textContent = data.name || 'HAPI FHIR Server';
      metaPublisher.textContent = data.publisher || 'Not stated';
      metaStatus.textContent = data.status || 'active';
      metaDesc.textContent = data.description || 'HL7 FHIR Capability statement explaining resources and search systems supported.';
      
      renderRawJson(data, explorerJsonCode);
      activateExplorerView('visual');
    } catch (error) {
      alert('Error fetching server metadata: ' + error.message);
    }
  });


  // --- Helper Functions ---

  function getFormValues() {
    return {
      'Hospital Registration No. (HNO)': patientHno.value.trim(),
      'Name': patientName.value.trim(),
      'Age': parseInt(patientAge.value || '0', 10),
      'Date of Birth': patientDob.value,
      'Gender': parseInt(patientGender.value, 10),
      'Address': patientAddress.value.trim(),
      'Phone No.': patientPhone.value.trim(),
      'Source information (distributor/message)': patientSource.value,
      'Drug allergy': patientAllergy.value.trim(),
      'Assessable Platform': patientPlatform.value
    };
  }

  function validateFormValidity() {
    if (!patientForm.checkValidity()) {
      patientForm.reportValidity();
      return false;
    }
    return true;
  }

  function calculateAgeFromDob() {
    const dobValue = patientDob.value;
    if (!dobValue) {
      patientAge.value = '';
      return;
    }
    const dob = new Date(dobValue);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    patientAge.value = isNaN(age) ? '' : age;
  }

  function resetFormWithMockData() {
    patientHno.value = '45913/2569';
    patientName.value = 'Richard Smith';
    patientDob.value = '1992-10-12';
    patientGender.value = '2';
    patientPhone.value = '+66 89 012 3456';
    patientAddress.value = '123 Sukhumvit Road, Bangkok';
    patientSource.value = 'distributor';
    patientPlatform.value = 'mobile';
    patientAllergy.value = 'Penicillin';
  }

  function randomizePatientData() {
    const isMale = Math.random() > 0.5;
    const firstName = isMale 
      ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
      : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    
    // Set HNO: e.g. 54932/2569
    const randomHnoNum = Math.floor(Math.random() * 90000) + 10000;
    const year = 2568 + Math.floor(Math.random() * 3); // 2568-2570
    patientHno.value = `${randomHnoNum}/${year}`;

    patientName.value = `${firstName} ${lastName}`;
    patientGender.value = isMale ? '1' : '2';

    // Calculate dynamic age between 18 and 85
    const age = Math.floor(Math.random() * 68) + 18;
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    patientDob.value = `${birthYear}-${birthMonth}-${birthDay}`;
    calculateAgeFromDob();

    // Phone
    const phoneNum = Math.floor(Math.random() * 9000000) + 1000000;
    patientPhone.value = `+66 81 ${phoneNum}`;

    // Address
    const street = STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const blockNum = Math.floor(Math.random() * 250) + 1;
    patientAddress.value = `${blockNum} ${street}, ${city}`;

    // Details
    patientSource.value = Math.random() > 0.5 ? 'distributor' : 'message';
    patientPlatform.value = Math.random() > 0.6 ? 'mobile' : (Math.random() > 0.5 ? 'web' : 'desktop');
    patientAllergy.value = DRUG_ALLERGIES[Math.floor(Math.random() * DRUG_ALLERGIES.length)];
  }

  function hideSandboxPlaceholders() {
    sandboxPlaceholder.classList.add('hidden');
    sandboxJsonPlaceholder.classList.add('hidden');
    mappingContent.classList.remove('hidden');
    sandboxJsonContent.classList.remove('hidden');
  }

  function activateSandboxView(view) {
    sandboxViewTabs.forEach(b => b.classList.remove('active'));
    document.querySelector(`#sandboxViewTabs [data-view="${view}"]`).classList.add('active');
    
    if (view === 'visual') {
      visualSandboxView.style.display = 'block';
      jsonSandboxView.style.display = 'none';
    } else {
      visualSandboxView.style.display = 'none';
      jsonSandboxView.style.display = 'block';
    }
  }

  function activateExplorerView(view) {
    explorerViewTabs.forEach(b => b.classList.remove('active'));
    document.querySelector(`#explorerViewTabs [data-view="${view}"]`).classList.add('active');
    
    if (view === 'visual') {
      visualExplorerView.style.display = 'block';
      jsonExplorerView.style.display = 'none';
    } else {
      visualExplorerView.style.display = 'none';
      jsonExplorerView.style.display = 'block';
    }
  }

  function renderRawJson(data, targetContainer) {
    targetContainer.textContent = JSON.stringify(data, null, 2);
  }

  function renderMappingMatrix(internal, fhir, explanations) {
    mappingMatrixContainer.innerHTML = '';
    
    // Mapped Elements configurations
    const elementsToRender = [
      {
        field: 'Hospital Registration No. (HNO)',
        dest: 'Patient.identifier[0]',
        valInternal: internal['Hospital Registration No. (HNO)'],
        valFhir: fhir?.identifier?.[0] ? `system: ${fhir.identifier[0].system}<br>value: ${fhir.identifier[0].value}` : 'N/A',
        mono: true,
        type: 'standard',
        expl: explanations['Hospital Registration No. (HNO)'] || 'Mapped to official identifier array containing system URI and the registration number.'
      },
      {
        field: 'Name',
        dest: 'Patient.name[0]',
        valInternal: internal.Name,
        valFhir: fhir?.name?.[0] ? `text: ${fhir.name[0].text}<br>family: ${fhir.name[0].family}<br>given: [${fhir.name[0].given?.join(', ')}]` : 'N/A',
        mono: true,
        type: 'standard',
        expl: explanations.Name || 'Mapped to Patient.name, separating given and family parts.'
      },
      {
        field: 'Age',
        dest: 'Excluded (Calculated)',
        valInternal: internal.Age,
        valFhir: 'Age is calculated dynamically: date of birth matching birthDate is contrasted with current date.',
        mono: false,
        type: 'excluded',
        expl: explanations.Age || 'Excluded from core storage: birthDate remains the single immutable fact.'
      },
      {
        field: 'Date of Birth',
        dest: 'Patient.birthDate',
        valInternal: internal['Date of Birth'],
        valFhir: fhir?.birthDate || 'N/A',
        mono: true,
        type: 'standard',
        expl: explanations['Date of Birth'] || 'Mapped to Patient.birthDate directly in standard YYYY-MM-DD format.'
      },
      {
        field: 'Gender',
        dest: 'Patient.gender',
        valInternal: `${internal.Gender} (${internal.Gender === 1 ? 'Male' : (internal.Gender === 2 ? 'Female' : (internal.Gender === 3 ? 'Other' : 'Unknown'))})`,
        valFhir: fhir?.gender || 'N/A',
        mono: true,
        type: 'standard',
        expl: explanations.Gender || 'Converts local database codes (1,2,3) to FHIR administrative code.'
      },
      {
        field: 'Address',
        dest: 'Patient.address[0]',
        valInternal: internal.Address,
        valFhir: fhir?.address?.[0] ? `text: ${fhir.address[0].text}<br>line: [${fhir.address[0].line?.join(', ')}]` : 'N/A',
        mono: true,
        type: 'standard',
        expl: explanations.Address || 'Populates Patient.address line and text elements.'
      },
      {
        field: 'Phone No.',
        dest: 'Patient.telecom[0]',
        valInternal: internal['Phone No.'],
        valFhir: fhir?.telecom?.[0] ? `system: ${fhir.telecom[0].system}<br>use: ${fhir.telecom[0].use}<br>value: ${fhir.telecom[0].value}` : 'N/A',
        mono: true,
        type: 'standard',
        expl: explanations['Phone No.'] || 'Maps to a mobile phone telecom ContactPoint.'
      },
      {
        field: 'Source information',
        dest: 'Patient.extension[0]',
        valInternal: internal['Source information (distributor/message)'],
        valFhir: fhir?.extension?.[0] ? `url: ${fhir.extension[0].url}<br>valueString: ${fhir.extension[0].valueString}` : 'N/A',
        mono: true,
        type: 'extension',
        expl: explanations['Source information (distributor/message)'] || 'Custom extension indicating demographic channel ingestion details.'
      },
      {
        field: 'Drug allergy',
        dest: 'Excluded (AllergyIntolerance)',
        valInternal: internal['Drug allergy'] || 'None',
        valFhir: 'This drug allergy indicator belongs in an independent AllergyIntolerance resource, linking back to this Patient ID.',
        mono: false,
        type: 'excluded',
        expl: explanations['Drug allergy'] || 'Clinical allergies represent different medical contexts and reside separately in FHIR.'
      },
      {
        field: 'Assessable Platform',
        dest: 'Patient.extension[1]',
        valInternal: internal['Assessable Platform'],
        valFhir: fhir?.extension?.[1] ? `url: ${fhir.extension[1].url}<br>valueString: ${fhir.extension[1].valueString}` : 'N/A',
        mono: true,
        type: 'extension',
        expl: explanations['Assessable Platform'] || 'Custom extension mapping the specific application platform.'
      }
    ];

    elementsToRender.forEach(el => {
      const card = document.createElement('div');
      card.className = 'mapping-card';

      let destBadgeClass = '';
      if (el.type === 'excluded') destBadgeClass = 'excluded';
      else if (el.type === 'extension') destBadgeClass = 'extension';

      card.innerHTML = `
        <div class="mapping-card-header">
          <span class="internal-source-title">${el.field}</span>
          <span class="fhir-dest-title ${destBadgeClass}">${el.dest}</span>
        </div>
        <div class="mapping-card-body">
          <div class="mapping-block">
            <span class="mapping-block-title">Internal Value</span>
            <span class="mapping-value">${el.valInternal}</span>
          </div>
          <div class="mapping-block">
            <span class="mapping-block-title">FHIR Output Mapping</span>
            <span class="mapping-value ${el.mono ? 'monospace' : ''}">${el.valFhir}</span>
          </div>
          <div class="mapping-explanation-text">
            <strong>Rationale:</strong> ${el.expl}
          </div>
        </div>
      `;
      mappingMatrixContainer.appendChild(card);
    });
  }

  async function fetchRecentPatients() {
    try {
      recentPatientsList.innerHTML = '<div class="list-loading">Fetching from server...</div>';
      const response = await fetch('/api/fhir/patient');
      const data = await response.json();
      
      recentPatientsList.innerHTML = '';
      
      if (!data.entry || data.entry.length === 0) {
        recentPatientsList.innerHTML = '<div class="list-loading">No patients found.</div>';
        return;
      }

      data.entry.forEach(item => {
        const resource = item.resource;
        const nameObj = resource.name?.[0];
        const displayName = nameObj ? (nameObj.text || `${nameObj.given?.join(' ')} ${nameObj.family || ''}`) : 'Unnamed Patient';
        const id = resource.id;

        const listItem = document.createElement('div');
        listItem.className = 'patient-list-item';
        listItem.dataset.id = id;
        listItem.innerHTML = `
          <span class="patient-list-item-name">${displayName}</span>
          <span class="patient-list-item-id">Patient/${id}</span>
        `;

        listItem.addEventListener('click', () => {
          document.querySelectorAll('.patient-list-item').forEach(li => li.classList.remove('selected'));
          listItem.classList.add('selected');
          lookupPatientId.value = id;
          lookupPatient(id);
        });

        recentPatientsList.appendChild(listItem);
      });
    } catch (error) {
      recentPatientsList.innerHTML = `<div class="list-loading" style="color:var(--error-color)">Error: ${error.message}</div>`;
    }
  }

  async function lookupPatient(id) {
    try {
      explorerPlaceholder.classList.add('hidden');
      explorerMetadataCard.classList.add('hidden');
      explorerPatientCard.classList.add('hidden');
      
      const response = await fetch(`/api/fhir/patient/${id}`);
      
      if (response.status === 404) {
        alert(`Patient ID ${id} not found on FHIR server.`);
        explorerPlaceholder.classList.remove('hidden');
        return;
      }
      
      const data = await response.json();
      explorerPatientCard.classList.remove('hidden');

      // Update card UI values
      const nameObj = data.name?.[0];
      const displayName = nameObj ? (nameObj.text || `${nameObj.given?.join(' ')} ${nameObj.family || ''}`) : 'Unnamed Patient';
      
      cardAvatar.textContent = displayName.charAt(0).toUpperCase();
      cardName.textContent = displayName;
      cardPatientId.textContent = `Patient/${data.id}`;
      
      cardHno.textContent = data.identifier?.[0]?.value || 'N/A';
      cardDob.textContent = data.birthDate || 'N/A';
      cardGender.textContent = data.gender || 'N/A';
      cardPhone.textContent = data.telecom?.[0]?.value || 'N/A';
      cardAddress.textContent = data.address?.[0]?.text || data.address?.[0]?.line?.join(', ') || 'N/A';
      
      // Look for extensions
      const sourceExt = data.extension?.find(ext => ext.url.includes('source-information'));
      const platformExt = data.extension?.find(ext => ext.url.includes('assessable-platform'));
      
      cardSource.textContent = sourceExt ? sourceExt.valueString : 'N/A';
      cardPlatform.textContent = platformExt ? platformExt.valueString : 'N/A';

      renderRawJson(data, explorerJsonCode);
      
      // Select the item if it exists in the list
      document.querySelectorAll('.patient-list-item').forEach(li => {
        if (li.dataset.id === id) {
          li.classList.add('selected');
        } else {
          li.classList.remove('selected');
        }
      });
      
      activateExplorerView('visual');
    } catch (error) {
      alert('Error fetching patient profile: ' + error.message);
      explorerPlaceholder.classList.remove('hidden');
    }
  }

});
