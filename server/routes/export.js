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
const projectService = require('../services/projectService');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication to all export routes
router.use(authenticateToken);

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
      },
      acc: {
        formats: ['zip'],
        descriptions: {
          zip: 'ACC ISO 19650 folder-structured package for manual upload'
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

    // Calculate request payload size for debugging
    const payloadSize = JSON.stringify(req.body).length;
    console.log(`   Payload size: ${(payloadSize / (1024 * 1024)).toFixed(2)} MB`);

    // Generate HTML from template
    console.log('📝 Generating HTML from template...');
    let html;
    try {
      html = await htmlTemplateService.generateBEPHTML(
        formData,
        bepType,
        tidpData || [],
        midpData || [],
        componentImages || {}
      );
      console.log(`✅ HTML generated (${(html.length / 1024).toFixed(2)} KB)`);
    } catch (htmlError) {
      console.error('❌ HTML generation failed:', htmlError);
      throw new Error(`HTML generation failed: ${htmlError.message}`);
    }

    // Generate PDF with Puppeteer
    // Increased timeouts to handle large HTML with embedded compressed images
    console.log('🖨️  Generating PDF with Puppeteer...');
    const pdfOptions = {
      format: 'A4',
      orientation: options?.orientation || 'portrait',
      margins: {
        top: '25mm',
        right: '20mm',
        bottom: '25mm',
        left: '20mm'
      },
      timeout: options?.quality === 'high' ? 180000 : 90000, // 3min high, 1.5min standard
      deviceScaleFactor: 1.5 // Optimized for A4 print quality
    };

    let filepath;
    try {
      filepath = await puppeteerPdfService.generatePDFFromHTML(html, pdfOptions);
    } catch (pdfError) {
      console.error('❌ Puppeteer PDF generation failed:', pdfError);
      throw new Error(`PDF generation failed: ${pdfError.message}`);
    }

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
 * POST /api/export/acc/package
 * Build an ACC ISO19650 folder-structured package archive for manual upload
 */
router.post('/acc/package', async (req, res, next) => {
  let workspaceRoot = null;
  let zipPath = null;
  const generatedFiles = [];

  try {
    const {
      projectId,
      projectName,
      formData,
      bepType,
      tidpIds = [],
      midpId,
      includeResponsibilityMatrix = false,
      componentImages = {},
      options = {}
    } = req.body;

    if (!formData || !bepType || !projectName) {
      return res.status(400).json({
        success: false,
        error: 'formData, bepType, and projectName are required'
      });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    workspaceRoot = path.join(
      exportService.tempDir,
      `acc_package_${timestamp}_${Math.random().toString(36).slice(2, 8)}`
    );

    await fs.promises.mkdir(workspaceRoot, { recursive: true });
    const accFolders = exportService.buildAccFolderStructure(workspaceRoot);

    // Generate BEP PDF to Shared/Planning
    const tidpData = Array.isArray(tidpIds) ? tidpIds.map(id => tidpService.getTIDP(id)) : [];
    const midpData = midpId ? [midpService.getMIDP(midpId)] : [];

    const html = await htmlTemplateService.generateBEPHTML(
      formData,
      bepType,
      tidpData,
      midpData,
      componentImages || {}
    );

    const bepPdfPath = await puppeteerPdfService.generatePDFFromHTML(html, {
      format: 'A4',
      orientation: options.orientation || 'portrait',
      margins: {
        top: '25mm',
        right: '20mm',
        bottom: '25mm',
        left: '20mm'
      },
      timeout: 90000,
      deviceScaleFactor: 1.5
    });

    const safeProjectName = exportService.sanitizeFilename(projectName);
    const bepFilename = `BEP_${safeProjectName}_${new Date().toISOString().split('T')[0]}.pdf`;
    const bepDestination = path.join(accFolders.sharedPlanning, bepFilename);
    await fs.promises.copyFile(bepPdfPath, bepDestination);
    exportService.cleanupFile(bepPdfPath);
    generatedFiles.push(path.relative(workspaceRoot, bepDestination).replace(/\\/g, '/'));

    // Generate MIDP (optional) to Shared/DeliveryPlans
    if (midpId) {
      const midp = midpService.getMIDP(midpId);
      const midpFilepath = await exportService.exportMIDPToExcel(midp);
      const midpDestination = path.join(
        accFolders.sharedDeliveryPlans,
        path.basename(midpFilepath)
      );
      await fs.promises.copyFile(midpFilepath, midpDestination);
      exportService.cleanupFile(midpFilepath);
      generatedFiles.push(path.relative(workspaceRoot, midpDestination).replace(/\\/g, '/'));
    }

    // Generate TIDPs (optional) to Work In Progress/TIDPs
    if (Array.isArray(tidpIds) && tidpIds.length > 0) {
      for (const tidpId of tidpIds) {
        const tidp = tidpService.getTIDP(tidpId);
        const tidpFilepath = await exportService.exportTIDPToExcel(tidp);
        const tidpDestination = path.join(
          accFolders.workInProgressTidps,
          path.basename(tidpFilepath)
        );
        await fs.promises.copyFile(tidpFilepath, tidpDestination);
        exportService.cleanupFile(tidpFilepath);
        generatedFiles.push(path.relative(workspaceRoot, tidpDestination).replace(/\\/g, '/'));
      }
    }

    // Generate responsibility matrices (optional) to Shared/Matrices
    if (includeResponsibilityMatrix && projectId) {
      const imActivities = responsibilityMatrixService.getIMActivities(projectId);
      const deliverables = responsibilityMatrixService.getDeliverables(projectId);

      const matrixFilepath = await exportService.exportResponsibilityMatricesToExcel({
        imActivities,
        deliverables,
        project: {
          id: projectId,
          name: projectName
        },
        options: {
          includeSummary: true,
          includeImActivities: true,
          includeDeliverables: true,
          includeIsoReferences: true,
          includeDescriptions: true,
          includeSyncStatus: false
        }
      });

      const matrixDestination = path.join(
        accFolders.sharedMatrices,
        path.basename(matrixFilepath)
      );
      await fs.promises.copyFile(matrixFilepath, matrixDestination);
      exportService.cleanupFile(matrixFilepath);
      generatedFiles.push(path.relative(workspaceRoot, matrixDestination).replace(/\\/g, '/'));
    }

    const linkedProject = projectId ? projectService.getProject(projectId) : null;
    const manifest = exportService.createAccManifest({
      projectId,
      projectName,
      bepType,
      accHubId: linkedProject?.acc_hub_id,
      accProjectId: linkedProject?.acc_project_id,
      accDefaultFolder: linkedProject?.acc_default_folder,
      files: generatedFiles
    });

    const manifestPath = path.join(workspaceRoot, 'manifest.json');
    await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

    zipPath = await exportService.createAccPackageArchive(
      workspaceRoot,
      `ACC_${safeProjectName}_${new Date().toISOString().split('T')[0]}`
    );

    const archiveName = path.basename(zipPath);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${archiveName}"`);

    const stream = fs.createReadStream(zipPath);
    stream.pipe(res);

    const cleanup = async () => {
      if (zipPath) {
        exportService.cleanupFile(zipPath);
      }
      if (workspaceRoot) {
        await fs.promises.rm(workspaceRoot, { recursive: true, force: true });
      }
    };

    stream.on('end', () => {
      setTimeout(() => {
        cleanup().catch((cleanupError) => {
          console.error('Error cleaning ACC package temp files:', cleanupError);
        });
      }, 5000);
    });

    stream.on('error', (error) => {
      cleanup().finally(() => next(error));
    });
  } catch (error) {
    if (workspaceRoot) {
      await fs.promises.rm(workspaceRoot, { recursive: true, force: true }).catch(() => {});
    }
    if (zipPath) {
      exportService.cleanupFile(zipPath);
    }

    if (error.message && error.message.includes('Archive tooling is unavailable')) {
      return res.status(500).json({ success: false, error: error.message });
    }

    next(error);
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