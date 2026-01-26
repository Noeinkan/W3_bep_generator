import axios from 'axios';

/**
 * Export EIR analysis to PDF
 * @param {Object} analysis - EIR analysis JSON
 * @param {string} summary - Markdown summary
 * @param {string} [filename] - Optional filename
 * @returns {Promise<void>}
 */
export const exportEirAnalysisPdf = async (analysis, summary, filename) => {
  const response = await axios.post(
    '/api/export/eir/pdf',
    { analysis, summary, filename },
    { responseType: 'blob', timeout: 60000 }
  );

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const contentDisposition = response.headers['content-disposition'];
  let resolvedFilename = filename || 'EIR_Analysis.pdf';
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]*)"?/);
    if (match && match[1]) {
      resolvedFilename = match[1];
    }
  }

  link.download = resolvedFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
