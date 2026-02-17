import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  Packer,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
  ImageRun
} from 'docx';
import CONFIG from '../config/bepConfig';
import { convertHtmlToDocx } from './htmlToDocx';

// Field types that are rendered as visual diagrams and captured as screenshots.
// Must stay in sync with componentScreenshotCapture.js VISUAL_COMPONENTS array.
const VISUAL_COMPONENT_TYPES = [
  'orgchart',
  'orgstructure-data-table',
  'cdeDiagram',
  'mindmap',
  'fileStructure',
  'federation-strategy'
];

// Create a bordered table cell with safe null/undefined handling.
const createBorderedCell = (content, isBold = false) => {
  const safeContent = content == null || content === '' ? '' : String(content);
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: safeContent, bold: isBold })]
    })],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
    }
  });
};

// Create a blue header cell (used in TIDP/MIDP section).
const createHeaderCell = (text) => {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: 'FFFFFF' })],
      alignment: AlignmentType.CENTER
    })],
    shading: { type: ShadingType.SOLID, fill: '2E86AB' },
    width: { size: 50, type: WidthType.PERCENTAGE }
  });
};

// Convert a base64 image string to a docx ImageRun.
// Returns null if the data is invalid.
const addImageFromBase64 = async (base64String) => {
  try {
    if (!base64String) return null;

    const formatMatch = base64String.match(/^data:image\/(\w+);base64,/);
    const format = formatMatch ? formatMatch[1].toLowerCase() : 'jpeg';

    const imageDimensions = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.width, height: image.height });
      image.onerror = () => reject(new Error('Failed to decode image dimensions'));
      image.src = base64String;
    });

    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    if (!base64Data || base64Data.length === 0) return null;

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    if (bytes.length === 0) return null;

    const maxWidthPixels = 600;
    const maxHeightPixels = 800;

    let finalWidth = imageDimensions.width;
    let finalHeight = imageDimensions.height;

    if (finalWidth > maxWidthPixels || finalHeight > maxHeightPixels) {
      const widthRatio = maxWidthPixels / finalWidth;
      const heightRatio = maxHeightPixels / finalHeight;
      const ratio = Math.min(widthRatio, heightRatio);
      finalWidth = Math.round(finalWidth * ratio);
      finalHeight = Math.round(finalHeight * ratio);
    }

    console.log(`📐 DOCX image dimensions for ${format}: ${imageDimensions.width}×${imageDimensions.height}`);
    console.log(`📏 DOCX scaled dimensions: ${finalWidth}×${finalHeight}`);
    console.log(`📦 Creating DOCX ImageRun with ${bytes.length} bytes`);

    const imageRun = new ImageRun({
      data: bytes,
      transformation: { width: finalWidth, height: finalHeight }
    });

    console.log('✅ DOCX ImageRun created successfully');
    return imageRun;
  } catch (error) {
    console.error('Error converting image to ImageRun:', error.message, error.stack);
    return null;
  }
};

export const generateDocx = async (formData, bepType, options = {}) => {
  const { tidpData = [], midpData = [], componentImages = {} } = options;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  const sections = [];

  // ------------------------------------------------------------------
  // Cover page
  // ------------------------------------------------------------------
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: 'BIM EXECUTION PLAN (BEP)', bold: true, size: 48, color: '2E86AB' })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({ text: 'ISO 19650-2:2018 Compliant', bold: true, size: 32, color: '4A4A4A' })],
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [new TextRun({ text: CONFIG.bepTypeDefinitions[bepType].title, size: 28, color: '2E86AB' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({ text: CONFIG.bepTypeDefinitions[bepType].description, size: 24, italics: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // ------------------------------------------------------------------
  // ISO 19650 Compliance Statement
  // ------------------------------------------------------------------
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: 'ISO 19650 COMPLIANCE STATEMENT', bold: true, size: 32, color: '2E86AB' })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '✓ ', size: 28 }),
        new TextRun({ text: 'Formal Declaration of Conformity', bold: true, size: 24 })
      ],
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: 'This BIM Execution Plan (BEP) has been prepared in accordance with ISO 19650-2:2018 "Organization and digitization of information about buildings and civil engineering works, including building information modelling (BIM) — Information management using building information modelling — Part 2: Delivery phase of the assets."',
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Key Compliance Areas:', bold: true, size: 22 })],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({ text: '✓ Information Management Strategy', bullet: { level: 0 } }),
    new Paragraph({ text: '✓ Information Delivery Planning (TIDP/MIDP)', bullet: { level: 0 } }),
    new Paragraph({ text: '✓ Common Data Environment (CDE) Workflow', bullet: { level: 0 } }),
    new Paragraph({ text: '✓ Information Security and Classification', bullet: { level: 0 } }),
    new Paragraph({ text: '✓ Quality Assurance and Review Procedures', bullet: { level: 0 }, spacing: { after: 400 } })
  );

  // ------------------------------------------------------------------
  // Document Information Table
  // ------------------------------------------------------------------
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: 'DOCUMENT INFORMATION', bold: true, size: 28, color: '2E86AB' })],
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 400, after: 200 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [createBorderedCell('Document Type:', true), createBorderedCell(CONFIG.bepTypeDefinitions[bepType].title)] }),
        new TableRow({ children: [createBorderedCell('Document Purpose:', true), createBorderedCell(CONFIG.bepTypeDefinitions[bepType].purpose)] }),
        new TableRow({ children: [createBorderedCell('Project Name:', true), createBorderedCell(formData.projectName || 'Not specified')] }),
        new TableRow({ children: [createBorderedCell('Project Number:', true), createBorderedCell(formData.projectNumber || 'Not specified')] }),
        new TableRow({ children: [createBorderedCell('Generated Date:', true), createBorderedCell(`${formattedDate} at ${formattedTime}`)] }),
        new TableRow({ children: [createBorderedCell('Status:', true), createBorderedCell(bepType === 'pre-appointment' ? 'Tender Submission' : 'Working Document')] })
      ]
    })
  );

  // ------------------------------------------------------------------
  // Information Delivery Plan (TIDP / MIDP)
  // ------------------------------------------------------------------
  if (tidpData.length > 0 || midpData.length > 0) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'INFORMATION DELIVERY PLAN', bold: true, size: 32, color: '2E86AB' })],
        heading: HeadingLevel.HEADING_2,
        pageBreakBefore: true,
        spacing: { after: 200 }
      })
    );

    if (tidpData.length > 0) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: 'Task Information Delivery Plans (TIDPs)', bold: true, size: 26, color: '2E86AB' })],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: 'The following TIDPs have been created for this project, defining specific information delivery requirements for each task team:',
          spacing: { after: 200 }
        })
      );

      tidpData.forEach((tidp, index) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: `${tidp.teamName || tidp.taskTeam || `Task Team ${index + 1}`}`, bold: true, size: 22 })],
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 200, after: 100 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [createBorderedCell('Team Leader:', true), createBorderedCell(tidp.leader || tidp.teamLeader || 'TBD')] }),
              new TableRow({ children: [createBorderedCell('Responsibilities:', true), createBorderedCell(tidp.responsibilities || tidp.description || 'TBD')] })
            ]
          })
        );

        if (tidp.containers && tidp.containers.length > 0) {
          sections.push(new Paragraph({ text: 'Information Containers:', bold: true }));
          tidp.containers.forEach(container => {
            sections.push(new Paragraph({ text: `• ${container.name || container}`, indent: { left: 720 } }));
          });
        }
      });
    }

    if (midpData.length > 0) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: 'Master Information Delivery Plan (MIDP)', bold: true, size: 26, color: '2E86AB' })],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: 'The consolidated MIDP provides a project-wide view of all information delivery milestones:',
          spacing: { after: 200 }
        })
      );

      midpData.forEach((midp, index) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: `${midp.name || `MIDP ${index + 1}`}`, bold: true, size: 22 })],
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 200, after: 100 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [createBorderedCell('Description:', true), createBorderedCell(midp.description || 'Consolidated information delivery plan')] }),
              new TableRow({ children: [createBorderedCell('Status:', true), createBorderedCell(midp.status || 'Active')] })
            ]
          })
        );

        if (midp.milestones && midp.milestones.length > 0) {
          sections.push(new Paragraph({ text: 'Key Milestones:', bold: true }));
          midp.milestones.slice(0, 5).forEach(milestone => {
            sections.push(new Paragraph({
              text: `• ${milestone.name || milestone.title || milestone} - ${milestone.date || 'TBD'}`,
              indent: { left: 720 }
            }));
          });
          if (midp.milestones.length > 5) {
            sections.push(new Paragraph({
              text: `... and ${midp.milestones.length - 5} more milestones`,
              indent: { left: 720 },
              italics: true
            }));
          }
        }
      });
    }

    sections.push(
      new Paragraph({ text: 'Integration with BEP', heading: HeadingLevel.HEADING_4 }),
      new Paragraph({
        text: 'The TIDPs and MIDP defined above are integral components of this BIM Execution Plan, providing the detailed information delivery framework required by ISO 19650-2:2018. The BEP establishes the overarching information management strategy, while the TIDPs and MIDP provide the specific implementation details for each task team and the project as a whole.'
      })
    );
  }

  // ------------------------------------------------------------------
  // BEP form fields grouped by category
  // ------------------------------------------------------------------
  const groupedSteps = CONFIG.steps.reduce((acc, step, index) => {
    const cat = step.category;
    if (!acc[cat]) acc[cat] = [];
    const stepConfig = CONFIG.getFormFields(bepType, index);
    if (stepConfig) {
      const sectionNumber = stepConfig.number || `${acc[cat].length + 1}`;
      acc[cat].push({ index, title: `${sectionNumber}. ${stepConfig.title.toUpperCase()}`, fields: stepConfig.fields });
    }
    return acc;
  }, {});

  const groupedEntries = Object.entries(groupedSteps);
  for (const [catIndex, [cat, items]] of groupedEntries.entries()) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: CONFIG.categories[cat].name, bold: true, size: 36, color: '2E86AB' })],
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: catIndex > 0,
        spacing: { after: 300 }
      })
    );

    for (const item of items) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: item.title, bold: true, size: 28, color: '4A4A4A' })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        })
      );

      const fields = item.fields;
      const tableFields = fields.filter(f =>
        f.type !== 'textarea' &&
        f.type !== 'checkbox' &&
        f.type !== 'custom' &&
        !VISUAL_COMPONENT_TYPES.includes(f.type)
      );
      const otherFields = fields.filter(f =>
        f.type === 'textarea' ||
        f.type === 'checkbox' ||
        f.type === 'custom' ||
        VISUAL_COMPONENT_TYPES.includes(f.type)
      );

      if (tableFields.length > 0) {
        const tableRows = tableFields
          .filter(field => field.label)
          .map(field => {
            const fieldLabel = (field.number && field.number.trim())
              ? `${field.number} ${field.label || 'Field'}`
              : (field.label || 'Field');
            return new TableRow({
              children: [
                createBorderedCell(fieldLabel + ':', true),
                createBorderedCell(formData[field.name])
              ]
            });
          });

        if (tableRows.length > 0) {
          sections.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }));
        }
      }

      for (const field of otherFields) {
        const fieldLabel = (field.number && field.number.trim())
          ? `${field.number} ${field.label || 'Untitled Field'}`
          : (field.label || 'Untitled Field');

        sections.push(
          new Paragraph({
            children: [new TextRun({ text: fieldLabel, bold: true, size: 22, color: '2E86AB' })],
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          })
        );

        // Embed image for visual components
        const isVisualComponent = VISUAL_COMPONENT_TYPES.includes(field.type);
        if (isVisualComponent) {
          if (componentImages && componentImages[field.name]) {
            try {
              console.log(`📸 Adding image for visual component: ${field.name} (type: ${field.type})`);
              const imageRun = await addImageFromBase64(componentImages[field.name]);
              if (imageRun) {
                console.log(`✅ Image added successfully for field: ${field.name}`);
                sections.push(new Paragraph({ children: [imageRun], spacing: { after: 200 } }));
              } else {
                console.warn(`⚠ ImageRun creation failed for field: ${field.name}`);
                sections.push(new Paragraph({
                  children: [new TextRun({ text: `[Visual component: ${field.label || field.name}]`, italics: true, color: '999999' })],
                  spacing: { after: 200 }
                }));
              }
            } catch (err) {
              console.error(`Could not add image for field ${field.name}:`, err);
              sections.push(new Paragraph({
                children: [new TextRun({ text: `[Error loading visual component: ${field.label || field.name}]`, italics: true, color: 'FF0000' })],
                spacing: { after: 200 }
              }));
            }
          } else {
            sections.push(new Paragraph({
              children: [new TextRun({ text: `[Visual component not captured: ${field.label || field.name}]`, italics: true, color: '999999' })],
              spacing: { after: 200 }
            }));
          }
        }

        const value = formData[field.name];
        if (field.type === 'checkbox' && Array.isArray(value)) {
          value.forEach(item => {
            sections.push(new Paragraph({ text: `✓ ${item}`, bullet: { level: 0 }, spacing: { after: 50 } }));
          });
        } else if (field.type === 'textarea' && value) {
          const isHtml = value.trim().startsWith('<') && value.includes('>');
          if (isHtml) {
            try {
              const docxElements = convertHtmlToDocx(value);
              docxElements.forEach(element => sections.push(element));
            } catch (error) {
              console.error('Error converting HTML to DOCX:', error);
              value.split('\n').forEach(line => {
                sections.push(new Paragraph({ text: line || '', spacing: { after: 100 } }));
              });
            }
          } else {
            value.split('\n').forEach(line => {
              sections.push(new Paragraph({ text: line || '', spacing: { after: 100 } }));
            });
          }
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // Document Control footer
  // ------------------------------------------------------------------
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: 'DOCUMENT CONTROL INFORMATION', bold: true, size: 28, color: '2E86AB' })],
      heading: HeadingLevel.HEADING_3,
      pageBreakBefore: true,
      spacing: { after: 200 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [createBorderedCell('Document Type:', true), createBorderedCell('BIM Execution Plan (BEP)')] }),
        new TableRow({ children: [createBorderedCell('ISO Standard:', true), createBorderedCell('ISO 19650-2:2018')] }),
        new TableRow({ children: [createBorderedCell('Document Status:', true), createBorderedCell('Work in Progress')] }),
        new TableRow({ children: [createBorderedCell('Generated By:', true), createBorderedCell('Professional BEP Generator Tool')] }),
        new TableRow({ children: [createBorderedCell('Generated Date:', true), createBorderedCell(formattedDate)] }),
        new TableRow({ children: [createBorderedCell('Generated Time:', true), createBorderedCell(formattedTime)] })
      ]
    })
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
          paragraph: { spacing: { line: 276, before: 100, after: 100 } }
        }
      }
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1)
          }
        }
      },
      children: sections
    }]
  });

  return Packer.toBlob(doc);
};

// Alias for backwards compatibility
export const generateDocxSimple = generateDocx;
