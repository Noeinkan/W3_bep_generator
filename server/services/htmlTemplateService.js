const fs = require('fs');
const path = require('path');
const { getConfig, loadBepConfigAsync, loadBepConfig } = require('./loadBepConfig');
const snippetService = require('./snippetService');

// Config is loaded async at server startup; use getConfig() when needed

/**
 * HTML Template Service
 * Generates complete HTML for BEP PDF generation with support for:
 * - Table of Contents
 * - Watermarks (Draft, Confidential, Final)
 * - Print-optimized styling
 * - A4-accurate dimensions
 *
 * @class HtmlTemplateService
 */
class HtmlTemplateService {
  constructor() {
    this._cssCache = null;
  }

  /**
   * Generate complete BEP HTML document
   * @param {Object} formData - Form data containing all BEP fields
   * @param {string} bepType - BEP type ('pre-appointment' or 'post-appointment')
   * @param {Array} tidpData - TIDP (Task Information Delivery Plan) data
   * @param {Array} midpData - MIDP (Master Information Delivery Plan) data
   * @param {Object} componentImages - Map of fieldName -> base64 image data
   * @param {Object} options - Additional options
   * @param {string} [options.watermark] - Watermark text (e.g., 'DRAFT', 'CONFIDENTIAL', 'FINAL')
   * @param {boolean} [options.includeToc=true] - Whether to include table of contents
   * @returns {Promise<string>} Complete HTML document
   */
  async generateBEPHTML(formData, bepType, tidpData = [], midpData = [], componentImages = {}, options = {}) {
    const { watermark = null, includeToc = true } = options;
    const snippetMap = snippetService.getMap();
    const css = this.getInlineCSS();
    const sections = this.collectSections(formData, bepType, tidpData, midpData, snippetMap);
    const bodyContent = this.renderBEPContent(formData, bepType, tidpData, midpData, componentImages, sections, { watermark, includeToc, snippetMap });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BIM Execution Plan - ${this.escapeHtml(formData.projectName || 'BEP')}</title>
  <style>${css}</style>
</head>
<body>
  ${watermark ? this.renderWatermark(watermark) : ''}
  ${bodyContent}
</body>
</html>`;
  }

  /**
   * Render watermark element
   * @param {string} text - Watermark text
   * @returns {string} Watermark HTML
   */
  renderWatermark(text) {
    const normalizedText = text.toUpperCase().trim();
    let watermarkClass = 'watermark';

    if (normalizedText === 'DRAFT') {
      watermarkClass += ' watermark-draft';
    } else if (normalizedText === 'CONFIDENTIAL') {
      watermarkClass += ' watermark-confidential';
    } else if (normalizedText === 'FINAL') {
      watermarkClass += ' watermark-final';
    }

    return `<div class="${watermarkClass}">${this.escapeHtml(normalizedText)}</div>`;
  }

  /**
   * Collect all sections for TOC generation
   * @param {Object} formData - Form data
   * @param {string} bepType - BEP type
   * @param {Array} tidpData - TIDP data
   * @param {Array} midpData - MIDP data
   * @returns {Array} Array of section objects with number, title, and subsections
   */
  collectSections(formData, bepType, tidpData, midpData, snippetMap = {}) {
    const sections = [];
    const steps = getConfig().steps || [];

    // Prepend Section 0 if documentHistory exists
    if (formData.documentHistory) {
      sections.push({
        number: '0',
        title: 'Document History & Governance',
        subsections: [
          { number: '0.1', title: 'Revision History' },
          { number: '0.2', title: 'Contributors' },
          { number: '0.3', title: 'Governance Triggers' },
          { number: '0.4', title: 'RACI Review Record' },
        ],
      });
    }

    steps.forEach((step, stepIndex) => {
      const stepConfig = this.getFormFields(bepType, stepIndex);
      if (!stepConfig || !stepConfig.fields) return;

      // Check if section has any content
      const hasContent = stepConfig.fields.some(field => {
        if (field.type === 'section-header') return false;
        return this.hasRenderableValue(field, formData[field.name]);
      });

      if (!hasContent) return;

      const section = {
        number: stepConfig.number,
        title: stepConfig.title,
        subsections: []
      };

      // Collect subsections (field labels with content)
      stepConfig.fields.forEach(field => {
        if (field.type === 'section-header') return;
        if (!this.hasRenderableValue(field, formData[field.name])) return;

        if (field.number) {
          section.subsections.push({
            number: field.number,
            title: snippetService.resolveInText(field.label, snippetMap)
          });
        }
      });

      sections.push(section);
    });

    // Add TIDP/MIDP section if present
    if (tidpData.length > 0 || midpData.length > 0) {
      const tidpSection = {
        number: sections.length + 1,
        title: 'Information Delivery Planning',
        subsections: []
      };

      if (tidpData.length > 0) {
        tidpSection.subsections.push({ number: '', title: 'Task Information Delivery Plans (TIDPs)' });
      }
      if (midpData.length > 0) {
        tidpSection.subsections.push({ number: '', title: 'Master Information Delivery Plan (MIDP)' });
      }

      sections.push(tidpSection);
    }

    return sections;
  }

  /**
   * Render Table of Contents
   * @param {Array} sections - Array of section objects
   * @returns {string} TOC HTML
   */
  renderTableOfContents(sections) {
    if (!sections || sections.length === 0) return '';

    let html = `
      <div class="toc">
        <h2 class="toc-title">Table of Contents</h2>
        <ul class="toc-list">
    `;

    sections.forEach((section) => {
      const sectionId = this.generateSectionId(section.number, section.title);

      html += `
        <li class="toc-item">
          <a href="#${sectionId}" class="toc-link">
            <span class="toc-item-number">${section.number}.</span>
            <span class="toc-item-title">${this.escapeHtml(section.title)}</span>
            <span class="toc-item-dots"></span>
          </a>
        </li>
      `;

      // Add subsections
      section.subsections.forEach(sub => {
        const subId = this.generateSectionId(sub.number, sub.title);

        html += `
          <li class="toc-item toc-item-subsection">
            <a href="#${subId}" class="toc-link">
              <span class="toc-item-number">${sub.number}</span>
              <span class="toc-item-title">${this.escapeHtml(sub.title)}</span>
              <span class="toc-item-dots"></span>
            </a>
          </li>
        `;
      });
    });

    html += `
        </ul>
      </div>
    `;

    return html;
  }

  /**
   * Generate a unique ID for a section or subsection
   * @param {string|number} number - Section number
   * @param {string} title - Section title
   * @returns {string} Unique section ID
   */
  generateSectionId(number, title) {
    // Create a safe ID from number and title
    const safeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return number ? `section-${number}-${safeTitle}` : `section-${safeTitle}`;
  }

  /**
   * Render BEP content body
   * @param {Object} formData - Form data
   * @param {string} bepType - BEP type
   * @param {Array} tidpData - TIDP data
   * @param {Array} midpData - MIDP data
   * @param {Object} componentImages - Component images map
   * @param {Array} sections - Collected sections for TOC
   * @param {Object} options - Render options
   * @returns {string} Complete body HTML
   */
  renderBEPContent(formData, bepType, tidpData, midpData, componentImages, sections, options = {}) {
    const { includeToc } = options;
    const bepConfig = getConfig().bepTypeDefinitions?.[bepType] || getConfig().bepTypeDefinitions['pre-appointment'];

    let html = '<div class="container">';

    // Cover page
    const snippetMap = options.snippetMap || {};
    html += this.renderCoverPage(formData, bepType, bepConfig);

    // Section 0 — Document History & Governance (ISO 19650)
    if (formData.documentHistory) {
      html += this.renderDocumentHistorySection(formData.documentHistory);
    }

    // Table of Contents
    if (includeToc && sections.length > 0) {
      html += this.renderTableOfContents(sections);
    }

    // Content sections
    html += this.renderContentSections(formData, bepType, componentImages, snippetMap);

    // TIDP/MIDP sections
    if (tidpData.length > 0 || midpData.length > 0) {
      html += this.renderTIDPMIDPSections(tidpData, midpData);
    }

    html += '</div>';

    return html;
  }

  /**
   * Render Section 0 — Document History & Governance (ISO 19650)
   * Placed immediately after the cover page, before the TOC.
   * @param {Object} dh - documentHistory object
   * @returns {string} Section 0 HTML
   */
  renderDocumentHistorySection(dh) {
    if (!dh) return '';
    const e = s => this.escapeHtml(String(s ?? ''));

    const tableStyle = 'width:100%;border-collapse:collapse;margin-bottom:16px;font-size:9pt;';
    const thStyle    = 'background:#f3f4f6;border:1px solid #d1d5db;padding:6px 8px;text-align:left;font-weight:600;';
    const tdStyle    = 'border:1px solid #d1d5db;padding:5px 8px;vertical-align:top;';

    // 0.1 Revision History
    const revRows = (dh.revisions || []).map(r => `
      <tr>
        <td style="${tdStyle}">${e(r.revisionCode)}</td>
        <td style="${tdStyle}">${e(r.date)}</td>
        <td style="${tdStyle}">${e(r.statusCode)} — ${e(r.statusLabel)}</td>
        <td style="${tdStyle}">${e(r.author)}</td>
        <td style="${tdStyle}">${e(r.checkedBy)}</td>
        <td style="${tdStyle}">${e(r.description)}</td>
      </tr>`).join('');
    const revTable = `
      <table style="${tableStyle}">
        <thead><tr>
          <th style="${thStyle}">Rev.</th>
          <th style="${thStyle}">Date</th>
          <th style="${thStyle}">Status</th>
          <th style="${thStyle}">Author</th>
          <th style="${thStyle}">Checked By</th>
          <th style="${thStyle}">Description of Change</th>
        </tr></thead>
        <tbody>${revRows || '<tr><td colspan="6" style="' + tdStyle + '">—</td></tr>'}</tbody>
      </table>`;

    // 0.2 Contributors
    const contRows = (dh.contributors || []).map(c => `
      <tr>
        <td style="${tdStyle}">${e(c.name)}</td>
        <td style="${tdStyle}">${e(c.company)}</td>
        <td style="${tdStyle}">${e(c.role)}</td>
      </tr>`).join('');
    const contTable = contRows ? `
      <table style="${tableStyle}">
        <thead><tr>
          <th style="${thStyle}">Name</th>
          <th style="${thStyle}">Company</th>
          <th style="${thStyle}">Role</th>
        </tr></thead>
        <tbody>${contRows}</tbody>
      </table>` : '<p style="color:#6b7280;font-size:9pt;">No contributors listed.</p>';

    // 0.3 Governance Triggers
    const trigRows = (dh.governanceTriggers || []).map(t => `
      <tr>
        <td style="${tdStyle}">${e(t.trigger)}</td>
        <td style="${tdStyle}">${e(t.accountableParty)}</td>
      </tr>`).join('');
    const trigTable = trigRows ? `
      <table style="${tableStyle}">
        <thead><tr>
          <th style="${thStyle}">Trigger Event</th>
          <th style="${thStyle}">Accountable Party</th>
        </tr></thead>
        <tbody>${trigRows}</tbody>
      </table>` : '';

    // 0.4 RACI Review Record
    const raciRows = (dh.raciReviewRecord || []).map(r => `
      <tr>
        <td style="${tdStyle}">${e(r.function)}</td>
        <td style="${tdStyle}">${e(r.individual)}</td>
        <td style="${tdStyle};text-align:center;font-weight:700;">${e(r.raci)}</td>
        <td style="${tdStyle}">${e(r.date)}</td>
        <td style="${tdStyle}">${e(r.comments)}</td>
      </tr>`).join('');
    const raciTable = raciRows ? `
      <table style="${tableStyle}">
        <thead><tr>
          <th style="${thStyle}">Function / Role</th>
          <th style="${thStyle}">Individual</th>
          <th style="${thStyle}">RACI</th>
          <th style="${thStyle}">Date</th>
          <th style="${thStyle}">Comments</th>
        </tr></thead>
        <tbody>${raciRows}</tbody>
      </table>` : '<p style="color:#6b7280;font-size:9pt;">No reviewers listed.</p>';

    const docNumber = dh.documentNumber ? `<span style="font-size:9pt;color:#6b7280;margin-left:8px;">${e(dh.documentNumber)}</span>` : '';

    return `
      <div class="section" style="page-break-before:always;">
        <div class="section-header">
          <h2 class="section-title" id="section-0">0. Document History &amp; Governance${docNumber}</h2>
        </div>
        <div class="section-content">
          <h3 style="font-size:10pt;font-weight:600;margin:16px 0 6px;">0.1 &mdash; Revision History</h3>
          ${revTable}
          <h3 style="font-size:10pt;font-weight:600;margin:16px 0 6px;">0.2 &mdash; Contributors</h3>
          ${contTable}
          <h3 style="font-size:10pt;font-weight:600;margin:16px 0 6px;">0.3 &mdash; Governance Triggers <small style="font-weight:400;color:#6b7280;">(ISO 19650-2 §5.1.3)</small></h3>
          ${trigTable}
          <h3 style="font-size:10pt;font-weight:600;margin:16px 0 6px;">0.4 &mdash; RACI Review Record</h3>
          ${raciTable}
        </div>
      </div>`;
  }

  /**
   * Render cover page
   * @param {Object} formData - Form data
   * @param {string} bepType - BEP type
   * @param {Object} bepConfig - BEP configuration
   * @returns {string} Cover page HTML
   */
  renderCoverPage(formData, bepType, bepConfig) {
    const projectName = this.escapeHtml(formData.projectName || 'Not specified');
    const projectNumber = this.escapeHtml(formData.projectNumber || 'Not specified');
    const bepTitle = this.escapeHtml(bepConfig.title || bepType);
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    return `
      <div class="cover-page">
        <h1 class="cover-title">BIM EXECUTION PLAN</h1>
        <p class="cover-subtitle">${bepTitle}</p>
        <p class="cover-iso">ISO 19650-2:2018 Compliant</p>
        <div class="cover-info">
          <p class="cover-info-item"><strong>Project:</strong> ${projectName}</p>
          <p class="cover-info-item"><strong>Project Number:</strong> ${projectNumber}</p>
          <p class="cover-info-date">Generated: ${dateStr} ${timeStr}</p>
        </div>
      </div>
    `;
  }

  /**
   * Render content sections
   * @param {Object} formData - Form data
   * @param {string} bepType - BEP type
   * @param {Object} componentImages - Component images map
   * @returns {string} Content sections HTML
   */
  renderContentSections(formData, bepType, componentImages, snippetMap = {}) {
    let html = '';
    const steps = getConfig().steps || [];

    steps.forEach((step, stepIndex) => {
      const stepConfig = this.getFormFields(bepType, stepIndex);
      if (!stepConfig || !stepConfig.fields) return;

      // Check if section has any content
      const hasContent = stepConfig.fields.some(field => {
        if (field.type === 'section-header') return false;
        return this.hasRenderableValue(field, formData[field.name]);
      });

      if (!hasContent) return;

      // Section header with ID for TOC linking
      const sectionId = this.generateSectionId(stepConfig.number, stepConfig.title);

      html += `
        <div class="section">
          <div class="section-header">
            <h2 class="section-title" id="${sectionId}">${stepConfig.number}. ${this.escapeHtml(stepConfig.title)}</h2>
          </div>
          <div class="section-content">
      `;

      // Section fields
      stepConfig.fields.forEach(field => {
        const value = formData[field.name];
        const isDisplayOnly = field.type === 'static-diagram' || field.type === 'info-banner' || field.type === 'section-header';
        if (!isDisplayOnly && !this.hasRenderableValue(field, value)) return;

        const resolvedLabel = snippetService.resolveInText(field.label, snippetMap);

        if (field.type === 'section-header') {
          const fieldId = field.number ? this.generateSectionId(field.number, resolvedLabel) : '';
          html += `
          <div class="field-group subsection-header">
            <h3 class="field-label"${fieldId ? ` id="${fieldId}"` : ''}>${field.number ? field.number + ' ' : ''}${this.escapeHtml(resolvedLabel)}</h3>
          </div>
          `;
          return;
        }

        // Generate ID for subsection (if it has a number)
        const fieldId = field.number ? this.generateSectionId(field.number, resolvedLabel) : '';

        html += `
          <div class="field-group">
            <h3 class="field-label"${fieldId ? ` id="${fieldId}"` : ''}>${field.number ? field.number + ' ' : ''}${this.escapeHtml(resolvedLabel)}</h3>
            ${this.renderFieldValue(field, value, componentImages, snippetMap)}
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    return html;
  }

  /**
   * Render field value based on type
   * @param {Object} field - Field configuration
   * @param {*} value - Field value
   * @param {Object} componentImages - Component images map
   * @returns {string} Field value HTML
   */
  renderFieldValue(field, value, componentImages, snippetMap = {}) {
    // Display-only: info-banner (styled callout)
    if (field.type === 'info-banner') {
      const label = snippetService.resolveInText(field.label || '', snippetMap).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      return `
        <div class="export-info-banner" style="border: 1px solid #93c5fd; background: #eff6ff; padding: 0.75rem 1rem; border-radius: 0.5rem; margin: 0.5rem 0; font-size: 0.875rem; color: #1e3a5f;">
          ${label}
        </div>
      `;
    }

    // Display-only: static-diagram (document hierarchy, party interface, or LOIN progression)
    if (field.type === 'static-diagram') {
      const diagramKey = field.diagramKey || (field.config && field.config.diagramKey) || 'documentHierarchy';
      if (diagramKey === 'partyInterface') return this.renderPartyInterfaceDiagramHtml();
      if (diagramKey === 'loinProgression') return this.renderLoinProgressionDiagramHtml();
      return this.renderDocumentHierarchyDiagramHtml();
    }

    // Special handling for naming-conventions - render as HTML instead of screenshot
    // Check both field.type and field.name for robustness (in case CONFIG doesn't load)
    if (field.type === 'naming-conventions' || field.name === 'namingConventions') {
      console.log(`   📝 Rendering naming conventions as HTML (type: ${field.type}, name: ${field.name})`);
      return this.renderNamingConventions(value);
    }

    // Federation strategy - render as structured HTML (benchmark Section 5)
    if (field.type === 'federation-strategy' || field.name === 'federationStrategy') {
      return this.renderFederationStrategy(value);
    }

    // Custom visual components - use embedded screenshots
    const visualComponentTypes = ['orgchart', 'orgstructure-data-table', 'cdeDiagram', 'mindmap', 'fileStructure'];

    if (visualComponentTypes.includes(field.type)) {
      return this.renderComponentImage(field.name, componentImages);
    }

    // Standard field types
    switch (field.type) {
      case 'table':
        return this.renderTable(field, value);

      case 'milestones-table':
        return this.renderMilestonesTable(field, value);

      case 'checkbox':
        return this.renderCheckboxList(value);

      case 'textarea':
        return this.renderTextarea(value, snippetMap);

      case 'introTable':
        return this.renderIntroTable(field, value, snippetMap);

      default:
        return this.renderSimpleField(value, snippetMap);
    }
  }

  /**
   * Determine whether a field has a value that should render in the PDF
   * @param {Object} field - Field configuration
   * @param {*} value - Field value
   * @returns {boolean} True when value should be rendered
   */
  hasRenderableValue(field, value) {
    // Display-only fields are always included in export
    if (field?.type === 'static-diagram' || field?.type === 'info-banner' || field?.type === 'section-header') return true;

    if (value === null || value === undefined) return false;

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return false;

      if (field?.type === 'textarea' && this.isLikelyHtml(trimmed)) {
        return this.hasMeaningfulHtmlContent(trimmed);
      }

      return true;
    }

    if (typeof value === 'number') {
      return !Number.isNaN(value);
    }

    if (typeof value === 'boolean') {
      return true;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'object') {
      if (field?.type === 'table') {
        const rows = value?.data;
        if (Array.isArray(rows)) return rows.length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return false;
      }

      // Special handling for naming conventions - check if it has data
      if (field?.type === 'naming-conventions' || field?.name === 'namingConventions') {
        return value.namingFields?.length > 0 || value.deliverableAttributes?.length > 0 || value.overview;
      }

      return Object.keys(value).length > 0;
    }

    return Boolean(value);
  }

  /**
   * Render Document Hierarchy diagram as HTML (ISO 19650: 3 columns, 2 rows).
   * Column 1: Interested parties' info requirements (OIR, PIR). Column 2: Appointment info requirements (AIR, EIR). Column 3: Information deliverables (AIM, PIM). Relationship labels: contributes to, encapsulates, specifies.
   * @returns {string} HTML string
   */
  renderDocumentHierarchyDiagramHtml() {
    const box = 'border:2px solid #334155;background:#fff;border-radius:0.375rem;padding:0.4rem 0.6rem;font-size:0.8rem;font-weight:600;color:#0f172a;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,0.05);';
    return `
      <div class="static-diagram document-hierarchy" style="border:1px solid #e2e8f0;background:#fff;padding:1rem;border-radius:0.5rem;margin:0.5rem 0;">
        <div style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:0;max-width:580px;margin:0 auto;">
          <div style="display:flex;flex-direction:column;gap:0.4rem;background:#bae6fd;border:1px solid #7dd3fc;border-radius:0.5rem 0 0 0.5rem;padding:0.6rem;">
            <p style="font-size:0.6rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#0c4a6e;text-align:center;margin:0 0 0.2rem 0;">Interested parties' information requirements</p>
            <div style="${box}">Organizational Information Requirements (OIR)</div>
            <div style="text-align:center;"><span style="color:#64748b;font-size:0.9rem;">↓</span><br/><span style="font-size:0.6rem;font-weight:500;color:#475569;">contributes to</span></div>
            <div style="${box}">Project Information Requirements (PIR)</div>
          </div>
          <div style="display:flex;flex-direction:column;justify-content:space-around;align-items:center;padding:0 0.4rem;background:#f8fafc;min-height:160px;">
            <div style="text-align:center;"><span style="font-size:0.6rem;font-weight:500;color:#475569;">encapsulates</span><br/><span style="color:#94a3b8;font-size:1rem;">→</span></div>
            <div style="text-align:center;"><span style="font-size:0.6rem;font-weight:500;color:#475569;">contributes to</span><br/><span style="color:#94a3b8;font-size:1rem;">→</span></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.4rem;background:#7dd3fc;border:1px solid #38bdf8;padding:0.6rem;">
            <p style="font-size:0.6rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#0c4a6e;text-align:center;margin:0 0 0.2rem 0;">Appointment information requirements</p>
            <div style="${box}">Asset Information Requirements (AIR)</div>
            <div style="text-align:center;"><span style="color:#64748b;font-size:0.9rem;">↓</span><br/><span style="font-size:0.6rem;font-weight:500;color:#475569;">contributes to</span></div>
            <div style="${box}">Exchange Information Requirements (EIR)</div>
          </div>
          <div style="display:flex;flex-direction:column;justify-content:space-around;align-items:center;padding:0 0.4rem;background:#f8fafc;min-height:160px;">
            <div style="text-align:center;"><span style="font-size:0.6rem;font-weight:500;color:#475569;">specifies</span><br/><span style="color:#94a3b8;font-size:1rem;">→</span></div>
            <div style="text-align:center;"><span style="font-size:0.6rem;font-weight:500;color:#475569;">specifies</span><br/><span style="color:#94a3b8;font-size:1rem;">→</span></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.4rem;background:#0ea5e9;border:1px solid #0284c7;border-radius:0 0.5rem 0.5rem 0;padding:0.6rem;">
            <p style="font-size:0.6rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#fff;text-align:center;margin:0 0 0.2rem 0;">Information deliverables</p>
            <div style="${box}">Asset Information Model (AIM)</div>
            <div style="text-align:center;"><span style="color:#64748b;font-size:0.9rem;">↑</span><br/><span style="font-size:0.6rem;font-weight:500;color:#475569;">contributes to</span></div>
            <div style="${box}">Project Information Model (PIM)</div>
          </div>
        </div>
        <p style="margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid #e2e8f0;font-size:0.65rem;color:#64748b;">OIR contributes to PIR; OIR encapsulates AIR; AIR and PIR contribute to EIR; EIR specifies PIM; AIR specifies AIM; PIM contributes to AIM.</p>
      </div>
    `;
  }

  /**
   * Render Party Interface diagram as HTML (Appointing Party ↔ LAP ↔ Task Teams, IPDT note)
   * @returns {string} HTML string
   */
  renderPartyInterfaceDiagramHtml() {
    return `
      <div class="static-diagram party-interface" style="border:1px solid #e2e8f0;background:#f8fafc;padding:1rem;border-radius:0.5rem;margin:0.5rem 0;">
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.75rem;">
          <span style="padding:0.5rem 1rem;border-radius:0.375rem;background:#f1f5f9;border:1px solid #e2e8f0;font-size:0.875rem;font-weight:500;">Appointing Party</span>
          <span style="color:#94a3b8;">↔</span>
          <span style="padding:0.5rem 1rem;border-radius:0.375rem;background:#f1f5f9;border:1px solid #e2e8f0;font-size:0.875rem;font-weight:500;">Lead Appointed Party (LAP)</span>
          <span style="color:#94a3b8;">↔</span>
          <span style="padding:0.5rem 1rem;border-radius:0.375rem;background:#f1f5f9;border:1px solid #e2e8f0;font-size:0.875rem;font-weight:500;">Task Teams</span>
        </div>
        <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px dashed #e2e8f0;text-align:center;">
          <span style="font-size:0.75rem;font-weight:500;color:#64748b;text-transform:uppercase;">IPDT (Integrated Project Delivery Team) spans all parties</span>
        </div>
        <p style="margin-top:0.5rem;font-size:0.75rem;color:#64748b;">ISO 19650-2:2018 — Interfaces between Appointing Party, Lead Appointed Party and Task Teams</p>
      </div>
    `;
  }

  /**
   * Render LOIN progression diagram as HTML (Concept → Design → Coordination → Construction → As-built)
   * @returns {string} HTML string
   */
  renderLoinProgressionDiagramHtml() {
    const box = 'border:1px solid #475569;background:#fff;border-radius:0.25rem;padding:0.25rem 0.5rem;font-size:0.8rem;font-weight:500;color:#0f172a;text-align:center;';
    return `
      <div class="static-diagram loin-progression" style="border:1px solid #e2e8f0;background:#fff;padding:1rem;border-radius:0.5rem;margin:0.5rem 0;">
        <p style="font-size:0.6rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#64748b;margin-bottom:0.75rem;text-align:center;">Typical LOIN / LOD progression by project stage</p>
        <div style="display:flex;flex-wrap:wrap;align-items:stretch;justify-content:center;gap:0.5rem;">
          <div style="flex:0 0 auto;border:1px solid #fcd34d;background:#fef3c7;padding:0.5rem;border-radius:0.5rem;min-width:70px;text-align:center;">
            <span style="font-size:0.6rem;font-weight:600;color:#92400e;">CONCEPT</span><br/><div style="${box}">LOD 200</div><span style="font-size:0.6rem;color:#b45309;">Approximate</span>
          </div>
          <span style="display:flex;align-items:center;color:#94a3b8;">→</span>
          <div style="flex:0 0 auto;border:1px solid #93c5fd;background:#dbeafe;padding:0.5rem;border-radius:0.5rem;min-width:70px;text-align:center;">
            <span style="font-size:0.6rem;font-weight:600;color:#1e40af;">DESIGN</span><br/><div style="${box}">LOD 300</div><span style="font-size:0.6rem;color:#1d4ed8;">Defined</span>
          </div>
          <span style="display:flex;align-items:center;color:#94a3b8;">→</span>
          <div style="flex:0 0 auto;border:1px solid #a5b4fc;background:#e0e7ff;padding:0.5rem;border-radius:0.5rem;min-width:70px;text-align:center;">
            <span style="font-size:0.6rem;font-weight:600;color:#3730a3;">COORDINATION</span><br/><div style="${box}">LOD 350</div><span style="font-size:0.6rem;color:#4f46e5;">Coordinated</span>
          </div>
          <span style="display:flex;align-items:center;color:#94a3b8;">→</span>
          <div style="flex:0 0 auto;border:1px solid #6ee7b7;background:#d1fae5;padding:0.5rem;border-radius:0.5rem;min-width:70px;text-align:center;">
            <span style="font-size:0.6rem;font-weight:600;color:#065f46;">CONSTRUCTION</span><br/><div style="${box}">LOD 400</div><span style="font-size:0.6rem;color:#047857;">Fabrication</span>
          </div>
          <span style="display:flex;align-items:center;color:#94a3b8;">→</span>
          <div style="flex:0 0 auto;border:1px solid #e2e8f0;background:#f1f5f9;padding:0.5rem;border-radius:0.5rem;min-width:70px;text-align:center;">
            <span style="font-size:0.6rem;font-weight:600;color:#475569;">AS-BUILT</span><br/><div style="${box}">LOD 500</div><span style="font-size:0.6rem;color:#64748b;">Verified</span>
          </div>
        </div>
        <p style="margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid #e2e8f0;font-size:0.65rem;color:#64748b;">Specify exact requirements per element and stage in the Level of Information Need Matrix table.</p>
      </div>
    `;
  }

  /**
   * Render component screenshot image
   * @param {string} fieldName - Field name
   * @param {Object} componentImages - Component images map
   * @returns {string} Component image HTML
   */
  renderComponentImage(fieldName, componentImages) {
    const imageData = componentImages[fieldName];
    if (!imageData) {
      return `<div class="component-placeholder">Visual component not available</div>`;
    }

    return `
      <div class="component-image">
        <img src="${imageData}" alt="${this.escapeHtml(fieldName)}" />
      </div>
    `;
  }

  /**
   * Render table with improved column handling
   * @param {Object} field - Field configuration
   * @param {Array|{ columns?: string[], data: Array }} rows - Table rows (array or EditableTable shape { columns, data })
   * @returns {string} Table HTML
   */
  renderTable(field, rows) {
    const normalized = Array.isArray(rows)
      ? { columns: field.columns || [], data: rows }
      : (rows?.data != null ? { columns: rows.columns || field.columns || [], data: rows.data } : { columns: field.columns || [], data: [] });
    const data = Array.isArray(normalized.data) ? normalized.data : [];
    const columns = normalized.columns.length ? normalized.columns : (field.columns || []);

    if (data.length === 0) return '';

    const effectiveField = { ...field, columns };
    const columnCount = columns.length;

    // Calculate column widths based on count
    const columnWidth = columnCount > 0 ? Math.floor(100 / columnCount) : 100;

    let html = '<div class="table-wrapper"><table class="data-table"><thead><tr>';

    columns.forEach((col, idx) => {
      const width = effectiveField.columnWidths?.[idx] || `${columnWidth}%`;
      html += `<th style="width: ${width}">${this.escapeHtml(col)}</th>`;
    });

    html += '</tr></thead><tbody>';

    data.forEach(row => {
      html += '<tr>';
      columns.forEach(col => {
        const cellValue = row[col];
        html += `<td>${this.escapeHtml(cellValue || '-')}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table></div>';

    return html;
  }

  renderMilestonesTable(field, rows) {
    if (!Array.isArray(rows) || rows.length === 0) return '';

    const columns = Array.isArray(field.columns) && field.columns.length > 0
      ? field.columns
      : ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date'];

    const normalizedRows = rows.map((row) => this.normalizeMilestoneRow(row));

    return this.renderTable({ ...field, columns }, normalizedRows);
  }

  normalizeMilestoneRow(row) {
    if (!row || typeof row !== 'object') {
      return {
        'Stage/Phase': '',
        'Milestone Description': '',
        Deliverables: '',
        'Due Date': '',
        'Gate': '',
        'Programme version': ''
      };
    }

    const getFirstValue = (keys) => {
      for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
          return row[key];
        }
      }
      return '';
    };

    return {
      'Stage/Phase': getFirstValue(['Stage/Phase', 'Stage', 'Phase', 'stage', 'phase']),
      'Milestone Description': getFirstValue(['Milestone Description', 'milestoneDescription', 'Description', 'description']),
      Deliverables: getFirstValue(['Deliverables', 'deliverables']),
      'Due Date': getFirstValue(['Due Date', 'dueDate', 'Date', 'date']),
      'Gate': getFirstValue(['Gate', 'gate']),
      'Programme version': getFirstValue(['Programme version', 'programmeVersion', 'programmeVersion'])
    };
  }

  /**
   * Render checkbox list
   * @param {Array} items - Checked items
   * @returns {string} Checkbox list HTML
   */
  renderCheckboxList(items) {
    if (!Array.isArray(items) || items.length === 0) return '';

    let html = '<ul class="checkbox-list">';

    items.forEach(item => {
      html += `<li class="checkbox-item"><span class="checkmark">✓</span> ${this.escapeHtml(item)}</li>`;
    });

    html += '</ul>';

    return html;
  }

  /**
   * Render textarea content
   * @param {string} value - Text content
   * @returns {string} Textarea HTML
   */
  renderTextarea(value, snippetMap = {}) {
    const raw = String(value ?? '');
    const text = snippetService.resolveInText(raw, snippetMap);

    if (this.isLikelyHtml(text)) {
      const sanitizedHtml = this.sanitizeRichTextHtml(text);
      return `<div class="textarea-content rich-text-content">${sanitizedHtml}</div>`;
    }

    return `<p class="textarea-content">${this.escapeHtml(text).replace(/\n/g, '<br>')}</p>`;
  }

  /**
   * Render introTable field (intro text + table)
   * @param {Object} field - Field configuration
   * @param {Object} value - Field value with intro and rows
   * @returns {string} IntroTable HTML
   */
  renderIntroTable(field, value, snippetMap = {}) {
    let html = '';

    if (value.intro) {
      const intro = snippetService.resolveInText(value.intro, snippetMap);
      html += `<p class="intro-text">${this.escapeHtml(intro).replace(/\n/g, '<br>')}</p>`;
    }

    if (value.rows && Array.isArray(value.rows) && value.rows.length > 0) {
      const columns = field.tableColumns || [];
      const columnCount = columns.length;
      const columnWidth = columnCount > 0 ? Math.floor(100 / columnCount) : 100;

      html += '<div class="table-wrapper"><table class="data-table"><thead><tr>';

      columns.forEach((col, idx) => {
        const width = field.columnWidths?.[idx] || `${columnWidth}%`;
        html += `<th style="width: ${width}">${this.escapeHtml(col)}</th>`;
      });

      html += '</tr></thead><tbody>';

      value.rows.forEach(row => {
        html += '<tr>';
        columns.forEach(col => {
          html += `<td>${this.escapeHtml(row[col] || '-')}</td>`;
        });
        html += '</tr>';
      });

      html += '</tbody></table></div>';
    }

    return html;
  }

  /**
   * Render simple field value
   * @param {*} value - Field value
   * @returns {string} Simple field HTML
   */
  renderSimpleField(value, snippetMap = {}) {
    const resolved = snippetService.resolveInText(String(value ?? ''), snippetMap);
    return `<p class="field-value">${this.escapeHtml(resolved)}</p>`;
  }

  /**
   * Render naming conventions section with structured HTML
   * @param {Object} value - Naming conventions data
   * @returns {string} Naming conventions HTML
   */
  renderNamingConventions(value) {
    if (!value || typeof value !== 'object') {
      return '<p class="field-value">No naming conventions defined</p>';
    }

    let html = '<div class="naming-conventions-section">';

    // 9.2.1 Overview
    if (value.overview) {
      html += `
        <div class="subsection">
          <h4 class="subsection-title">9.2.1 Overview</h4>
          <div class="rich-text-content">${value.overview}</div>
        </div>
      `;
    }

    // 9.2.2 Naming Convention Fields
    if (value.namingFields && Array.isArray(value.namingFields) && value.namingFields.length > 0) {
      html += `
        <div class="subsection">
          <h4 class="subsection-title">9.2.2 Naming Convention Fields</h4>
          <div class="table-wrapper">
            <table class="data-table naming-fields-table">
              <thead>
                <tr>
                  <th style="width: 5%">#</th>
                  <th style="width: 30%">Field Name</th>
                  <th style="width: 20%">Example Value</th>
                  <th style="width: 45%">Description</th>
                </tr>
              </thead>
              <tbody>
      `;

      value.namingFields.forEach((field, index) => {
        html += `
          <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td><code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px; color: #7c3aed;">${this.escapeHtml(field.fieldName || 'N/A')}</code></td>
            <td><code style="background: #f0fdf4; padding: 2px 6px; border-radius: 3px; color: #15803d;">${this.escapeHtml(field.exampleValue || 'N/A')}</code></td>
            <td>${this.escapeHtml(field.description || '')}</td>
          </tr>
        `;
      });

      html += `
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // 9.2.3 Naming Pattern & Example
    if (value.namingFields && value.namingFields.length > 0) {
      // Generate pattern from fields
      const pattern = value.namingFields.map(f => f.fieldName || '[Field]').join('-');
      const example = value.namingFields.map(f => f.exampleValue || 'XXX').join('-');

      html += `
        <div class="subsection">
          <h4 class="subsection-title">9.2.3 Naming Pattern & Example</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div style="border: 2px solid #a855f7; border-radius: 8px; padding: 12px; background: #faf5ff;">
              <div style="font-weight: 600; margin-bottom: 8px; color: #6b21a8;">Pattern</div>
              <code style="background: white; padding: 8px; border-radius: 4px; display: block; color: #7c3aed; font-size: 12px; word-break: break-all;">${this.escapeHtml(pattern)}</code>
            </div>
            <div style="border: 2px solid #22c55e; border-radius: 8px; padding: 12px; background: #f0fdf4;">
              <div style="font-weight: 600; margin-bottom: 8px; color: #15803d;">Example</div>
              <code style="background: white; padding: 8px; border-radius: 4px; display: block; color: #15803d; font-size: 12px; word-break: break-all;">${this.escapeHtml(example)}.rvt</code>
            </div>
          </div>
        </div>
      `;
    }

    // 9.2.4 Deliverable Attributes
    if (value.deliverableAttributes && Array.isArray(value.deliverableAttributes) && value.deliverableAttributes.length > 0) {
      html += `
        <div class="subsection">
          <h4 class="subsection-title">9.2.4 Deliverable Attributes</h4>
          <div class="table-wrapper">
            <table class="data-table deliverable-attrs-table">
              <thead>
                <tr>
                  <th style="width: 30%">Attribute Name</th>
                  <th style="width: 25%">Example Value</th>
                  <th style="width: 45%">Description</th>
                </tr>
              </thead>
              <tbody>
      `;

      value.deliverableAttributes.forEach((attr) => {
        html += `
          <tr>
            <td style="font-weight: 500;">${this.escapeHtml(attr.attributeName || 'N/A')}</td>
            <td><code style="background: #dbeafe; padding: 2px 6px; border-radius: 3px; color: #1e40af;">${this.escapeHtml(attr.exampleValue || 'N/A')}</code></td>
            <td>${this.escapeHtml(attr.description || '')}</td>
          </tr>
        `;
      });

      html += `
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  /**
   * Render federation strategy as structured HTML (benchmark Section 5)
   * @param {Object} value - federationStrategy object from form
   * @returns {string} Federation strategy HTML
   */
  renderFederationStrategy(value) {
    if (!value || typeof value !== 'object') {
      return '<p class="field-value">No federation strategy defined</p>';
    }

    const e = (s) => this.escapeHtml(String(s ?? ''));
    const subsection = (title, content) => content ? `<div class="subsection"><h4 class="subsection-title">${e(title)}</h4>${content}</div>` : '';
    const tableHtml = (field, rows) => {
      if (!rows?.data?.length) return '';
      return this.renderTable(field, rows);
    };

    let html = '<div class="federation-strategy-section">';

    // 5.1 Definition and purposes
    const def = value.definitionAndPurposes;
    if (def?.definition || (def?.purposes && def.purposes.length > 0)) {
      let block = '';
      if (def.definition) block += `<p>${e(def.definition)}</p>`;
      if (Array.isArray(def.purposes) && def.purposes.some((p) => p && String(p).trim())) {
        block += '<ul>';
        def.purposes.filter((p) => p && String(p).trim()).forEach((p) => { block += `<li>${e(p)}</li>`; });
        block += '</ul>';
      }
      if (block) html += subsection('5.1 Definition and Purposes of Federation', block);
    }

    // 9.7.1 Overview (rich text)
    if (value.overview) {
      const sanitized = this.isLikelyHtml(value.overview) ? this.sanitizeRichTextHtml(value.overview) : `<p>${e(value.overview)}</p>`;
      html += subsection('9.7.1 Federation Overview', `<div class="rich-text-content">${sanitized}</div>`);
    }

    // 5.1.1 Model Breakdown Structure
    const mbs = value.modelBreakdownStructure;
    if (mbs?.hierarchyLevels?.length || mbs?.principles) {
      let block = '';
      if (mbs.hierarchyLevels?.length) {
        block += '<p><strong>Hierarchy:</strong></p><ul>';
        mbs.hierarchyLevels.forEach((row) => { block += `<li>${e(row.level)}${row.description ? ` — ${e(row.description)}` : ''}</li>`; });
        block += '</ul>';
      }
      if (mbs.principles && (mbs.principles.uniclassAlignment || mbs.principles.maxFileSize || mbs.principles.ownership)) {
        block += '<p><strong>Principles:</strong></p><ul>';
        if (mbs.principles.uniclassAlignment) block += `<li>${e(mbs.principles.uniclassAlignment)}</li>`;
        if (mbs.principles.maxFileSize) block += `<li>${e(mbs.principles.maxFileSize)}</li>`;
        if (mbs.principles.ownership) block += `<li>${e(mbs.principles.ownership)}</li>`;
        block += '</ul>';
      }
      if (block) html += subsection('5.1.1 Model Breakdown Structure', block);
    }

    // 5.1.2 Model Register
    if (value.modelRegister?.data?.length) {
      html += subsection('5.1.2 Federated Model Breakdown (Model Register)', tableHtml({ columns: value.modelRegister.columns || [] }, value.modelRegister));
    }

    // 5.1.3 Model Coordination Baseline
    const cb = value.coordinationBaseline;
    if (cb?.sharedLevelsGrids || (cb?.geolocationVerification?.length) || cb?.coordinateSystemRef) {
      let block = '';
      if (cb.sharedLevelsGrids) block += `<p>${e(cb.sharedLevelsGrids)}</p>`;
      if (Array.isArray(cb.geolocationVerification) && cb.geolocationVerification.some((v) => v && String(v).trim())) {
        block += '<p><strong>Geolocation verification:</strong></p><ul>';
        cb.geolocationVerification.filter((v) => v && String(v).trim()).forEach((v) => { block += `<li>${e(v)}</li>`; });
        block += '</ul>';
      }
      if (cb.coordinateSystemRef) block += `<p><strong>Coordinate system:</strong> ${e(cb.coordinateSystemRef)}</p>`;
      if (block) html += subsection('5.1.3 Model Coordination Baseline', block);
    }

    // 5.1.4 Model Federation Process
    if (value.federationResponsibility || value.singleFileFormat) {
      let block = '<p>';
      if (value.federationResponsibility) block += `Federation responsibility: ${e(value.federationResponsibility)}. `;
      if (value.singleFileFormat) block += `Single-file-per-federation format: ${e(value.singleFileFormat)}.`;
      block += '</p>';
      html += subsection('5.1.4 Model Federation Process', block);
    }

    // 5.1.5 Federation Process Steps
    const steps = value.federationProcessSteps;
    if (Array.isArray(steps) && steps.length > 0) {
      let block = '<ol>';
      steps.forEach((s, i) => {
        block += `<li><strong>${e(s.title || `Step ${i + 1}`)}</strong>${s.description ? ` — ${e(s.description)}` : ''}</li>`;
      });
      block += '</ol>';
      if (value.issueCreationRequirements?.length) {
        block += '<p><strong>Issue creation requirements:</strong></p><ul>';
        value.issueCreationRequirements.filter((r) => r && String(r).trim()).forEach((r) => { block += `<li>${e(r)}</li>`; });
        block += '</ul>';
      }
      if (value.ipmpReference) block += `<p><strong>IPMP cross-reference:</strong> ${e(value.ipmpReference)}</p>`;
      html += subsection('5.1.5 Federation Process Steps', block);
    }

    // 9.7.2 Clash matrix summary (disciplines + count of clashes)
    const cm = value.clashMatrix;
    if (cm?.disciplines?.length && cm?.clashes?.length) {
      let block = `<p>Disciplines: ${e((cm.disciplines || []).join(', '))}. Clash pairs defined: ${(cm.clashes || []).length}.</p>`;
      html += subsection('9.7.2 Clash Detection Matrix', block);
    }

    // 9.7.3 Configuration
    const config = value.configuration;
    if (config) {
      let block = '<p>';
      if (config.approach) block += `Approach: ${e(config.approach)}. `;
      if (config.frequency) block += `Frequency: ${e(config.frequency)}. `;
      if (config.tools?.length) block += `Tools: ${e(config.tools.join(', '))}. `;
      if (config.modelBreakdown?.length) block += `Model breakdown: ${e(config.modelBreakdown.join(', '))}.`;
      block += '</p>';
      html += subsection('9.7.3 Federation Configuration', block);
    }

    // 9.7.4 Coordination Procedures (rich text)
    if (value.coordinationProcedures) {
      const sanitized = this.isLikelyHtml(value.coordinationProcedures) ? this.sanitizeRichTextHtml(value.coordinationProcedures) : `<p>${e(value.coordinationProcedures)}</p>`;
      html += subsection('9.7.4 Coordination Procedures', `<div class="rich-text-content">${sanitized}</div>`);
    }

    // Federation Schedule
    if (value.federationSchedule?.data?.length) {
      html += subsection('Federation Schedule', tableHtml({ columns: value.federationSchedule.columns || [] }, value.federationSchedule));
    }

    // Coordination by Stage
    if (value.coordinationByStage?.data?.length) {
      html += subsection('Coordination by Project Stage', tableHtml({ columns: value.coordinationByStage.columns || [] }, value.coordinationByStage));
    }

    // Clash Detection Responsibilities
    if (value.clashResponsibilities?.data?.length) {
      html += subsection('Clash Detection Responsibilities', tableHtml({ columns: value.clashResponsibilities.columns || [] }, value.clashResponsibilities));
    }

    // Tiered rulesets
    const rulesets = value.clashRulesets;
    if (rulesets && (rulesets.categoryA?.length || rulesets.categoryB?.length || rulesets.categoryC?.length)) {
      let block = '';
      ['categoryA', 'categoryB', 'categoryC'].forEach((key) => {
        const arr = rulesets[key];
        const label = key === 'categoryA' ? 'Category A — Critical' : key === 'categoryB' ? 'Category B — Significant' : 'Category C — Minor';
        if (Array.isArray(arr) && arr.length > 0) {
          block += `<p><strong>${label}</strong></p><table class="data-table"><thead><tr><th>ID</th><th>Discipline pair</th><th>Description</th><th>Tolerance</th></tr></thead><tbody>`;
          arr.forEach((r) => {
            block += `<tr><td>${e(r.id)}</td><td>${e(r.disciplinePair)}</td><td>${e(r.description)}</td><td>${e(r.tolerance)}</td></tr>`;
          });
          block += '</tbody></table>';
        }
      });
      if (block) html += subsection('Clash Detection Rulesets by Severity', block);
    }

    html += '</div>';
    return html;
  }

  /**
   * Render TIDP/MIDP sections
   * @param {Array} tidpData - TIDP data
   * @param {Array} midpData - MIDP data
   * @returns {string} TIDP/MIDP sections HTML
   */
  renderTIDPMIDPSections(tidpData, midpData) {
    // Generate section ID
    const sectionNumber = 'information-delivery-planning';
    const sectionId = this.generateSectionId('', 'Information Delivery Planning');

    let html = `
      <div class="section">
        <div class="section-header tidp-header">
          <h2 class="section-title" id="${sectionId}">Information Delivery Planning</h2>
        </div>
        <div class="section-content">
    `;

    // TIDP table
    if (tidpData.length > 0) {
      const tidpId = this.generateSectionId('', 'Task Information Delivery Plans (TIDPs)');

      html += `
        <h3 class="subsection-title" id="${tidpId}">Task Information Delivery Plans (TIDPs)</h3>
        <div class="table-wrapper">
          <table class="data-table tidp-table">
            <thead>
              <tr>
                <th style="width: 30%">Task Team</th>
                <th style="width: 25%">Discipline</th>
                <th style="width: 25%">Team Leader</th>
                <th style="width: 20%">Reference</th>
              </tr>
            </thead>
            <tbody>
      `;

      tidpData.forEach((tidp, idx) => {
        const teamName = this.escapeHtml(tidp.teamName || tidp.taskTeam || `Task Team ${idx + 1}`);
        const discipline = this.escapeHtml(tidp.discipline || 'N/A');
        const leader = this.escapeHtml(tidp.leader || tidp.teamLeader || 'TBD');
        const ref = `TIDP-${String(idx + 1).padStart(2, '0')}`;

        html += `
          <tr>
            <td>${teamName}</td>
            <td>${discipline}</td>
            <td>${leader}</td>
            <td class="monospace">${ref}</td>
          </tr>
        `;
      });

      html += '</tbody></table></div>';
    }

    // MIDP table
    if (midpData.length > 0) {
      const midpId = this.generateSectionId('', 'Master Information Delivery Plan (MIDP)');

      html += `
        <h3 class="subsection-title" id="${midpId}">Master Information Delivery Plan (MIDP)</h3>
        <div class="table-wrapper">
          <table class="data-table midp-table">
            <thead>
              <tr>
                <th style="width: 40%">MIDP Reference</th>
                <th style="width: 30%">Version</th>
                <th style="width: 30%">Status</th>
              </tr>
            </thead>
            <tbody>
      `;

      midpData.forEach((midp, idx) => {
        const ref = `MIDP-${String(idx + 1).padStart(2, '0')}`;
        const version = this.escapeHtml(midp.version || '1.0');
        const status = this.escapeHtml(midp.status || 'Active');

        html += `
          <tr>
            <td class="monospace">${ref}</td>
            <td>${version}</td>
            <td>${status}</td>
          </tr>
        `;
      });

      html += '</tbody></table></div>';
    }

    html += '</div></div>';

    return html;
  }

  /**
   * Get form fields for step (mirrors frontend CONFIG.getFormFields)
   * @param {string} bepType - BEP type
   * @param {number} stepIndex - Step index
   * @returns {Object|null} Form fields configuration or null if not found
   */
  getFormFields(bepType, stepIndex) {
    try {
      const formFields = getConfig().formFields || {};
      const sharedFormFields = getConfig().sharedFormFields || {};
      const typeFields = formFields[bepType] || {};

      if (stepIndex <= 2 && typeFields[stepIndex]) {
        return typeFields[stepIndex];
      }

      if (stepIndex >= 3 && sharedFormFields[stepIndex]) {
        return sharedFormFields[stepIndex];
      }

      return null;
    } catch (error) {
      console.error('Error getting form fields:', error.message);
      return null;
    }
  }

  /**
   * Escape HTML to prevent XSS
   * @param {*} text - Text to escape
   * @returns {string} Escaped HTML string
   */
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

  stripHtmlTags(html) {
    return String(html || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  isLikelyHtml(value) {
    return typeof value === 'string' && /<\/?[a-z][\s\S]*>/i.test(value);
  }

  hasMeaningfulHtmlContent(html) {
    const plainText = this.stripHtmlTags(html);
    if (plainText.length > 0) return true;

    return /<img\b[^>]*src\s*=\s*['"][^'"]+['"][^>]*>/i.test(String(html || ''));
  }

  sanitizeRichTextHtml(html) {
    let sanitized = String(html || '');

    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^>]*>/gi, '')
      .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '')
      .replace(/\s(?:href|src)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, '')
      .replace(/\s(?:href|src)\s*=\s*("\s*vbscript:[^"]*"|'\s*vbscript:[^']*')/gi, '')
      .replace(/\s(?:href|src)\s*=\s*("\s*data:(?!image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,)[^"]*"|'\s*data:(?!image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,)[^']*')/gi, '');

    sanitized = sanitized.replace(
      /<\/?(?!p\b|br\b|strong\b|b\b|em\b|i\b|u\b|s\b|ul\b|ol\b|li\b|blockquote\b|h1\b|h2\b|h3\b|h4\b|h5\b|h6\b|table\b|thead\b|tbody\b|tr\b|th\b|td\b|a\b|img\b|code\b|pre\b|span\b)[^>]*>/gi,
      ''
    );

    return sanitized;
  }

  /**
   * Load CSS from external file with caching
   * @returns {string} CSS content
   */
  loadCSSFromFile() {
    if (this._cssCache) {
      return this._cssCache;
    }

    try {
      const cssPath = path.join(__dirname, 'templates', 'bepStyles.css');
      this._cssCache = fs.readFileSync(cssPath, 'utf8');
      return this._cssCache;
    } catch (error) {
      console.warn('⚠️  Could not load external CSS file, using inline fallback');
      console.warn(`   Reason: ${error.message}`);
      return this.getInlineCSSFallback();
    }
  }

  /**
   * Get inline CSS (loads from external file with fallback)
   * @returns {string} CSS content
   */
  getInlineCSS() {
    return this.loadCSSFromFile();
  }

  /**
   * Fallback inline CSS if external file fails to load
   * @returns {string} Fallback CSS content
   */
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
        color: #1f2937;
        background-color: #ffffff;
      }

      .container {
        max-width: 170mm;
        margin: 0 auto;
        background-color: #ffffff;
      }

      .cover-page {
        margin-bottom: 60px;
        padding: 60px 40px;
        background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
        color: #ffffff;
        border-radius: 12px;
        page-break-after: always;
      }

      .cover-title {
        font-size: 36pt;
        font-weight: 700;
        margin-bottom: 20px;
      }

      .cover-subtitle {
        font-size: 18pt;
        margin-bottom: 10px;
      }

      .cover-iso {
        font-size: 12pt;
        font-style: italic;
        opacity: 0.9;
        margin-bottom: 40px;
      }

      .cover-info {
        padding-top: 30px;
        border-top: 1px solid rgba(255, 255, 255, 0.3);
      }

      .cover-info-item {
        font-size: 14pt;
        margin-bottom: 8px;
      }

      .cover-info-date {
        font-size: 10pt;
        margin-top: 20px;
        opacity: 0.75;
      }

      .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 72pt;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.06);
        pointer-events: none;
        z-index: 1000;
        white-space: nowrap;
        text-transform: uppercase;
      }

      .toc {
        page-break-after: always;
        padding: 40px 0;
      }

      .toc-title {
        font-size: 24pt;
        font-weight: 700;
        color: #111827;
        margin-bottom: 30px;
        padding-bottom: 10px;
        border-bottom: 3px solid #2563eb;
      }

      .toc-list {
        list-style: none;
      }

      .toc-item {
        display: flex;
        align-items: baseline;
        margin-bottom: 12px;
        font-size: 12pt;
      }

      .toc-link {
        display: flex;
        align-items: baseline;
        width: 100%;
        text-decoration: none;
        color: inherit;
        transition: opacity 0.2s;
      }

      .toc-link:hover {
        opacity: 0.7;
      }

      .toc-item-number {
        font-weight: 600;
        color: #2563eb;
        min-width: 40px;
      }

      .toc-item-title {
        flex: 1;
        color: #1f2937;
      }

      .toc-item-dots {
        flex: 1;
        border-bottom: 1px dotted #d1d5db;
        margin: 0 8px;
        min-width: 20px;
      }

      .section {
        margin-bottom: 50px;
      }

      .section-header {
        margin-bottom: 30px;
        padding-bottom: 10px;
        border-bottom: 3px solid #2563eb;
        page-break-after: avoid;
        page-break-inside: avoid;
      }

      .section-title {
        font-size: 18pt;
        font-weight: 700;
        color: #111827;
      }

      .section-content {
        padding-left: 20px;
      }

      .field-group {
        margin-bottom: 30px;
        page-break-inside: auto;
      }

      .field-label {
        font-size: 13pt;
        font-weight: 600;
        color: #374151;
        margin-bottom: 10px;
        page-break-after: avoid;
      }

      .field-value {
        margin: 10px 0;
        color: #4b5563;
      }

      .table-wrapper {
        margin: 20px 0;
        overflow-x: visible;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #d1d5db;
        page-break-inside: auto;
        table-layout: fixed;
      }

      .data-table thead {
        display: table-header-group;
        background-color: #f3f4f6;
      }

      .data-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }

      .data-table th,
      .data-table td {
        padding: 10px 12px;
        text-align: left;
        border-bottom: 1px solid #d1d5db;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        vertical-align: top;
      }

      .data-table th {
        font-size: 9pt;
        font-weight: 600;
        color: #374151;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .data-table td {
        font-size: 10pt;
        color: #111827;
      }

      .component-image {
        margin: 30px 0;
        text-align: center;
        page-break-inside: avoid;
      }

      .component-image img {
        max-width: 100%;
        max-height: 200mm;
        width: auto;
        height: auto;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }

      .component-placeholder {
        padding: 60px 20px;
        background-color: #f3f4f6;
        border: 2px dashed #d1d5db;
        border-radius: 8px;
        text-align: center;
        color: #9ca3af;
        font-style: italic;
      }

      .checkbox-list {
        list-style: none;
        margin: 10px 0;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        color: #374151;
        margin-bottom: 5px;
      }

      .checkmark {
        color: #059669;
        margin-right: 8px;
        font-weight: bold;
      }

      .textarea-content,
      .intro-text {
        margin: 10px 0;
        color: #4b5563;
        white-space: pre-wrap;
      }

      .rich-text-content {
        line-height: 1.6;
      }

      .rich-text-content p {
        margin: 8px 0;
      }

      .rich-text-content img,
      .rich-text-content .tiptap-image {
        display: block;
        max-width: 100%;
        max-height: 180mm;
        width: auto;
        height: auto;
        margin: 12px 0;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
      }

      .rich-text-content table,
      table.tiptap-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #d1d5db;
        page-break-inside: auto;
        table-layout: fixed;
        margin: 20px 0;
      }
      .rich-text-content table thead,
      table.tiptap-table thead {
        display: table-header-group;
        background-color: #f3f4f6;
      }
      .rich-text-content table tr,
      table.tiptap-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      .rich-text-content table th,
      table.tiptap-table th {
        padding: 10px 12px;
        text-align: left;
        font-size: 9pt;
        font-weight: 600;
        color: #374151;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid #d1d5db;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
      }
      .rich-text-content table td,
      table.tiptap-table td {
        padding: 10px 12px;
        font-size: 10pt;
        color: #111827;
        border-bottom: 1px solid #e5e7eb;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        vertical-align: top;
      }

      .monospace {
        font-family: 'Courier New', Courier, monospace;
      }

      /* Naming Conventions Styles */
      .naming-conventions-section {
        margin: 20px 0;
      }

      .naming-conventions-section .subsection {
        margin-bottom: 30px;
        page-break-inside: avoid;
      }

      .naming-conventions-section .subsection-title {
        font-size: 14pt;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 12px;
      }

      .naming-conventions-section .rich-text-content {
        margin: 10px 0;
        color: #4b5563;
        line-height: 1.6;
      }

      .naming-conventions-section .rich-text-content p {
        margin: 8px 0;
      }

      .naming-conventions-section .rich-text-content strong {
        font-weight: 600;
        color: #111827;
      }

      .naming-fields-table,
      .deliverable-attrs-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 10pt;
      }

      .naming-fields-table thead th,
      .deliverable-attrs-table thead th {
        background-color: #f3f4f6;
        font-weight: 600;
        text-align: left;
        padding: 10px;
        border: 1px solid #d1d5db;
      }

      .naming-fields-table tbody td,
      .deliverable-attrs-table tbody td {
        padding: 8px 10px;
        border: 1px solid #e5e7eb;
      }

      .naming-fields-table tbody tr:nth-child(even),
      .deliverable-attrs-table tbody tr:nth-child(even) {
        background-color: #f9fafb;
      }

      @page {
        size: A4;
        margin: 25mm 20mm;
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .container {
          max-width: 100%;
        }

        .page-break {
          page-break-before: always;
        }

        .no-break {
          page-break-inside: avoid;
        }
      }
    `;
  }

  /**
   * Reload configuration from file
   * Useful for hot-reloading in development
   * @returns {Object} Config load result
   */
  async reloadConfig() {
    this._cssCache = null; // Clear CSS cache too
    return loadBepConfigAsync();
  }

  /**
   * Get current configuration status
   * @returns {Object} Status object with config details
   */
  getConfigStatus() {
    const { getConfig, lastLoadResult } = require('./loadBepConfig');
    const CONFIG = getConfig();
    return {
      hasSteps: (CONFIG.steps && CONFIG.steps.length) > 0,
      stepCount: (CONFIG.steps && CONFIG.steps.length) || 0,
      hasBepTypes: CONFIG.bepTypeDefinitions && Object.keys(CONFIG.bepTypeDefinitions).length > 0,
      bepTypes: CONFIG.bepTypeDefinitions ? Object.keys(CONFIG.bepTypeDefinitions) : [],
      hasFormFields: CONFIG.formFields && Object.keys(CONFIG.formFields).length > 0,
      initialLoadResult: lastLoadResult
    };
  }
}

module.exports = new HtmlTemplateService();
