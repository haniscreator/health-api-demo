document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const endpointTabs = document.getElementById('endpointTabs');
  const paramForm = document.getElementById('paramForm');
  const sendBtn = document.getElementById('sendBtn');
  const btnLoader = sendBtn.querySelector('.loader');
  const btnArrow = sendBtn.querySelector('.arrow-icon');
  
  const viewTabs = document.getElementById('viewTabs');
  const visualView = document.getElementById('visualView');
  const jsonView = document.getElementById('jsonView');
  const visualPlaceholder = document.getElementById('visualPlaceholder');
  const visualContent = document.getElementById('visualContent');
  const jsonPlaceholder = document.getElementById('jsonPlaceholder');
  const jsonContent = document.getElementById('jsonContent');
  const jsonCode = document.getElementById('jsonCode');

  // Input Containers
  const inputs = {
    health: document.getElementById('healthInputs'),
    token: document.getElementById('tokenInputs'),
    search: document.getElementById('searchInputs'),
    entity: document.getElementById('entityInputs')
  };

  let activeEndpoint = 'health';
  let activeView = 'visual';

  // Tab switching logic for endpoints
  endpointTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    // Toggle active state in tabs
    endpointTabs.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // Toggle input visibility
    activeEndpoint = btn.dataset.endpoint;
    Object.keys(inputs).forEach(key => {
      if (key === activeEndpoint) {
        inputs[key].classList.add('active-inputs');
      } else {
        inputs[key].classList.remove('active-inputs');
      }
    });
  });

  // Tab switching logic for view modes (Visual vs JSON)
  viewTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-btn');
    if (!btn) return;

    viewTabs.querySelectorAll('.view-btn').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');

    activeView = btn.dataset.view;
    if (activeView === 'visual') {
      visualView.classList.add('active-view');
      jsonView.classList.remove('active-view');
    } else {
      jsonView.classList.add('active-view');
      visualView.classList.remove('active-view');
    }
  });

  // Action: Submit Request
  paramForm.addEventListener('submit', async () => {
    let url = '';
    const origin = window.location.origin;

    // Build URL based on active endpoint selection
    if (activeEndpoint === 'health') {
      url = `${origin}/health`;
    } else if (activeEndpoint === 'token') {
      url = `${origin}/api/icd/token`;
    } else if (activeEndpoint === 'search') {
      const q = document.getElementById('searchQuery').value.trim();
      if (!q) {
        alert('Please enter a search query');
        return;
      }
      url = `${origin}/api/icd/search?q=${encodeURIComponent(q)}`;
    } else if (activeEndpoint === 'entity') {
      const id = document.getElementById('entityId').value.trim();
      if (!id) {
        alert('Please enter an Entity ID');
        return;
      }
      url = `${origin}/api/icd/entity/${encodeURIComponent(id)}`;
    }

    await executeRequest(url);
  });

  // Request Runner
  async function executeRequest(url) {
    // UI Loading state
    sendBtn.disabled = true;
    btnLoader.classList.remove('hidden');
    btnArrow.classList.add('hidden');

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      renderResponse(data, response.ok);
    } catch (err) {
      console.error(err);
      renderResponse({ success: false, message: 'Failed to communicate with local server.', details: err.message }, false);
    } finally {
      // Restore button state
      sendBtn.disabled = false;
      btnLoader.classList.add('hidden');
      btnArrow.classList.remove('hidden');
    }
  }

  // Response renderer
  function renderResponse(data, isOk) {
    // 1. Render Raw JSON with Syntax Highlighting
    jsonPlaceholder.classList.add('hidden');
    jsonContent.classList.remove('hidden');
    jsonCode.innerHTML = syntaxHighlight(data);

    // 2. Render Visual Component View
    visualPlaceholder.classList.add('hidden');
    visualContent.classList.remove('hidden');
    
    // Clear old visual content
    visualContent.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'visual-card';

    if (!isOk || data.success === false) {
      container.innerHTML = `
        <div class="status-badge error">
          <span class="pulse-icon" style="background-color: #ef4444; box-shadow: 0 0 12px #ef4444;"></span>
          <span>Error (${data.message || 'Unknown Request Error'})</span>
        </div>
      `;
      visualContent.appendChild(container);
      return;
    }

    // Endpoint Specific Graphical Renderers
    if (activeEndpoint === 'health') {
      container.innerHTML = `
        <div class="status-badge">
          <span class="pulse-icon"></span>
          <span>Server running correctly: ${data.message}</span>
        </div>
      `;
    } 
    else if (activeEndpoint === 'token') {
      container.innerHTML = `
        <div class="status-badge" style="margin-bottom: 20px;">
          <span class="pulse-icon"></span>
          <span>Token retrieved successfully & cached</span>
        </div>
        <div class="token-card">
          <div class="token-row">
            <span class="token-label">Token Type</span>
            <span class="token-val highlight">${data.token_type}</span>
          </div>
          <div class="token-row">
            <span class="token-label">Expires In</span>
            <span class="token-val">${data.expires_in} seconds</span>
          </div>
          <div class="token-row">
            <span class="token-label">Access Token</span>
            <span class="token-val" style="font-size: 0.75rem; color: var(--text-muted);">${data.access_token.substring(0, 50)}...</span>
          </div>
        </div>
      `;
    } 
    else if (activeEndpoint === 'search') {
      let itemsHtml = '';
      if (data.results && data.results.length > 0) {
        data.results.forEach(item => {
          itemsHtml += `
            <div class="search-item" data-id="${item.id}">
              <div>
                <div class="disease-title">${item.title}</div>
                <div class="disease-action-hint">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <span>Click to view detailed disease node</span>
                </div>
              </div>
              <div>
                ${item.code ? `<span class="disease-code">${item.code}</span>` : `<span class="disease-code" style="color: var(--text-muted); border-style: dashed;">No Code</span>`}
              </div>
            </div>
          `;
        });
      } else {
        itemsHtml = `<p class="no-hierarchy">No search results found.</p>`;
      }

      container.innerHTML = `
        <div class="search-meta">Found ${data.total} matching disease categories for "${data.query}"</div>
        <div class="search-list">
          ${itemsHtml}
        </div>
      `;

      // Click list item action listener: auto request details
      setTimeout(() => {
        container.querySelectorAll('.search-item').forEach(el => {
          el.addEventListener('click', () => {
            const id = el.dataset.id;
            loadDetailsDirectly(id);
          });
        });
      }, 0);
    } 
    else if (activeEndpoint === 'entity') {
      const details = data.data;
      
      // Build parent pills
      let parentHtml = `<span class="no-hierarchy">No parent category (root node)</span>`;
      if (details.parent) {
        parentHtml = `<span class="link-pill parent-link" data-id="${details.parent}">ID: ${details.parent} &uarr;</span>`;
      }

      // Build children pills
      let childrenHtml = `<span class="no-hierarchy">No child categories</span>`;
      if (details.children && details.children.length > 0) {
        childrenHtml = details.children.map(cid => `
          <span class="link-pill child-link" data-id="${cid}">ID: ${cid} &darr;</span>
        `).join('');
      }

      container.innerHTML = `
        <div class="detail-card">
          <div class="detail-title-block">
            <h3>${details.title}</h3>
            ${details.code ? `<span class="disease-code" style="font-size: 0.9rem; padding: 4px 10px;">Classification Code: ${details.code}</span>` : `<span class="disease-code" style="font-size: 0.9rem; color: var(--text-muted); border-style: dashed; padding: 4px 10px;">No Classification Code</span>`}
          </div>

          <div class="detail-def-block">
            <label>Disease Definition</label>
            <p>${details.definition || 'No definition text is available for this ICD classification category.'}</p>
          </div>

          <div class="hierarchy-grid">
            <div class="hierarchy-box">
              <h4>Parent Entity</h4>
              <div>${parentHtml}</div>
            </div>
            <div class="hierarchy-box">
              <h4>Children Entities</h4>
              <div style="max-height: 180px; overflow-y: auto;">${childrenHtml}</div>
            </div>
          </div>
        </div>
      `;

      // Click node links logic: traverse tree
      setTimeout(() => {
        container.querySelectorAll('.parent-link, .child-link').forEach(el => {
          el.addEventListener('click', () => {
            const id = el.dataset.id;
            loadDetailsDirectly(id);
          });
        });
      }, 0);
    }

    visualContent.appendChild(container);
  }

  // Switch form input and trigger query details directly (e.g. from search click or parent/child clicks)
  async function loadDetailsDirectly(entityId) {
    // 1. Activate entity tab
    endpointTabs.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    const entityTabBtn = endpointTabs.querySelector('[data-endpoint="entity"]');
    entityTabBtn.classList.add('active');
    
    activeEndpoint = 'entity';
    Object.keys(inputs).forEach(key => {
      if (key === 'entity') {
        inputs[key].classList.add('active-inputs');
      } else {
        inputs[key].classList.remove('active-inputs');
      }
    });

    // 2. Set input value
    document.getElementById('entityId').value = entityId;

    // 3. Auto click and execute
    const origin = window.location.origin;
    const url = `${origin}/api/icd/entity/${encodeURIComponent(entityId)}`;
    await executeRequest(url);
  }

  // Rich JSON Syntax Highlighter
  function syntaxHighlight(json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      
      if (cls === 'key') {
        // Remove trailing colon for styled text, then append outside span
        return '<span class="json-key">' + match.replace(':', '') + '</span>:';
      } else {
        return '<span class="json-' + cls + '">' + match + '</span>';
      }
    });
  }
});
