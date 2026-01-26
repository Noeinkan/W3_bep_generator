const path = require('path');
const fs = require('fs');

class EirExportService {
  constructor() {
    this._cssCache = null;
  }

  generateEirAnalysisHTML(analysis, summary, options = {}) {
    const css = this.getInlineCSS();
    const projectName = this.escapeHtml(analysis?.project_info?.name || 'EIR Analysis');
    const generatedAt = new Date().toLocaleString();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName} - EIR Analysis</title>
  <style>${css}</style>
</head>
<body>
  <div class="container">
    <div class="cover-page">
      <h1 class="cover-title">EIR ANALYSIS REPORT</h1>
      <p class="cover-subtitle">${projectName}</p>
      <p class="cover-info-date">Generated: ${this.escapeHtml(generatedAt)}</p>
    </div>

    ${summary ? this.renderSummary(summary) : ''}

    ${this.renderProjectInfo(analysis)}
    ${this.renderObjectives(analysis)}
    ${this.renderInformationRequirements(analysis)}
    ${this.renderMilestones(analysis)}
    ${this.renderStandards(analysis)}
    ${this.renderCde(analysis)}
    ${this.renderRoles(analysis)}
    ${this.renderRisks(analysis)}
    ${this.renderSoftware(analysis)}
    ${this.renderQuality(analysis)}
    ${this.renderHandover(analysis)}
  </div>
</body>
</html>`;
  }

  renderSummary(summary) {
    const summaryHtml = this.renderSummaryMarkdown(summary);
    if (!summaryHtml) return '';
    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Summary</h2>
        </div>
        <div class="section-content">${summaryHtml}</div>
      </div>
    `;
  }

  renderProjectInfo(analysis) {
    const info = analysis?.project_info || {};
    const rows = [
      { label: 'Project Name', value: info.name },
      { label: 'Client', value: info.client },
      { label: 'Project Type', value: info.project_type },
      { label: 'Location', value: info.location },
      { label: 'Estimated Value', value: info.estimated_value }
    ].filter(row => row.value);

    if (rows.length === 0 && !info.description) return '';

    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Project Information</h2>
        </div>
        <div class="section-content">
          ${rows.length > 0 ? this.renderKeyValueTable(rows) : ''}
          ${info.description ? `<p class="paragraph">${this.escapeHtml(info.description)}</p>` : ''}
        </div>
      </div>
    `;
  }

  renderObjectives(analysis) {
    const objectives = analysis?.bim_objectives || [];
    if (!objectives.length) return '';
    return this.renderListSection('BIM Objectives', objectives);
  }

  renderInformationRequirements(analysis) {
    const info = analysis?.information_requirements || {};
    const sections = [
      { label: 'OIR', items: info.OIR || [] },
      { label: 'AIR', items: info.AIR || [] },
      { label: 'PIR', items: info.PIR || [] },
      { label: 'EIR Specifics', items: info.EIR_specifics || [] }
    ].filter(section => section.items.length > 0);

    if (sections.length === 0) return '';

    const content = sections.map(section => `
      <div class="subsection">
        <h3 class="subsection-title">${this.escapeHtml(section.label)}</h3>
        ${this.renderList(section.items)}
      </div>
    `).join('');

    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Information Requirements</h2>
        </div>
        <div class="section-content">${content}</div>
      </div>
    `;
  }

  renderMilestones(analysis) {
    const milestones = analysis?.delivery_milestones || [];
    if (!milestones.length) return '';

    const rows = milestones.map(m => ({
      phase: m.phase || '-',
      description: m.description || '',
      date: m.date || '-'
    }));

    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Delivery Milestones</h2>
        </div>
        <div class="section-content">
          ${this.renderTable(['Phase', 'Description', 'Date'], rows, ['phase', 'description', 'date'])}
        </div>
      </div>
    `;
  }

  renderStandards(analysis) {
    const standards = analysis?.standards_protocols || {};
    const classification = standards.classification_systems || [];
    const fileFormats = standards.file_formats || [];
    const naming = standards.naming_conventions;
    const lod = standards.lod_loi_requirements;

    if (!classification.length && !fileFormats.length && !naming && !lod) return '';

    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Standards & Protocols</h2>
        </div>
        <div class="section-content">
          ${classification.length ? this.renderChipList('Classification Systems', classification) : ''}
          ${fileFormats.length ? this.renderChipList('File Formats', fileFormats) : ''}
          ${naming ? `<p class="paragraph"><strong>Naming Conventions:</strong> ${this.escapeHtml(naming)}</p>` : ''}
          ${lod ? `<p class="paragraph"><strong>LOD/LOI Requirements:</strong> ${this.escapeHtml(lod)}</p>` : ''}
        </div>
      </div>
    `;
  }

  renderCde(analysis) {
    const cde = analysis?.cde_requirements || {};
    const workflow = cde.workflow_states || [];
    if (!cde.platform && !cde.access_control && !workflow.length) return '';

    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">CDE Requirements</h2>
        </div>
        <div class="section-content">
          ${cde.platform ? `<p class="paragraph"><strong>Platform:</strong> ${this.escapeHtml(cde.platform)}</p>` : ''}
          ${workflow.length ? this.renderChipList('Workflow States', workflow) : ''}
          ${cde.access_control ? `<p class="paragraph"><strong>Access Control:</strong> ${this.escapeHtml(cde.access_control)}</p>` : ''}
        </div>
      </div>
    `;
  }

  renderRoles(analysis) {
    const roles = analysis?.roles_responsibilities || [];
    if (!roles.length) return '';

    const content = roles.map(role => `
      <div class="role-card">
        <h3 class="role-title">${this.escapeHtml(role.role)}</h3>
        ${role.responsibilities?.length ? this.renderList(role.responsibilities) : ''}
      </div>
    `).join('');

    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Roles & Responsibilities</h2>
        </div>
        <div class="section-content">${content}</div>
      </div>
    `;
  }

  renderRisks(analysis) {
    const risks = analysis?.specific_risks || [];
    if (!risks.length) return '';
    return this.renderListSection('Risks & Specific Requirements', risks);
  }

  renderSoftware(analysis) {
    const software = analysis?.software_requirements || [];
    if (!software.length) return '';
    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Required Software</h2>
        </div>
        <div class="section-content">
          ${this.renderChipList(null, software)}
        </div>
      </div>
    `;
  }

  renderQuality(analysis) {
    const quality = analysis?.quality_requirements || {};
    if (!quality.model_checking && !quality.clash_detection && !quality.validation_procedures) return '';

    const rows = [
      { label: 'Model Checking', value: quality.model_checking },
      { label: 'Clash Detection', value: quality.clash_detection },
      { label: 'Validation Procedures', value: quality.validation_procedures }
    ].filter(row => row.value);

    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Quality Requirements</h2>
        </div>
        <div class="section-content">
          ${this.renderKeyValueTable(rows)}
        </div>
      </div>
    `;
  }

  renderHandover(analysis) {
    const handover = analysis?.handover_requirements || {};
    const docs = handover.documentation || [];
    if (!handover.asset_data && !handover.cobie_required && !docs.length) return '';

    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Handover Requirements</h2>
        </div>
        <div class="section-content">
          ${handover.cobie_required ? '<p class="paragraph"><strong>COBie Required:</strong> Yes</p>' : ''}
          ${handover.asset_data ? `<p class="paragraph"><strong>Asset Data:</strong> ${this.escapeHtml(handover.asset_data)}</p>` : ''}
          ${docs.length ? this.renderListSection('Documentation', docs, true) : ''}
        </div>
      </div>
    `;
  }

  renderListSection(title, items, compact = false) {
    return `
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">${this.escapeHtml(title)}</h2>
        </div>
        <div class="section-content">
          ${this.renderList(items, compact)}
        </div>
      </div>
    `;
  }

  renderList(items, compact = false) {
    if (!items || items.length === 0) return '';
    const listClass = compact ? 'list compact' : 'list';
    return `
      <ul class="${listClass}">
        ${items.map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
      </ul>
    `;
  }

  renderChipList(title, items) {
    if (!items || items.length === 0) return '';
    const header = title ? `<p class="paragraph"><strong>${this.escapeHtml(title)}:</strong></p>` : '';
    return `
      <div class="chip-section">
        ${header}
        <div class="chip-list">
          ${items.map(item => `<span class="chip">${this.escapeHtml(item)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  renderKeyValueTable(rows) {
    if (!rows || rows.length === 0) return '';
    return `
      <table class="kv-table">
        <tbody>
          ${rows.map(row => `
            <tr>
              <th>${this.escapeHtml(row.label)}</th>
              <td>${this.escapeHtml(row.value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderTable(headers, rows, keys) {
    return `
      <table class="data-table">
        <thead>
          <tr>${headers.map(h => `<th>${this.escapeHtml(h)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              ${keys.map(key => `<td>${this.escapeHtml(row[key] || '')}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderSummaryMarkdown(summary) {
    const lines = summary.split('\n');
    let html = '';
    let inList = false;

    const closeList = () => {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        closeList();
        html += '<br />';
        continue;
      }

      if (line.startsWith('## ')) {
        closeList();
        html += `<h3 class="summary-title">${this.escapeHtml(line.replace(/^##\s+/, ''))}</h3>`;
        continue;
      }

      if (line.startsWith('- ')) {
        if (!inList) {
          html += '<ul class="list">';
          inList = true;
        }
        html += `<li>${this.escapeHtml(line.replace(/^- /, ''))}</li>`;
        continue;
      }

      closeList();
      html += `<p class="paragraph">${this.escapeHtml(line)}</p>`;
    }

    closeList();
    return html;
  }

  escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const str = String(text);
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, m => map[m]);
  }

  loadCSSFromFile() {
    if (this._cssCache) {
      return this._cssCache;
    }

    try {
      const cssPath = path.join(__dirname, 'templates', 'eirAnalysisStyles.css');
      this._cssCache = fs.readFileSync(cssPath, 'utf8');
      return this._cssCache;
    } catch (error) {
      return this.getInlineCSSFallback();
    }
  }

  getInlineCSS() {
    return this.loadCSSFromFile();
  }

  getInlineCSSFallback() {
    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #111827;
        background-color: #ffffff;
      }

      .container {
        max-width: 180mm;
        margin: 0 auto;
      }

      .cover-page {
        margin-bottom: 40px;
        padding: 50px 40px;
        background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        color: #ffffff;
        border-radius: 12px;
        page-break-after: always;
      }

      .cover-title {
        font-size: 30pt;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .cover-subtitle {
        font-size: 16pt;
        margin-bottom: 20px;
      }

      .cover-info-date {
        font-size: 10pt;
        opacity: 0.85;
      }

      .section {
        margin-bottom: 36px;
      }

      .section-header {
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid #2563eb;
      }

      .section-title {
        font-size: 16pt;
        font-weight: 700;
      }

      .section-content {
        padding-left: 10px;
      }

      .summary-title {
        font-size: 13pt;
        font-weight: 700;
        margin: 12px 0 6px;
      }

      .paragraph {
        margin: 6px 0;
        color: #374151;
      }

      .list {
        list-style: disc;
        padding-left: 20px;
        margin: 8px 0 12px;
      }

      .list.compact {
        margin: 6px 0;
      }

      .list li {
        margin-bottom: 6px;
      }

      .kv-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 12px;
      }

      .kv-table th,
      .kv-table td {
        padding: 8px 10px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
      }

      .kv-table th {
        width: 30%;
        color: #6b7280;
        font-weight: 600;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e5e7eb;
      }

      .data-table th,
      .data-table td {
        padding: 8px 10px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
        vertical-align: top;
      }

      .data-table th {
        background: #f3f4f6;
        font-size: 9pt;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #374151;
      }

      .chip-section {
        margin: 10px 0;
      }

      .chip-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }

      .chip {
        padding: 4px 8px;
        background: #eef2ff;
        color: #4338ca;
        border-radius: 999px;
        font-size: 9pt;
      }

      .role-card {
        padding: 12px;
        background: #f9fafb;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        margin-bottom: 10px;
      }

      .role-title {
        font-weight: 600;
        margin-bottom: 6px;
      }

      @page {
        size: A4;
        margin: 22mm 18mm;
      }
    `;
  }
}

module.exports = new EirExportService();
