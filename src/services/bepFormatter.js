import DOMPurify from 'dompurify';
import CONFIG from '../config/bepConfig';

export const generateBEPContent = (formData, bepType, options = {}) => {
  const { tidpData = [], midpData = [] } = options;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  // Group steps by category
  const groupedSteps = CONFIG.steps.reduce((acc, step, index) => {
    const cat = step.category;
    if (!acc[cat]) acc[cat] = [];
    const stepConfig = CONFIG.getFormFields(bepType, index);
    if (stepConfig) {
      acc[cat].push({ index, title: `${acc[cat].length + 1}. ${stepConfig.title}`, fields: stepConfig.fields });
    }
    return acc;
  }, {});

  const renderField = (field) => {
    let value = formData[field.name];
    if (!value) return '';

    if (field.type === 'checkbox' && Array.isArray(value)) {
      return `
        <div class="field-container">
          <h4 class="field-title">${field.number ? field.number + ' ' : ''}${field.label}</h4>
          <ul class="checkbox-list">
            ${value.map(item => `<li class="checkbox-item">${DOMPurify.sanitize(item)}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (field.type === 'table' && Array.isArray(value)) {
      if (value.length === 0) return '';

      const columns = field.columns || ['Column 1', 'Column 2', 'Column 3'];
      let tableHtml = `
        <div class="field-container">
          <h4 class="field-title">${field.number ? field.number + ' ' : ''}${field.label}</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  ${columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${value.map((row, index) => `
                  <tr class="${index % 2 === 0 ? 'even-row' : 'odd-row'}">
                    ${columns.map(col => `<td>${DOMPurify.sanitize(row[col] || '')}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      return tableHtml;
    }

    if (field.type === 'textarea') {
      return `
        <div class="field-container">
          <h4 class="field-title">${field.number ? field.number + ' ' : ''}${field.label}</h4>
          <div class="textarea-content">${DOMPurify.sanitize(value)}</div>
        </div>
      `;
    }

    return `
      <div class="field-pair">
        <span class="field-label">${field.number ? field.number + ' ' : ''}${field.label}:</span>
        <span class="field-value">${DOMPurify.sanitize(value)}</span>
      </div>
    `;
  };

  // ISO 19650 Compliance Section
  const iso19650ComplianceSection = `
    <section class="iso-compliance-section">
      <div class="iso-header">
        <div class="iso-badge">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>ISO 19650-2:2018</span>
        </div>
        <h2 class="iso-title">ISO 19650 Compliance Statement</h2>
      </div>

      <div class="iso-content">
        <div class="iso-declaration">
          <h3>Formal Declaration of Conformity</h3>
          <p>This BIM Execution Plan (BEP) has been prepared in accordance with <strong>ISO 19650-2:2018</strong>
          "Organization and digitization of information about buildings and civil engineering works, including
          building information modelling (BIM) — Information management using building information modelling —
          Part 2: Delivery phase of the assets."</p>
          <p>The document establishes a framework for managing information throughout the project delivery phase,
          ensuring consistent information exchange between all project participants and supporting effective
          collaboration in accordance with the ISO 19650 series standards.</p>
        </div>

        <div class="iso-coverage">
          <h3>ISO 19650-2 Requirements Coverage</h3>
          <div class="coverage-grid">
            <div class="coverage-item completed">
              <span class="coverage-icon">✓</span>
              <div>
                <strong>5.1 Information Management</strong>
                <p>Information management function and responsibilities defined</p>
              </div>
            </div>
            <div class="coverage-item completed">
              <span class="coverage-icon">✓</span>
              <div>
                <strong>5.2 Planning Approach</strong>
                <p>Master Information Delivery Plan (MIDP) and Task Information Delivery Plans (TIDPs)</p>
              </div>
            </div>
            <div class="coverage-item completed">
              <span class="coverage-icon">✓</span>
              <div>
                <strong>5.3 Information Requirements</strong>
                <p>Exchange information requirements and level of information need defined</p>
              </div>
            </div>
            <div class="coverage-item completed">
              <span class="coverage-icon">✓</span>
              <div>
                <strong>5.4 Collaborative Production</strong>
                <p>Common Data Environment (CDE) workflows and federation strategy</p>
              </div>
            </div>
            <div class="coverage-item completed">
              <span class="coverage-icon">✓</span>
              <div>
                <strong>5.5 Quality Assurance</strong>
                <p>Information validation, review and approval processes</p>
              </div>
            </div>
            <div class="coverage-item completed">
              <span class="coverage-icon">✓</span>
              <div>
                <strong>5.6 Information Security</strong>
                <p>Information security protocols and access control procedures</p>
              </div>
            </div>
          </div>
        </div>

        <div class="iso-deliverables">
          <h3>Key ISO 19650 Deliverables</h3>
          <ul class="deliverables-list">
            <li><strong>BIM Execution Plan (BEP):</strong> This document defining information management approach</li>
            <li><strong>Task Information Delivery Plans (TIDPs):</strong> Discipline-specific delivery schedules and responsibilities</li>
            <li><strong>Master Information Delivery Plan (MIDP):</strong> Consolidated project-wide information delivery schedule</li>
            <li><strong>Information Protocol:</strong> Standards, procedures and naming conventions</li>
            <li><strong>Responsibility Matrix:</strong> RACI matrix defining roles and accountabilities</li>
            <li><strong>Risk Register:</strong> Information-related risks and mitigation strategies</li>
          </ul>
        </div>

        <div class="iso-references">
          <h3>Referenced Standards and Guidelines</h3>
          <ul class="references-list">
            <li>ISO 19650-1:2018 — Concepts and principles</li>
            <li>ISO 19650-2:2018 — Delivery phase of the assets</li>
            <li>ISO 19650-5:2020 — Security-minded approach to information management</li>
            <li>BS 1192:2007+A2:2016 — Collaborative production of information</li>
            <li>PAS 1192-2:2013 — Capital/delivery phase</li>
            <li>PAS 1192-3:2014 — Operational phase</li>
          </ul>
        </div>
      </div>
    </section>
  `;

  // Information Delivery Plan Section
  const informationDeliverySection = `
    <section class="information-delivery-section">
      <div class="idp-header">
        <div class="idp-badge">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Information Delivery Plan</span>
        </div>
        <h2 class="idp-title">TIDP/MIDP Integration</h2>
      </div>

      <div class="idp-content">
        ${tidpData.length > 0 ? `
          <div class="tidp-overview">
            <h3>6.1.4 Task Information Delivery Plans (TIDPs)</h3>
            <p>The following TIDPs have been established for this project. Each TIDP is maintained as a separate controlled document:</p>

            <table class="tidp-summary-table">
              <thead>
                <tr>
                  <th>Task Team</th>
                  <th>Discipline</th>
                  <th>Team Leader</th>
                  <th>Deliverables</th>
                  <th>Document Reference</th>
                </tr>
              </thead>
              <tbody>
                ${tidpData.map((tidp, index) => `
                  <tr>
                    <td><strong>${tidp.teamName || tidp.taskTeam || `Task Team ${index + 1}`}</strong></td>
                    <td>${tidp.discipline || 'N/A'}</td>
                    <td>${tidp.leader || tidp.teamLeader || 'TBD'}</td>
                    <td>${tidp.containers?.length || 0} containers</td>
                    <td>TIDP-${String(index + 1).padStart(2, '0')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p class="document-note"><em>Note: Detailed TIDP documents including all information containers, delivery schedules, and LOIN specifications are available as separate appendices.</em></p>
          </div>
        ` : `
          <div class="no-tidp-notice">
            <p><em>Task teams will develop individual TIDPs defining their information delivery requirements in accordance with the project EIR.</em></p>
          </div>
        `}

        ${midpData.length > 0 ? `
          <div class="midp-overview">
            <h3>6.1.1 Master Information Delivery Plan (MIDP)</h3>
            <p>The MIDP consolidates all task team delivery requirements into a single coordinated schedule:</p>

            <table class="midp-summary-table">
              <thead>
                <tr>
                  <th>MIDP Reference</th>
                  <th>Version</th>
                  <th>Aggregated TIDPs</th>
                  <th>Total Deliverables</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${midpData.map((midp, index) => `
                  <tr>
                    <td><strong>MIDP-${String(index + 1).padStart(2, '0')}</strong></td>
                    <td>${midp.version || '1.0'}</td>
                    <td>${midp.aggregatedTidps?.length || tidpData.length} TIDPs</td>
                    <td>${midp.totalDeliverables || '-'}</td>
                    <td><span class="status-badge status-${(midp.status || 'Active').toLowerCase()}">${midp.status || 'Active'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="midp-description">
              <p><strong>Description:</strong> ${midpData[0]?.description || 'The MIDP provides a project-wide consolidated view of information delivery milestones, integrating all task team schedules into a coordinated programme aligned with project stages.'}</p>
            </div>

            <p class="document-note"><em>Note: The complete MIDP including detailed milestone schedules, dependencies, and RACI matrices is maintained as a separate controlled document (MIDP-01).</em></p>
          </div>
        ` : `
          <div class="no-midp-notice">
            <p><em>The MIDP will be generated by aggregating all approved TIDPs into a consolidated master delivery schedule.</em></p>
          </div>
        `}

        <div class="idp-integration-note">
          <h3>Integration with BEP</h3>
          <p>The TIDPs and MIDP defined above are integral components of this BIM Execution Plan, providing the detailed information delivery framework required by ISO 19650-2:2018. The BEP establishes the overarching information management strategy, while the TIDPs and MIDP provide the specific implementation details for each task team and the project as a whole.</p>
        </div>
      </div>
    </section>
  `;

  const sectionsHtml = Object.entries(groupedSteps).map(([cat, items]) => `
    <section class="category-section">
      <div class="category-header">
        <div class="category-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h2 class="category-title">${CONFIG.categories[cat].name}</h2>
      </div>

      ${items.map(item => {
        const fields = item.fields;
        const tableFields = fields.filter(f => f.type !== 'textarea' && f.type !== 'checkbox');
        const otherFields = fields.filter(f => f.type === 'textarea' || f.type === 'checkbox');

        return `
          <div class="content-section">
            <h3 class="section-title">${item.title}</h3>
            <div class="section-content">
              ${tableFields.length > 0 ? `
                <div class="info-table">
                  ${tableFields.map(renderField).join('')}
                </div>
              ` : ''}
              ${otherFields.map(renderField).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </section>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BIM Execution Plan - ${formData.projectName || 'Unnamed Project'}</title>
      <style>
        /* Reset and base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Header styles */
        .document-header {
          background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
          color: white;
          padding: 40px 30px;
          border-radius: 16px;
          margin-bottom: 30px;
          box-shadow: 0 10px 25px rgba(30, 64, 175, 0.2);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .document-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.1;
        }

        .document-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
          z-index: 1;
        }

        .document-subtitle {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 20px;
          opacity: 0.95;
          position: relative;
          z-index: 1;
        }

        .bep-type-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 15px 0;
          position: relative;
          z-index: 1;
        }

        .bep-description {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px;
          border-radius: 12px;
          font-style: italic;
          max-width: 800px;
          margin: 20px auto 0;
          position: relative;
          z-index: 1;
        }

        /* Document info box */
        .document-info {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 2px solid #10b981;
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
        }

        .document-info h3 {
          color: #065f46;
          font-size: 1.5rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .document-info h3::before {
          content: '📋';
          font-size: 1.2rem;
        }

        .info-table {
          display: grid;
          gap: 12px;
        }

        .field-pair {
          display: flex;
          align-items: flex-start;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 8px;
          border-left: 4px solid #10b981;
        }

        .field-label {
          font-weight: 600;
          color: #374151;
          min-width: 200px;
          flex-shrink: 0;
        }

        .field-value {
          color: #1f2937;
          flex: 1;
        }

        /* Category sections */
        .category-section {
          margin-bottom: 40px;
        }

        .category-header {
          background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
          color: white;
          padding: 20px 25px;
          border-radius: 12px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 6px 20px rgba(30, 64, 175, 0.15);
        }

        .category-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        /* Content sections */
        .content-section {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .section-title {
          color: #1e40af;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #dbeafe;
        }

        .section-content {
          color: #374151;
        }

        /* Field containers */
        .field-container {
          margin-bottom: 25px;
        }

        .field-title {
          color: #1f2937;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .field-title::before {
          content: '📝';
          font-size: 0.9rem;
        }

        .textarea-content {
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        /* Checkbox lists */
        .checkbox-list {
          background: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          border-left: 4px solid #8b5cf6;
        }

        .checkbox-item {
          margin-bottom: 8px;
          padding-left: 8px;
          position: relative;
        }

        .checkbox-item::before {
          content: '✓';
          color: #8b5cf6;
          font-weight: bold;
          position: absolute;
          left: -8px;
          top: 0;
        }

        /* Tables */
        .table-container {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-top: 12px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .data-table thead {
          background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
          color: white;
        }

        .data-table th {
          padding: 16px 12px;
          text-align: left;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .data-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .data-table .even-row {
          background: #ffffff;
        }

        .data-table .odd-row {
          background: #f8fafc;
        }

        .data-table tbody tr:hover {
          background: #dbeafe;
          transition: background-color 0.2s ease;
        }

        /* Footer */
        .document-footer {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          color: white;
          padding: 30px;
          border-radius: 16px;
          margin-top: 40px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .document-footer h3 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .document-footer h3::before {
          content: '🏢';
          font-size: 1.2rem;
        }

        .footer-table {
          display: grid;
          gap: 12px;
        }

        .footer-table .field-pair {
          background: rgba(255, 255, 255, 0.1);
          border-left-color: #60a5fa;
        }

        /* ISO 19650 Compliance Section Styles */
        .iso-compliance-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 3px solid #10b981;
          border-radius: 16px;
          padding: 35px;
          margin: 40px 0;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.15);
        }

        .iso-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .iso-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 1.2rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          margin-bottom: 20px;
        }

        .iso-badge svg {
          stroke-width: 2.5;
        }

        .iso-title {
          font-size: 2rem;
          font-weight: 700;
          color: #065f46;
          margin: 0;
        }

        .iso-content {
          background: white;
          border-radius: 12px;
          padding: 30px;
        }

        .iso-declaration,
        .iso-coverage,
        .iso-deliverables,
        .iso-references {
          margin-bottom: 30px;
        }

        .iso-declaration h3,
        .iso-coverage h3,
        .iso-deliverables h3,
        .iso-references h3 {
          color: #065f46;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #10b981;
        }

        .iso-declaration p {
          line-height: 1.8;
          color: #374151;
          margin-bottom: 12px;
        }

        .coverage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .coverage-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #f0fdf4;
          border-radius: 10px;
          border-left: 4px solid #10b981;
        }

        .coverage-item.completed .coverage-icon {
          background: #10b981;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .coverage-item strong {
          color: #065f46;
          display: block;
          margin-bottom: 4px;
          font-size: 0.95rem;
        }

        .coverage-item p {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.5;
        }

        .deliverables-list,
        .references-list {
          list-style: none;
          padding: 0;
        }

        .deliverables-list li,
        .references-list li {
          padding: 12px 16px;
          margin-bottom: 10px;
          background: #f9fafb;
          border-left: 4px solid #10b981;
          border-radius: 6px;
          line-height: 1.6;
        }

        .deliverables-list li strong {
          color: #065f46;
        }

        /* Information Delivery Plan Section Styles */
        .information-delivery-section {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 3px solid #f59e0b;
          border-radius: 16px;
          padding: 35px;
          margin: 40px 0;
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.15);
        }

        .idp-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .idp-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 1.2rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          margin-bottom: 20px;
        }

        .idp-badge svg {
          stroke-width: 2.5;
        }

        .idp-title {
          font-size: 2rem;
          font-weight: 700;
          color: #92400e;
          margin: 0;
        }

        .idp-content {
          background: white;
          border-radius: 12px;
          padding: 30px;
        }

        .tidp-overview h3,
        .midp-overview h3,
        .idp-integration-note h3 {
          color: #92400e;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f59e0b;
        }

        .tidp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .tidp-card {
          background: #fef3c7;
          border: 2px solid #fde68a;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
        }

        .tidp-card .tidp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #fde68a;
        }

        .tidp-card h4 {
          color: #92400e;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        .tidp-discipline {
          background: #f59e0b;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .tidp-field {
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .tidp-field strong {
          color: #92400e;
        }

        .tidp-containers ul {
          margin-top: 5px;
          padding-left: 20px;
        }

        .tidp-containers li {
          margin-bottom: 3px;
          color: #6b7280;
        }

        .tidp-summary-table,
        .midp-summary-table {
          width: 100%;
          margin-top: 15px;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .tidp-summary-table thead,
        .midp-summary-table thead {
          background: #2563eb;
          color: white;
        }

        .tidp-summary-table th,
        .midp-summary-table th {
          padding: 10px 12px;
          text-align: left;
          font-weight: 600;
          border: 1px solid #dbeafe;
        }

        .tidp-summary-table td,
        .midp-summary-table td {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          color: #374151;
        }

        .tidp-summary-table tbody tr:nth-child(even),
        .midp-summary-table tbody tr:nth-child(even) {
          background: #f9fafb;
        }

        .tidp-summary-table tbody tr:hover,
        .midp-summary-table tbody tr:hover {
          background: #eff6ff;
        }

        .document-note {
          margin-top: 12px;
          padding: 10px 15px;
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          font-size: 0.85rem;
          color: #92400e;
        }

        .status-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-draft {
          background: #fef3c7;
          color: #92400e;
        }

        .midp-description {
          margin-top: 15px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
          line-height: 1.6;
        }

        .midp-summary {
          margin-top: 20px;
        }

        .midp-item {
          background: #fef3c7;
          border: 2px solid #fde68a;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
        }

        .midp-item .midp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #fde68a;
        }

        .midp-item h4 {
          color: #92400e;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        .midp-status {
          background: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .midp-field {
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .midp-field strong {
          color: #92400e;
        }

        .midp-milestones ul,
        .midp-tidps ul {
          margin-top: 5px;
          padding-left: 20px;
        }

        .midp-milestones li,
        .midp-tidps li {
          margin-bottom: 3px;
          color: #6b7280;
        }

        .midp-tidps {
          margin-bottom: 12px;
        }

        .midp-tidps strong {
          color: #92400e;
        }

        .midp-stats {
          margin-top: 12px;
          padding: 10px;
          background: #fffbeb;
          border-radius: 6px;
          border-left: 3px solid #f59e0b;
        }

        .midp-stats strong {
          color: #92400e;
        }

        .no-tidp-notice,
        .no-midp-notice {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          color: #6b7280;
          font-style: italic;
          margin: 20px 0;
        }

        .idp-integration-note {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #fde68a;
        }

        .idp-integration-note p {
          line-height: 1.8;
          color: #374151;
        }
        @media print {
          body {
            background: white !important;
            font-size: 12px;
          }

          .container {
            max-width: none;
            padding: 0;
          }

          .document-header,
          .category-header,
          .content-section,
          .document-info,
          .document-footer,
          .iso-compliance-section {
            box-shadow: none !important;
            break-inside: avoid;
          }

          .data-table {
            page-break-inside: avoid;
          }

          .coverage-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }

          .document-title {
            font-size: 2rem;
          }

          .document-header,
          .category-header,
          .content-section,
          .document-info,
          .document-footer {
            padding: 20px;
          }

          .field-pair {
            flex-direction: column;
            gap: 4px;
          }

          .field-label {
            min-width: auto;
            font-weight: 700;
          }

          .data-table {
            font-size: 0.8rem;
          }

          .data-table th,
          .data-table td {
            padding: 8px 6px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header class="document-header">
          <h1 class="document-title">BIM EXECUTION PLAN (BEP)</h1>
          <div class="document-subtitle">ISO 19650-2:2018 Compliant</div>
          <div class="bep-type-badge">${CONFIG.bepTypeDefinitions[bepType].title}</div>
          <div class="bep-description">
            ${CONFIG.bepTypeDefinitions[bepType].description}
          </div>
        </header>

        <section class="document-info">
          <h3>Document Information</h3>
          <div class="info-table">
            <div class="field-pair">
              <span class="field-label">Document Type:</span>
              <span class="field-value">${CONFIG.bepTypeDefinitions[bepType].title}</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Document Purpose:</span>
              <span class="field-value">${CONFIG.bepTypeDefinitions[bepType].purpose}</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Project Name:</span>
              <span class="field-value">${formData.projectName || 'Not specified'}</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Project Number:</span>
              <span class="field-value">${formData.projectNumber || 'Not specified'}</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Generated Date:</span>
              <span class="field-value">${formattedDate} at ${formattedTime}</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Status:</span>
              <span class="field-value">${bepType === 'pre-appointment' ? 'Tender Submission' : 'Working Document'}</span>
            </div>
          </div>
        </section>

        ${iso19650ComplianceSection}

        ${informationDeliverySection}

        ${sectionsHtml}

        <footer class="document-footer">
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="display: inline-block; background: rgba(16, 185, 129, 0.15); padding: 12px 24px; border-radius: 20px; border: 2px solid rgba(16, 185, 129, 0.3);">
              <span style="font-size: 1.1rem; font-weight: 600;">✓ Generated in compliance with ISO 19650-2:2018</span>
            </div>
          </div>

          <h3>Document Control Information</h3>
          <div class="footer-table">
            <div class="field-pair">
              <span class="field-label">Document Type:</span>
              <span class="field-value">BIM Execution Plan (BEP)</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Compliance Standard:</span>
              <span class="field-value">ISO 19650-2:2018 — Information management using building information modelling</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Document Status:</span>
              <span class="field-value">${bepType === 'pre-appointment' ? 'Tender Submission' : 'Working Document'}</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Project Name:</span>
              <span class="field-value">${formData.projectName || 'Not specified'}</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Document Version:</span>
              <span class="field-value">1.0</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Generated By:</span>
              <span class="field-value">Professional BEP Generator Tool</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Generated Date:</span>
              <span class="field-value">${formattedDate}</span>
            </div>
            <div class="field-pair">
              <span class="field-label">Generated Time:</span>
              <span class="field-value">${formattedTime}</span>
            </div>
          </div>

          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); text-align: center; font-size: 0.9rem; opacity: 0.8;">
            <p style="margin: 0;">This document follows the information management principles established in ISO 19650 series standards.</p>
            <p style="margin: 8px 0 0 0;">For any questions regarding compliance or implementation, consult with a qualified ISO 19650 practitioner.</p>
          </div>
        </footer>
      </div>
    </body>
    </html>
  `;
};