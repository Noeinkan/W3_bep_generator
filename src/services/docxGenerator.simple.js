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

// Enhanced version with styling
export const generateDocxSimple = async (formData, bepType, options = {}) => {
  const { tidpData = [], midpData = [], componentImages = {} } = options;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  // Debug: log which images we received
  console.log('🖼️ Component images received:', Object.keys(componentImages));
  console.log('📊 Number of images:', Object.keys(componentImages).length);

  const sections = [];

  // List of field types that have visual components (should match componentScreenshotCapture.js)
  const VISUAL_COMPONENT_TYPES = ['orgchart', 'orgstructure-data-table', 'cdeDiagram', 'mindmap', 'fileStructure', 'naming-conventions', 'federation-strategy'];

  // Helper function to create bordered cells
  const createBorderedCell = (content, isBold = false) => {
    // Ensure content is always a valid string to prevent DOCX corruption
    const safeContent = content == null || content === undefined || content === ''
      ? ''
      : String(content);

    return new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: safeContent, bold: isBold })]
      })],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
      }
    });
  };

  // Helper function to convert base64 image to ImageRun
  const addImageFromBase64 = (base64String) => {
    try {
      if (!base64String) {
        console.warn('No base64 string provided for image');
        return null;
      }

      // Remove data:image/png;base64, prefix if present
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

      // Validate base64 string
      if (!base64Data || base64Data.length === 0) {
        console.error('Invalid base64 data after prefix removal');
        return null;
      }

      // Convert base64 to binary string
      const binaryString = atob(base64Data);

      // Convert binary string to Uint8Array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Validate that we have actual image data
      if (bytes.length === 0) {
        console.error('Image byte array is empty');
        return null;
      }

      console.log(`Creating ImageRun with ${bytes.length} bytes`);

      return new ImageRun({
        data: bytes,
        transformation: {
          width: 600,
          height: 400
        }
      });
    } catch (error) {
      console.error('Error adding image:', error);
      console.error('Error details:', error.message, error.stack);
      return null;
    }
  };

  // Cover page with styled text
  sections.push(
    new Paragraph({
      children: [new TextRun({
        text: "BIM EXECUTION PLAN (BEP)",
        bold: true,
        size: 48,  // 24pt
        color: "2E86AB"
      })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({
        text: "ISO 19650-2:2018 Compliant",
        bold: true,
        size: 32,  // 16pt
        color: "4A4A4A"
      })],
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [new TextRun({
        text: CONFIG.bepTypeDefinitions[bepType].title,
        size: 28,  // 14pt
        color: "2E86AB"
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({
        text: CONFIG.bepTypeDefinitions[bepType].description,
        size: 24,  // 12pt
        italics: true
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // ISO Compliance Section (new page)
  sections.push(
    new Paragraph({
      children: [new TextRun({
        text: "ISO 19650 COMPLIANCE STATEMENT",
        bold: true,
        size: 32,
        color: "2E86AB"
      })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "✓ ", size: 28 }),
        new TextRun({ text: "Formal Declaration of Conformity", bold: true, size: 24 })
      ],
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: 'This BIM Execution Plan (BEP) has been prepared in accordance with ISO 19650-2:2018 "Organization and digitization of information about buildings and civil engineering works, including building information modelling (BIM) — Information management using building information modelling — Part 2: Delivery phase of the assets."',
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({ text: "Key Compliance Areas:", bold: true, size: 22 })],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({ text: "✓ Information Management Strategy", bullet: { level: 0 } }),
    new Paragraph({ text: "✓ Information Delivery Planning (TIDP/MIDP)", bullet: { level: 0 } }),
    new Paragraph({ text: "✓ Common Data Environment (CDE) Workflow", bullet: { level: 0 } }),
    new Paragraph({ text: "✓ Information Security and Classification", bullet: { level: 0 } }),
    new Paragraph({ text: "✓ Quality Assurance and Review Procedures", bullet: { level: 0 }, spacing: { after: 400 } })
  );

  // Document Information Table
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: "DOCUMENT INFORMATION", bold: true, size: 28, color: "2E86AB" })],
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 400, after: 200 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createBorderedCell("Document Type:", true),
            createBorderedCell(CONFIG.bepTypeDefinitions[bepType].title)
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("Document Purpose:", true),
            createBorderedCell(CONFIG.bepTypeDefinitions[bepType].purpose)
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("Project Name:", true),
            createBorderedCell(formData.projectName || 'Not specified')
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("Project Number:", true),
            createBorderedCell(formData.projectNumber || 'Not specified')
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("Generated Date:", true),
            createBorderedCell(`${formattedDate} at ${formattedTime}`)
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("Status:", true),
            createBorderedCell(bepType === 'pre-appointment' ? 'Tender Submission' : 'Working Document')
          ]
        })
      ]
    })
  );

  // Group steps by category and add content
  const groupedSteps = CONFIG.steps.reduce((acc, step, index) => {
    const cat = step.category;
    if (!acc[cat]) acc[cat] = [];
    const stepConfig = CONFIG.getFormFields(bepType, index);
    if (stepConfig) {
      // Use stepConfig.number instead of auto-incrementing
      const sectionNumber = stepConfig.number || `${acc[cat].length + 1}`;
      acc[cat].push({ index, title: `${sectionNumber}. ${stepConfig.title.toUpperCase()}`, fields: stepConfig.fields });
    }
    return acc;
  }, {});

  Object.entries(groupedSteps).forEach(([cat, items], catIndex) => {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: CONFIG.categories[cat].name, bold: true, size: 36, color: "2E86AB" })],
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: catIndex > 0,
        spacing: { after: 300 }
      })
    );

    items.forEach((item) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: item.title, bold: true, size: 28, color: "4A4A4A" })],
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
          .filter(field => field.label) // Only include fields with labels
          .map(field => {
            // Add field number to label if available and not empty
            const fieldLabel = (field.number && field.number.trim())
              ? `${field.number} ${field.label || 'Field'}`
              : (field.label || 'Field');

            return new TableRow({
              children: [
                createBorderedCell(fieldLabel + ":", true),
                createBorderedCell(formData[field.name])
              ]
            });
          });

        // Only add table if we have rows
        if (tableRows.length > 0) {
          sections.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }));
        }
      }

      otherFields.forEach(field => {
        // Add field number if available and not empty (e.g., "3.1", "3.2")
        const fieldLabel = (field.number && field.number.trim())
          ? `${field.number} ${field.label || 'Untitled Field'}`
          : (field.label || 'Untitled Field');

        sections.push(
          new Paragraph({
            children: [new TextRun({ text: fieldLabel, bold: true, size: 22, color: "2E86AB" })],
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          })
        );

        // Add image if available for visual components
        const isVisualComponent = VISUAL_COMPONENT_TYPES.includes(field.type);
        if (isVisualComponent && componentImages && componentImages[field.name]) {
          console.log(`📸 Adding image for visual component: ${field.name} (type: ${field.type})`);
          try {
            const imageRun = addImageFromBase64(componentImages[field.name]);
            if (imageRun) {
              console.log(`✅ Image added successfully for field: ${field.name}`);
              sections.push(
                new Paragraph({
                  children: [imageRun],
                  spacing: { after: 200 }
                })
              );
            } else {
              console.warn(`⚠️ imageRun is null for field: ${field.name}, adding placeholder text`);
              // Add placeholder text instead of failing
              sections.push(
                new Paragraph({
                  children: [new TextRun({
                    text: `[Visual component: ${field.label || field.name}]`,
                    italics: true,
                    color: "999999"
                  })],
                  spacing: { after: 200 }
                })
              );
            }
          } catch (err) {
            console.error(`❌ Could not add image for field ${field.name}:`, err);
            // Add error placeholder instead of failing silently
            sections.push(
              new Paragraph({
                children: [new TextRun({
                  text: `[Error loading visual component: ${field.label || field.name}]`,
                  italics: true,
                  color: "FF0000"
                })],
                spacing: { after: 200 }
              })
            );
          }
        } else if (isVisualComponent) {
          console.log(`⚠️ Visual component ${field.name} (type: ${field.type}) but no image in componentImages. Available:`, Object.keys(componentImages));
          // Add placeholder for missing image
          sections.push(
            new Paragraph({
              children: [new TextRun({
                text: `[Visual component not captured: ${field.label || field.name}]`,
                italics: true,
                color: "999999"
              })],
              spacing: { after: 200 }
            })
          );
        }

        const value = formData[field.name];
        if (field.type === 'checkbox' && Array.isArray(value)) {
          value.forEach(item => {
            sections.push(new Paragraph({ text: `✓ ${item}`, bullet: { level: 0 }, spacing: { after: 50 } }));
          });
        } else if (field.type === 'textarea' && value) {
          // Check if the value is HTML (from TipTap) or plain text
          const isHtml = value.trim().startsWith('<') && value.includes('>');

          if (isHtml) {
            // Convert HTML to DOCX elements
            try {
              const docxElements = convertHtmlToDocx(value);
              docxElements.forEach(element => sections.push(element));
            } catch (error) {
              console.error('Error converting HTML to DOCX:', error);
              // Fallback to plain text
              const lines = value.split('\n');
              lines.forEach(line => {
                sections.push(new Paragraph({ text: line || '', spacing: { after: 100 } }));
              });
            }
          } else {
            // Plain text - split by lines
            const lines = value.split('\n');
            lines.forEach(line => {
              sections.push(new Paragraph({ text: line || '', spacing: { after: 100 } }));
            });
          }
        }
      });
    });
  });

  // Footer
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: "DOCUMENT CONTROL INFORMATION", bold: true, size: 28, color: "2E86AB" })],
      heading: HeadingLevel.HEADING_3,
      pageBreakBefore: true,
      spacing: { after: 200 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [createBorderedCell("Document Type:", true), createBorderedCell("BIM Execution Plan (BEP)")] }),
        new TableRow({ children: [createBorderedCell("ISO Standard:", true), createBorderedCell("ISO 19650-2:2018")] }),
        new TableRow({ children: [createBorderedCell("Document Status:", true), createBorderedCell("Work in Progress")] }),
        new TableRow({ children: [createBorderedCell("Generated By:", true), createBorderedCell("Professional BEP Generator Tool")] }),
        new TableRow({ children: [createBorderedCell("Generated Date:", true), createBorderedCell(formattedDate)] }),
        new TableRow({ children: [createBorderedCell("Generated Time:", true), createBorderedCell(formattedTime)] })
      ]
    })
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
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
      children: sections,
    }],
  });

  return Packer.toBlob(doc);
};
