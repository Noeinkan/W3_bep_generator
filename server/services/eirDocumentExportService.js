/**
 * EIR Document Export — generates HTML for authored EIR documents (form data).
 * Used by POST /api/export/eir-document/pdf. Distinct from eirExportService (analysis PDF).
 */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const htmlTemplateService = require('./htmlTemplateService');

function escapeHtml(str) {
  if (str == null || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFieldValue(field, value) {
  if (value == null || value === '') return '';
  const type = field.type || '';

  if (type === 'section-header' || type === 'info-banner') return '';

  if (type === 'table' || type === 'introTable') {
    const rows = Array.isArray(value) ? value : (value?.table ? value.table : []);
    if (rows.length === 0) return '<p class="text-gray-500">—</p>';
    const columns = field.columns || (value?.columns) || (rows[0] ? Object.keys(rows[0]) : []);
    const headers = columns.map((col) => `<th>${escapeHtml(String(col))}</th>`).join('');
    const body = rows.map((row) => {
      const cells = columns.map((col) => `<td>${escapeHtml(String(row[col] ?? ''))}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table class="export-table"><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table>`;
  }

  if (type === 'milestones-table') {
    const rows = Array.isArray(value) ? value : [];
    if (rows.length === 0) return '<p class="text-gray-500">—</p>';
    const cols = field.columns || ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date', 'Gate', 'Notes'];
    const headers = cols.map((c) => `<th>${escapeHtml(String(c))}</th>`).join('');
    const body = rows.map((row) => {
      const cells = cols.map((c) => `<td>${escapeHtml(String(row[c] ?? ''))}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table class="export-table"><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table>`;
  }

  if (type === 'naming-conventions') {
    const obj = typeof value === 'object' && value !== null ? value : {};
    const parts = [];
    if (obj.overview) parts.push(`<p>${escapeHtml(obj.overview)}</p>`);
    if (Array.isArray(obj.namingFields) && obj.namingFields.length > 0) {
      parts.push('<table class="export-table"><thead><tr><th>Field</th><th>Pattern</th></tr></thead><tbody>');
      obj.namingFields.forEach((f) => {
        parts.push(`<tr><td>${escapeHtml(String(f?.field ?? ''))}</td><td>${escapeHtml(String(f?.pattern ?? ''))}</td></tr>`);
      });
      parts.push('</tbody></table>');
    }
    return parts.length ? parts.join('') : '<p class="text-gray-500">—</p>';
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    if (value.intro && Array.isArray(value.table)) {
      let out = `<p>${escapeHtml(value.intro)}</p>`;
      if (value.table.length > 0) {
        const cols = value.table[0] ? Object.keys(value.table[0]) : [];
        const headers = cols.map((c) => `<th>${escapeHtml(c)}</th>`).join('');
        const body = value.table.map((row) => {
          const cells = cols.map((c) => `<td>${escapeHtml(String(row[c] ?? ''))}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        out += `<table class="export-table"><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table>`;
      }
      return out;
    }
    return '<p class="text-gray-500">—</p>';
  }

  const text = String(value).trim();
  if (!text) return '';
  return `<p class="export-paragraph">${escapeHtml(text).replace(/\n/g, '<br>')}</p>`;
}

/**
 * Generate HTML for an EIR document (authored form data).
 * @param {Object} data - EIR form data (keyed by field name)
 * @param {string} [documentTitle] - Document title for the header
 * @returns {Promise<string>} Full HTML document
 */
async function generateEirDocumentHTML(data, documentTitle = 'Exchange Information Requirements') {
  let config;
  try {
    const configPath = path.join(__dirname, '../../src/config/eirConfigForServer.js');
    const fileUrl = pathToFileURL(configPath).href;
    const loaded = await import(fileUrl);
    config = loaded.default || loaded;
  } catch (err) {
    console.error('EIR document export: failed to load eirConfigForServer', err);
    throw new Error('EIR export config not available');
  }

  const steps = config.steps || [];
  const getFormFields = config.getFormFields;
  if (!getFormFields || typeof getFormFields !== 'function') {
    throw new Error('EIR config missing getFormFields');
  }

  const css = htmlTemplateService.getInlineCSS ? htmlTemplateService.getInlineCSS() : '';

  const sections = [];
  for (let i = 0; i < steps.length; i++) {
    const stepConfig = getFormFields(i);
    if (!stepConfig || !stepConfig.fields) continue;

    const stepTitle = stepConfig.title || steps[i]?.title || `Section ${i + 1}`;
    const stepNumber = stepConfig.number ?? steps[i]?.number ?? i + 1;

    let sectionHtml = `<div class="export-section"><h2 class="export-section-title">${stepNumber} ${escapeHtml(stepTitle)}</h2>`;

    for (const field of stepConfig.fields) {
      if (field.type === 'section-header') {
        sectionHtml += `<h3 class="export-subsection-title">${escapeHtml(field.label || '')}</h3>`;
        continue;
      }
      if (field.type === 'info-banner') {
        sectionHtml += `<div class="export-info-banner">${escapeHtml(field.label || '')}</div>`;
        continue;
      }
      if (!field.name) continue;

      const value = data[field.name];
      const rendered = renderFieldValue(field, value);
      if (!rendered) continue;

      sectionHtml += `<div class="export-field"><span class="export-field-label">${escapeHtml(field.label || field.name)}</span><div class="export-field-value">${rendered}</div></div>`;
    }

    sectionHtml += '</div>';
    sections.push(sectionHtml);
  }

  const bodyContent = sections.join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(documentTitle)}</title>
  <style>${css}</style>
  <style>
    .export-section { margin-bottom: 2rem; }
    .export-section-title { font-size: 1.25rem; margin-bottom: 1rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; }
    .export-subsection-title { font-size: 1rem; margin: 0.75rem 0 0.5rem; color: #374151; }
    .export-field { margin-bottom: 1rem; }
    .export-field-label { font-weight: 600; display: block; margin-bottom: 0.25rem; color: #374151; }
    .export-field-value { color: #1f2937; }
    .export-paragraph { margin: 0 0 0.5rem; }
    .export-table { width: 100%; border-collapse: collapse; margin: 0.5rem 0; font-size: 0.875rem; }
    .export-table th, .export-table td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; }
    .export-table th { background: #f3f4f6; font-weight: 600; }
    .export-info-banner { background: #fef3c7; padding: 0.5rem 0.75rem; border-radius: 0.25rem; margin: 0.5rem 0; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container" style="max-width: 210mm; margin: 0 auto; padding: 20px;">
    <h1 class="cover-title" style="font-size: 1.5rem; margin-bottom: 0.5rem;">${escapeHtml(documentTitle)}</h1>
    <p class="cover-subtitle" style="color: #6b7280; font-size: 0.875rem;">ISO 19650 Exchange Information Requirements</p>
    ${bodyContent}
  </div>
</body>
</html>`;
}

module.exports = {
  generateEirDocumentHTML
};
