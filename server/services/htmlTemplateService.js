const fs = require('fs');
const path = require('path');

/**
 * Default configuration structure
 * Used as fallback when bepConfig.js cannot be loaded
 * @type {Object}
 */
const DEFAULT_CONFIG = {
  bepTypeDefinitions: {
    'pre-appointment': {
      title: 'Pre-Appointment BEP',
      subtitle: 'Tender Phase Document',
      description: 'A document outlining the prospective delivery team\'s proposed approach, capability, and capacity.'
    },
    'post-appointment': {
      title: 'Post-Appointment BEP',
      subtitle: 'Project Execution Document',
      description: 'Confirms the delivery team\'s information management approach and includes detailed planning and schedules.'
    }
  },
  steps: [],
  formFields: {},
  sharedFormFields: {}
};

// Mutable config that gets populated
let CONFIG = { ...DEFAULT_CONFIG };

/**
 * Attempts to load the BEP configuration from the frontend config file
 * @returns {Object} Result object with success status and any error details
 */
function loadBepConfig() {
  const result = { success: false, error: null, configPath: null };

  try {
    const configPath = require.resolve('../../src/config/bepConfig.js');
    result.configPath = configPath;

    // Clear require cache to get fresh config
    delete require.cache[configPath];

    const loadedConfig = require('../../src/config/bepConfig');

    // Handle different export formats
    let configData = null;
    if (loadedConfig.default) {
      configData = loadedConfig.default;
    } else if (loadedConfig.CONFIG) {
      configData = loadedConfig.CONFIG;
    } else if (typeof loadedConfig === 'object' && loadedConfig !== null) {
      configData = loadedConfig;
    }

    if (!configData) {
      throw new Error('Config file loaded but no valid configuration object found');
    }

    // Validate essential properties
    if (!configData.bepTypeDefinitions) {
      console.warn('⚠️  Loaded config missing bepTypeDefinitions, using defaults');
      configData.bepTypeDefinitions = DEFAULT_CONFIG.bepTypeDefinitions;
    }

    if (!configData.steps || !Array.isArray(configData.steps)) {
      console.warn('⚠️  Loaded config missing steps array, using defaults');
      configData.steps = DEFAULT_CONFIG.steps;
    }

    if (!configData.formFields || typeof configData.formFields !== 'object') {
      console.warn('⚠️  Loaded config missing formFields, using defaults');
      configData.formFields = DEFAULT_CONFIG.formFields;
    }

    if (!configData.sharedFormFields || typeof configData.sharedFormFields !== 'object') {
      console.warn('⚠️  Loaded config missing sharedFormFields, using defaults');
      configData.sharedFormFields = DEFAULT_CONFIG.sharedFormFields;
    }

    CONFIG = { ...DEFAULT_CONFIG, ...configData };
    result.success = true;

  } catch (error) {
    result.error = {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    console.warn('⚠️  Could not load bepConfig.js, using default structure');
    console.warn(`   Reason: ${error.message}`);

    if (error.code === 'MODULE_NOT_FOUND') {
      console.warn('   Tip: Ensure the frontend config file exists at src/config/bepConfig.js');
    }

    CONFIG = { ...DEFAULT_CONFIG };
  }

  return result;
}

// Initial config load
const configLoadResult = loadBepConfig();
if (configLoadResult.success) {
  console.log('✓ BEP config loaded successfully');
}

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
    const css = this.getInlineCSS();
    const sections = this.collectSections(formData, bepType, tidpData, midpData);
    const bodyContent = this.renderBEPContent(formData, bepType, tidpData, midpData, componentImages, sections, { watermark, includeToc });

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
  collectSections(formData, bepType, tidpData, midpData) {
    const sections = [];
    const steps = CONFIG.steps || [];

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
            title: field.label
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
    const bepConfig = CONFIG.bepTypeDefinitions?.[bepType] || CONFIG.bepTypeDefinitions['pre-appointment'];

    let html = '<div class="container">';

    // Cover page
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
    html += this.renderContentSections(formData, bepType, componentImages);

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
  renderContentSections(formData, bepType, componentImages) {
    let html = '';
    const steps = CONFIG.steps || [];

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
        if (field.type === 'section-header') return;

        const value = formData[field.name];
        if (!this.hasRenderableValue(field, value)) return;

        // Generate ID for subsection (if it has a number)
        const fieldId = field.number ? this.generateSectionId(field.number, field.label) : '';

        html += `
          <div class="field-group">
            <h3 class="field-label"${fieldId ? ` id="${fieldId}"` : ''}>${field.number ? field.number + ' ' : ''}${this.escapeHtml(field.label)}</h3>
            ${this.renderFieldValue(field, value, componentImages)}
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
  renderFieldValue(field, value, componentImages) {
    // Special handling for naming-conventions - render as HTML instead of screenshot
    // Check both field.type and field.name for robustness (in case CONFIG doesn't load)
    if (field.type === 'naming-conventions' || field.name === 'namingConventions') {
      console.log(`   📝 Rendering naming conventions as HTML (type: ${field.type}, name: ${field.name})`);
      return this.renderNamingConventions(value);
    }

    // Custom visual components - use embedded screenshots
    const visualComponentTypes = ['orgchart', 'orgstructure-data-table', 'cdeDiagram', 'mindmap', 'fileStructure', 'federation-strategy'];

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
        return this.renderTextarea(value);

      case 'introTable':
        return this.renderIntroTable(field, value);

      default:
        return this.renderSimpleField(value);
    }
  }

  /**
   * Determine whether a field has a value that should render in the PDF
   * @param {Object} field - Field configuration
   * @param {*} value - Field value
   * @returns {boolean} True when value should be rendered
   */
  hasRenderableValue(field, value) {
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
        return Array.isArray(value) && value.length > 0;
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
   * @param {Array} rows - Table rows
   * @returns {string} Table HTML
   */
  renderTable(field, rows) {
    if (!Array.isArray(rows) || rows.length === 0) return '';

    const columns = field.columns || [];
    const columnCount = columns.length;

    // Calculate column widths based on count
    const columnWidth = columnCount > 0 ? Math.floor(100 / columnCount) : 100;

    let html = '<div class="table-wrapper"><table class="data-table"><thead><tr>';

    columns.forEach((col, idx) => {
      const width = field.columnWidths?.[idx] || `${columnWidth}%`;
      html += `<th style="width: ${width}">${this.escapeHtml(col)}</th>`;
    });

    html += '</tr></thead><tbody>';

    rows.forEach(row => {
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
        'Due Date': ''
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
      'Due Date': getFirstValue(['Due Date', 'dueDate', 'Date', 'date'])
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
  renderTextarea(value) {
    const text = String(value ?? '');

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
  renderIntroTable(field, value) {
    let html = '';

    if (value.intro) {
      html += `<p class="intro-text">${this.escapeHtml(value.intro).replace(/\n/g, '<br>')}</p>`;
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
  renderSimpleField(value) {
    return `<p class="field-value">${this.escapeHtml(String(value))}</p>`;
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
      const formFields = CONFIG.formFields || {};
      const sharedFormFields = CONFIG.sharedFormFields || {};
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
  reloadConfig() {
    this._cssCache = null; // Clear CSS cache too
    return loadBepConfig();
  }

  /**
   * Get current configuration status
   * @returns {Object} Status object with config details
   */
  getConfigStatus() {
    return {
      hasSteps: CONFIG.steps.length > 0,
      stepCount: CONFIG.steps.length,
      hasBepTypes: Object.keys(CONFIG.bepTypeDefinitions).length > 0,
      bepTypes: Object.keys(CONFIG.bepTypeDefinitions),
      hasFormFields: Object.keys(CONFIG.formFields).length > 0,
      initialLoadResult: configLoadResult
    };
  }
}

module.exports = new HtmlTemplateService();
