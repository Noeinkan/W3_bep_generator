const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const exportService = require('../services/exportService');
const tidpService = require('../services/tidpService');
const midpService = require('../services/midpService');
const responsibilityMatrixService = require('../services/responsibilityMatrixService');
const tidpSyncService = require('../services/tidpSyncService');
const puppeteerPdfService = require('../services/puppeteerPdfService');
const htmlTemplateService = require('../services/htmlTemplateService');
const eirExportService = require('../services/eirExportService');

/**
 * POST /api/export/tidp/:id/excel
 * Export TIDP to Excel
 */
router.post('/tidp/:id/excel', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tidp = tidpService.getTIDP(id);

    const filepath = await exportService.exportTIDPToExcel(tidp);
    const filename = path.basename(filepath);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Clean up temp file after sending
      setTimeout(() => exportService.cleanupFile(filepath), 5000);
    });

    fileStream.on('error', (error) => {
      next(error);
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * POST /api/export/tidp/:id/pdf
 * Export TIDP to PDF
 */
router.post('/tidp/:id/pdf', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tidp = tidpService.getTIDP(id);

    const filepath = await exportService.exportTIDPToPDF(tidp);
    const filename = path.basename(filepath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Clean up temp file after sending
      setTimeout(() => exportService.cleanupFile(filepath), 5000);
    });

    fileStream.on('error', (error) => {
      next(error);
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * POST /api/export/midp/:id/excel
 * Export MIDP to Excel
 */
router.post('/midp/:id/excel', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    const filepath = await exportService.exportMIDPToExcel(midp);
    const filename = path.basename(filepath);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Clean up temp file after sending
      setTimeout(() => exportService.cleanupFile(filepath), 5000);
    });

    fileStream.on('error', (error) => {
      next(error);
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * POST /api/export/midp/:id/pdf
 * Export MIDP to PDF
 */
router.post('/midp/:id/pdf', async (req, res, next) => {
  try {
    const { id } = req.params;
    const midp = midpService.getMIDP(id);

    const filepath = await exportService.exportMIDPToPDF(midp);
    const filename = path.basename(filepath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Clean up temp file after sending
      setTimeout(() => exportService.cleanupFile(filepath), 5000);
    });

    fileStream.on('error', (error) => {
      next(error);
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * POST /api/export/project/:projectId/consolidated-excel
 * Export consolidated project data to Excel (all TIDPs + MIDP)
 */
router.post('/project/:projectId/consolidated-excel', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { midpId } = req.body;

    if (!midpId) {
      return res.status(400).json({
        success: false,
        error: 'MIDP ID is required for consolidated export'
      });
    }

    const midp = midpService.getMIDP(midpId);
    const tidps = tidpService.getTIDPsByProject(projectId);

    // Create consolidated workbook with all data
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'BEP Generator';
    workbook.created = new Date();

    // Add MIDP sheets
    const midpFilepath = await exportService.exportMIDPToExcel(midp);
    const midpWorkbook = new ExcelJS.Workbook();
    await midpWorkbook.xlsx.readFile(midpFilepath);

    // Copy MIDP worksheets
    midpWorkbook.eachSheet((worksheet) => {
      const newSheet = workbook.addWorksheet(`MIDP_${worksheet.name}`);
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        const newRow = newSheet.getRow(rowNumber);
        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          newRow.getCell(colNumber).value = cell.value;
          newRow.getCell(colNumber).style = cell.style;
        });
        newRow.commit();
      });
    });

    // Add individual TIDP sheets
    for (let i = 0; i < tidps.length; i++) {
      const tidp = tidps[i];
      const tidpFilepath = await exportService.exportTIDPToExcel(tidp);
      const tidpWorkbook = new ExcelJS.Workbook();
      await tidpWorkbook.xlsx.readFile(tidpFilepath);

      tidpWorkbook.eachSheet((worksheet) => {
        const sheetName = `TIDP_${tidp.discipline}_${worksheet.name}`.substring(0, 31); // Excel sheet name limit
        const newSheet = workbook.addWorksheet(sheetName);
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          const newRow = newSheet.getRow(rowNumber);
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            newRow.getCell(colNumber).value = cell.value;
            newRow.getCell(colNumber).style = cell.style;
          });
          newRow.commit();
        });
      });

      // Clean up individual TIDP file
      exportService.cleanupFile(tidpFilepath);
    }

    // Save consolidated workbook
    const consolidatedFilename = `Consolidated_Project_${projectId}_${new Date().toISOString().split('T')[0]}.xlsx`;
    const consolidatedPath = path.join(exportService.tempDir, consolidatedFilename);
    await workbook.xlsx.writeFile(consolidatedPath);

    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${consolidatedFilename}"`);

    const fileStream = fs.createReadStream(consolidatedPath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Clean up temp files
      setTimeout(() => {
        exportService.cleanupFile(consolidatedPath);
        exportService.cleanupFile(midpFilepath);
      }, 5000);
    });

    fileStream.on('error', (error) => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/export/formats
 * Get available export formats
 */
router.get('/formats', (req, res) => {
  res.json({
    success: true,
    data: {
      tidp: {
        formats: ['excel', 'pdf'],
        descriptions: {
          excel: 'Comprehensive Excel workbook with multiple sheets for containers, dependencies, and quality requirements',
          pdf: 'Professional PDF document suitable for formal submissions and reviews'
        }
      },
      midp: {
        formats: ['excel', 'pdf'],
        descriptions: {
          excel: 'Detailed Excel workbook with aggregated data, schedules, risks, and resource planning',
          pdf: 'Executive summary PDF with key metrics, milestones, and risk register'
        }
      },
      consolidated: {
        formats: ['excel'],
        descriptions: {
          excel: 'Complete project documentation combining MIDP and all TIDPs in a single workbook'
        }
      }
    }
  });
});

/**
 * GET /api/export/templates
 * Get export templates and examples
 */
router.get('/templates', (req, res) => {
  res.json({
    success: true,
    data: {
      tidp: {
        sections: [
          'Task Team Information',
          'Information Containers',
          'Dependencies',
          'Quality Requirements'
        ],
        requiredFields: [
          'teamName',
          'discipline',
          'leader',
          'company',
          'containers'
        ]
      },
      midp: {
        sections: [
          'Project Summary',
          'Delivery Schedule',
          'All Information Containers',
          'Milestones',
          'Dependency Matrix',
          'Risk Register',
          'Resource Plan'
        ],
        aggregatedFields: [
          'totalContainers',
          'totalEstimatedHours',
          'disciplines',
          'milestones',
          'riskSummary'
        ]
      }
    }
  });
});

/**
 * POST /api/export/preview/tidp/:id
 * Generate preview data for TIDP export
 */
router.post('/preview/tidp/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { format } = req.body;

    const tidp = tidpService.getTIDP(id);

    const preview = {
      metadata: {
        teamName: tidp.teamName,
        discipline: tidp.discipline,
        containerCount: tidp.containers?.length || 0,
        estimatedPages: format === 'pdf' ? Math.ceil((tidp.containers?.length || 0) / 5) + 3 : null,
        estimatedSize: format === 'excel' ? '~50KB' : '~200KB'
      },
      sections: []
    };

    // Add sections based on available data
    if (tidp.teamName) {
      preview.sections.push('Task Team Information');
    }
    if (tidp.containers && tidp.containers.length > 0) {
      preview.sections.push(`Information Containers (${tidp.containers.length} items)`);
    }
    if (tidp.predecessors && tidp.predecessors.length > 0) {
      preview.sections.push(`Dependencies (${tidp.predecessors.length} items)`);
    }
    if (tidp.qualityChecks || tidp.reviewProcess) {
      preview.sections.push('Quality Requirements');
    }

    res.json({
      success: true,
      data: preview
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * POST /api/export/preview/midp/:id
 * Generate preview data for MIDP export
 */
router.post('/preview/midp/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { format } = req.body;

    const midp = midpService.getMIDP(id);

    const preview = {
      metadata: {
        projectName: midp.projectName,
        totalContainers: midp.aggregatedData.totalContainers,
        milestones: midp.aggregatedData.milestones.length,
        includedTIDPs: midp.includedTIDPs.length,
        estimatedPages: format === 'pdf' ? Math.ceil(midp.aggregatedData.totalContainers / 10) + 5 : null,
        estimatedSize: format === 'excel' ? '~150KB' : '~500KB'
      },
      sections: [
        'Project Summary',
        `Delivery Schedule (${midp.deliverySchedule?.phases?.length || 0} phases)`,
        `All Information Containers (${midp.aggregatedData.totalContainers} items)`,
        `Milestones (${midp.aggregatedData.milestones.length} items)`,
        `Risk Register (${midp.riskRegister?.summary?.total || 0} risks)`,
        'Resource Planning'
      ]
    };

    res.json({
      success: true,
      data: preview
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

/**
 * POST /api/export/responsibility-matrix/excel
 * Export Responsibility Matrices to Excel
 */
router.post('/responsibility-matrix/excel', async (req, res, next) => {
  try {
    const { projectId, projectName, options = {} } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'projectId is required'
      });
    }

    // Fetch IM Activities
    const imActivities = responsibilityMatrixService.getIMActivities(projectId);

    // Fetch Deliverables
    const deliverables = responsibilityMatrixService.getDeliverables(projectId);

    // Get sync status if requested
    let syncStatus = null;
    if (options.includeSyncStatus) {
      syncStatus = tidpSyncService.getSyncStatus(projectId);
    }

    // Prepare export data
    const exportData = {
      imActivities,
      deliverables,
      project: {
        id: projectId,
        name: projectName || 'Project'
      },
      syncStatus,
      options: {
        includeSummary: options.summary !== false,
        includeImActivities: options.matrices?.imActivities !== false,
        includeDeliverables: options.matrices?.deliverables !== false,
        includeIsoReferences: options.details?.isoReferences !== false,
        includeDescriptions: options.details?.descriptions !== false,
        includeSyncStatus: options.details?.syncStatus !== false
      }
    };

    const filepath = await exportService.exportResponsibilityMatricesToExcel(exportData);
    const filename = path.basename(filepath);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      setTimeout(() => exportService.cleanupFile(filepath), 5000);
    });

    fileStream.on('error', (error) => {
      next(error);
    });
  } catch (error) {
    console.error('Error exporting responsibility matrices to Excel:', error);
    next(error);
  }
});

/**
 * POST /api/export/responsibility-matrix/pdf
 * Export Responsibility Matrices to PDF
 */
router.post('/responsibility-matrix/pdf', async (req, res, next) => {
  try {
    const { projectId, projectName, options = {} } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'projectId is required'
      });
    }

    // Fetch IM Activities
    const imActivities = responsibilityMatrixService.getIMActivities(projectId);

    // Fetch Deliverables
    const deliverables = responsibilityMatrixService.getDeliverables(projectId);

    // Prepare export data
    const exportData = {
      imActivities,
      deliverables,
      project: {
        id: projectId,
        name: projectName || 'Project'
      },
      options: {
        includeImActivities: options.matrices?.imActivities !== false,
        includeDeliverables: options.matrices?.deliverables !== false,
        includeIsoReferences: options.details?.isoReferences !== false,
        includeDescriptions: options.details?.descriptions !== false
      }
    };

    const filepath = await exportService.exportResponsibilityMatricesToPDF(exportData);
    const filename = path.basename(filepath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      setTimeout(() => exportService.cleanupFile(filepath), 5000);
    });

    fileStream.on('error', (error) => {
      next(error);
    });
  } catch (error) {
    console.error('Error exporting responsibility matrices to PDF:', error);
    next(error);
  }
});

/**
 * POST /api/export/bep/pdf
 * Generate BEP PDF using Puppeteer
 *
 * Request body:
 * {
 *   formData: {...},
 *   bepType: 'pre-appointment' | 'post-appointment',
 *   tidpData: [...],
 *   midpData: [...],
 *   componentImages: { fieldName: base64String },
 *   options: {
 *     orientation: 'portrait' | 'landscape',
 *     quality: 'standard' | 'high'
 *   }
 * }
 */
router.post('/bep/pdf', async (req, res, next) => {
  try {
    const { formData, bepType, tidpData, midpData, componentImages, options } = req.body;

    // Validation
    if (!formData || !bepType) {
      return res.status(400).json({
        success: false,
        error: 'formData and bepType are required'
      });
    }

    console.log('🚀 Starting BEP PDF generation...');
    console.log(`   BEP Type: ${bepType}`);
    console.log(`   Project: ${formData.projectName || 'Unknown'}`);
    console.log(`   TIDPs: ${tidpData?.length || 0}, MIDPs: ${midpData?.length || 0}`);
    console.log(`   Component Images: ${Object.keys(componentImages || {}).length}`);

    // Generate HTML from template
    const html = await htmlTemplateService.generateBEPHTML(
      formData,
      bepType,
      tidpData || [],
      midpData || [],
      componentImages || {}
    );

    console.log(`✅ HTML generated (${(html.length / 1024).toFixed(2)} KB)`);

    // Generate PDF with Puppeteer
    const pdfOptions = {
      format: 'A4',
      orientation: options?.orientation || 'portrait',
      margins: {
        top: '25mm',
        right: '20mm',
        bottom: '25mm',
        left: '20mm'
      },
      timeout: options?.quality === 'high' ? 120000 : 60000
    };

    const filepath = await puppeteerPdfService.generatePDFFromHTML(html, pdfOptions);

    // Stream PDF to client
    const filename = `BEP_${bepType}_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      console.log('✅ PDF sent to client successfully');
      // Clean up temp file after sending
      setTimeout(() => {
        fs.unlink(filepath, (err) => {
          if (err) console.error('⚠️  Error cleaning up temp file:', err);
          else console.log('🧹 Temp file cleaned up');
        });
      }, 5000);
    });

    fileStream.on('error', (error) => {
      console.error('❌ Error streaming PDF:', error);
      next(error);
    });

  } catch (error) {
    console.error('❌ BEP PDF generation failed:', error);

    // Send user-friendly error response
    const statusCode = error.message.includes('timeout') ? 504 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'PDF generation failed'
    });
  }
});

/**
 * POST /api/export/eir/pdf
 * Export EIR analysis to PDF
 *
 * Request body:
 * {
 *   analysis: {...},
 *   summary: "markdown summary",
 *   filename: "optional filename"
 * }
 */
router.post('/eir/pdf', async (req, res, next) => {
  try {
    const { analysis, summary, filename } = req.body;

    if (!analysis) {
      return res.status(400).json({
        success: false,
        error: 'analysis is required'
      });
    }

    const html = eirExportService.generateEirAnalysisHTML(analysis, summary);
    const pdfOptions = {
      format: 'A4',
      orientation: 'portrait',
      margins: {
        top: '22mm',
        right: '18mm',
        bottom: '22mm',
        left: '18mm'
      },
      timeout: 60000
    };

    const filepath = await puppeteerPdfService.generatePDFFromHTML(html, pdfOptions);

    const safeFilename = filename || `EIR_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      setTimeout(() => {
        fs.unlink(filepath, (err) => {
          if (err) console.error('⚠️  Error cleaning up temp file:', err);
        });
      }, 5000);
    });

    fileStream.on('error', (error) => {
      next(error);
    });
  } catch (error) {
    console.error('❌ EIR PDF export failed:', error);
    const statusCode = error.message.includes('timeout') ? 504 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'EIR PDF export failed'
    });
  }
});

module.exports = router;