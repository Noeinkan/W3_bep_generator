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
  ImageRun,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
  PageBreak
} from 'docx';
import CONFIG from '../config/bepConfig';

export const generateDocx = async (formData, bepType, options = {}) => {
  const { tidpData = [], midpData = [], componentImages = {} } = options;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  const sections = [];

  // Helper function to create styled table cells
  const createHeaderCell = (text) => {
    return new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text, bold: true, color: "FFFFFF" })],
        alignment: AlignmentType.CENTER
      })],
      shading: {
        type: ShadingType.SOLID,
        fill: "2E86AB"
      },
      width: { size: 50, type: WidthType.PERCENTAGE }
    });
  };

  const createBorderedCell = (content, isBold = false) => {
    const para = typeof content === 'string'
      ? new Paragraph({ children: [new TextRun({ text: content, bold: isBold })] })
      : content;

    return new TableCell({
      children: Array.isArray(para) ? para : [para],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
      }
    });
  };

  // Helper function to convert base64 to image
  const addImageFromBase64 = (base64String) => {
    try {
      if (!base64String) return null;

      // Remove data:image/png;base64, prefix if present
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

      // Convert base64 to binary string
      const binaryString = atob(base64Data);

      // Convert binary string to Uint8Array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return new ImageRun({
        data: bytes,
        transformation: {
          width: 500,
          height: 350
        }
      });
    } catch (error) {
      console.error('Error adding image:', error);
      return null;
    }
  };

  // Cover Page Header
  sections.push(
    new Paragraph({
      children: [new TextRun({
        text: "BIM EXECUTION PLAN (BEP)",
        bold: true,
        size: 48,
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
        size: 32,
        color: "4A4A4A"
      })],
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [new TextRun({
        text: CONFIG.bepTypeDefinitions[bepType].title,
        size: 28,
        color: "2E86AB"
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({
        text: CONFIG.bepTypeDefinitions[bepType].description,
        size: 24,
        italics: true
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // ISO 19650 Compliance Section
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
      children: [new TextRun({
        text: "✓ ",
        size: 28,
        color: "28A745"
      }), new TextRun({
        text: "Formal Declaration of Conformity",
        bold: true,
        size: 24
      })],
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
    new Paragraph({
      text: "✓ Information Management Strategy",
      bullet: { level: 0 }
    }),
    new Paragraph({
      text: "✓ Information Delivery Planning (TIDP/MIDP)",
      bullet: { level: 0 }
    }),
    new Paragraph({
      text: "✓ Common Data Environment (CDE) Workflow",
      bullet: { level: 0 }
    }),
    new Paragraph({
      text: "✓ Information Security and Classification",
      bullet: { level: 0 }
    }),
    new Paragraph({
      text: "✓ Quality Assurance and Review Procedures",
      bullet: { level: 0 },
      spacing: { after: 400 }
    })
  );

  // Document Information Table
  sections.push(
    new Paragraph({
      children: [new TextRun({
        text: "DOCUMENT INFORMATION",
        bold: true,
        size: 28,
        color: "2E86AB"
      })],
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

  // Information Delivery Plan Section
  if (tidpData.length > 0 || midpData.length > 0) {
    sections.push(
      new Paragraph({
        children: [new TextRun({
          text: "INFORMATION DELIVERY PLAN",
          bold: true,
          size: 32,
          color: "2E86AB"
        })],
        heading: HeadingLevel.HEADING_2,
        pageBreakBefore: true,
        spacing: { after: 200 }
      })
    );

    if (tidpData.length > 0) {
      sections.push(
        new Paragraph({
          children: [new TextRun({
            text: "Task Information Delivery Plans (TIDPs)",
            bold: true,
            size: 26,
            color: "2E86AB"
          })],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "The following TIDPs have been created for this project, defining specific information delivery requirements for each task team:",
          spacing: { after: 200 }
        })
      );

      tidpData.forEach((tidp, index) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({
              text: `${tidp.teamName || tidp.taskTeam || `Task Team ${index + 1}`}`,
              bold: true,
              size: 22
            })],
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 200, after: 100 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createBorderedCell("Team Leader:", true),
                  createBorderedCell(tidp.leader || tidp.teamLeader || 'TBD')
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell("Responsibilities:", true),
                  createBorderedCell(tidp.responsibilities || tidp.description || 'TBD')
                ]
              })
            ]
          })
        );

        if (tidp.containers && tidp.containers.length > 0) {
          sections.push(
            new Paragraph({
              text: "Information Containers:",
              bold: true
            })
          );
          tidp.containers.forEach(container => {
            sections.push(
              new Paragraph({
                text: `• ${container.name || container}`,
                indent: { left: 720 } // 0.5 inch indent
              })
            );
          });
        }
      });
    }

    if (midpData.length > 0) {
      sections.push(
        new Paragraph({
          children: [new TextRun({
            text: "Master Information Delivery Plan (MIDP)",
            bold: true,
            size: 26,
            color: "2E86AB"
          })],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: "The consolidated MIDP provides a project-wide view of all information delivery milestones:",
          spacing: { after: 200 }
        })
      );

      midpData.forEach((midp, index) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({
              text: `${midp.name || `MIDP ${index + 1}`}`,
              bold: true,
              size: 22
            })],
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 200, after: 100 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createBorderedCell("Description:", true),
                  createBorderedCell(midp.description || 'Consolidated information delivery plan')
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell("Status:", true),
                  createBorderedCell(midp.status || 'Active')
                ]
              })
            ]
          })
        );

        if (midp.milestones && midp.milestones.length > 0) {
          sections.push(
            new Paragraph({
              text: "Key Milestones:",
              bold: true
            })
          );
          midp.milestones.slice(0, 5).forEach(milestone => {
            sections.push(
              new Paragraph({
                text: `• ${milestone.name || milestone.title || milestone} - ${milestone.date || 'TBD'}`,
                indent: { left: 720 }
              })
            );
          });
          if (midp.milestones.length > 5) {
            sections.push(
              new Paragraph({
                text: `... and ${midp.milestones.length - 5} more milestones`,
                indent: { left: 720 },
                italics: true
              })
            );
          }
        }
      });
    }

    sections.push(
      new Paragraph({
        text: "Integration with BEP",
        heading: HeadingLevel.HEADING_4
      }),
      new Paragraph({
        text: "The TIDPs and MIDP defined above are integral components of this BIM Execution Plan, providing the detailed information delivery framework required by ISO 19650-2:2018. The BEP establishes the overarching information management strategy, while the TIDPs and MIDP provide the specific implementation details for each task team and the project as a whole."
      })
    );
  }

  // Group steps by category
  const groupedSteps = CONFIG.steps.reduce((acc, step, index) => {
    const cat = step.category;
    if (!acc[cat]) acc[cat] = [];
    const stepConfig = CONFIG.getFormFields(bepType, index);
    if (stepConfig) {
      acc[cat].push({ index, title: `${acc[cat].length + 1}. ${stepConfig.title.toUpperCase()}`, fields: stepConfig.fields });
    }
    return acc;
  }, {});

  Object.entries(groupedSteps).forEach(([cat, items], catIndex) => {
    sections.push(
      new Paragraph({
        children: [new TextRun({
          text: CONFIG.categories[cat].name,
          bold: true,
          size: 36,
          color: "2E86AB"
        })],
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: catIndex > 0,
        spacing: { after: 300 }
      })
    );

    items.forEach((item, itemIndex) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({
            text: item.title,
            bold: true,
            size: 28,
            color: "4A4A4A"
          })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 }
        })
      );

      const fields = item.fields;
      const tableFields = fields.filter(f => f.type !== 'textarea' && f.type !== 'checkbox' && f.type !== 'custom');
      const otherFields = fields.filter(f => f.type === 'textarea' || f.type === 'checkbox' || f.type === 'custom');

      if (tableFields.length > 0) {
        const tableRows = tableFields.map(field =>
          new TableRow({
            children: [
              createBorderedCell(field.label + ":", true),
              createBorderedCell(formData[field.name] || '')
            ]
          })
        );

        sections.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows
          })
        );
      }

      otherFields.forEach(field => {
        sections.push(
          new Paragraph({
            children: [new TextRun({
              text: field.label,
              bold: true,
              size: 22,
              color: "2E86AB"
            })],
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          })
        );

        // Add image if available
        // Temporarily disabled to test document generation
        /*
        if (componentImages && componentImages[field.name]) {
          try {
            const imageRun = addImageFromBase64(componentImages[field.name]);
            if (imageRun) {
              sections.push(
                new Paragraph({
                  children: [imageRun],
                  spacing: { after: 200 }
                })
              );
            }
          } catch (err) {
            console.warn(`Could not add image for field ${field.name}:`, err);
          }
        }
        */

        const value = formData[field.name];
        if (field.type === 'checkbox' && Array.isArray(value)) {
          value.forEach(item => {
            sections.push(
              new Paragraph({
                text: `✓ ${item}`,
                bullet: { level: 0 },
                spacing: { after: 50 }
              })
            );
          });
        } else if (field.type === 'textarea' && value) {
          // Handle multi-line text
          const lines = value.split('\n');
          lines.forEach(line => {
            sections.push(
              new Paragraph({
                text: line || '',
                spacing: { after: 100 }
              })
            );
          });
        }
      });
    });
  });

  // Footer - Document Control Information
  sections.push(
    new Paragraph({
      children: [new TextRun({
        text: "DOCUMENT CONTROL INFORMATION",
        bold: true,
        size: 28,
        color: "2E86AB"
      })],
      heading: HeadingLevel.HEADING_3,
      pageBreakBefore: true,
      spacing: { after: 200 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createBorderedCell("Document Type:", true),
            createBorderedCell("BIM Execution Plan (BEP)")
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("ISO Standard:", true),
            createBorderedCell("ISO 19650-2:2018")
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("Document Status:", true),
            createBorderedCell("Work in Progress")
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("Generated By:", true),
            createBorderedCell("Professional BEP Generator Tool")
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("Generated Date:", true),
            createBorderedCell(formattedDate)
          ]
        }),
        new TableRow({
          children: [
            createBorderedCell("Generated Time:", true),
            createBorderedCell(formattedTime)
          ]
        })
      ]
    })
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22
          },
          paragraph: {
            spacing: {
              line: 276,
              before: 100,
              after: 100
            }
          }
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