import {
  Paragraph,
  TextRun,
  ExternalHyperlink,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  AlignmentType
} from 'docx';

/**
 * Converts HTML content from TipTap editor to DOCX elements
 * Handles rich text formatting: bold, italic, underline, lists, tables, links, images, etc.
 */

class HtmlToDocxConverter {
  constructor() {
    this.parser = new DOMParser();
  }

  /**
   * Main conversion method
   * @param {string} html - HTML string from TipTap
   * @returns {Array} Array of DOCX Paragraph/Table objects
   */
  convert(html) {
    if (!html || html.trim() === '') {
      return [new Paragraph({ text: '' })];
    }

    try {
      const doc = this.parser.parseFromString(html, 'text/html');
      const body = doc.body;
      return this.processNode(body);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return [new Paragraph({ text: html })];
    }
  }

  /**
   * Process a DOM node and convert to DOCX elements
   */
  processNode(node, inheritedStyles = {}) {
    const elements = [];

    for (let child of node.childNodes) {
      const nodeElements = this.processSingleNode(child, inheritedStyles);
      if (nodeElements) {
        elements.push(...nodeElements);
      }
    }

    return elements;
  }

  /**
   * Process a single node
   */
  processSingleNode(node, inheritedStyles = {}) {
    const nodeName = node.nodeName.toLowerCase();

    // Text node
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text.trim() === '') return null;
      return [new Paragraph({
        children: [new TextRun({ text, ...inheritedStyles })],
        spacing: { after: 100 }
      })];
    }

    // Element nodes
    switch (nodeName) {
      case 'p':
        return this.processParagraph(node, inheritedStyles);

      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return this.processHeading(node, nodeName, inheritedStyles);

      case 'strong':
      case 'b':
        return this.processInlineStyle(node, { ...inheritedStyles, bold: true });

      case 'em':
      case 'i':
        return this.processInlineStyle(node, { ...inheritedStyles, italics: true });

      case 'u':
        return this.processInlineStyle(node, { ...inheritedStyles, underline: {} });

      case 'mark':
        return this.processInlineStyle(node, { ...inheritedStyles, highlight: "yellow" });

      case 'code':
        return this.processInlineStyle(node, {
          ...inheritedStyles,
          font: "Courier New",
          shading: { type: "solid", fill: "F3F4F6" }
        });

      case 'ul':
        return this.processList(node, false, inheritedStyles);

      case 'ol':
        return this.processList(node, true, inheritedStyles);

      case 'table':
        return this.processTable(node);

      case 'a':
        return this.processLink(node, inheritedStyles);

      case 'img':
        return this.processImage(node);

      case 'br':
        return [new Paragraph({ text: '' })];

      case 'blockquote':
        return this.processBlockquote(node, inheritedStyles);

      case 'hr':
        return [new Paragraph({
          text: '_'.repeat(50),
          spacing: { before: 200, after: 200 }
        })];

      case 'span':
        // Handle inline styles from TipTap
        return this.processSpan(node, inheritedStyles);

      default:
        // Recursively process children for unknown elements
        return this.processNode(node, inheritedStyles);
    }
  }

  processParagraph(node, inheritedStyles) {
    const textRuns = this.extractTextRuns(node, inheritedStyles);

    if (textRuns.length === 0) {
      return [new Paragraph({ text: '', spacing: { after: 100 } })];
    }

    // Check for text alignment
    const alignment = this.getAlignment(node);

    return [new Paragraph({
      children: textRuns,
      spacing: { after: 100 },
      ...(alignment && { alignment })
    })];
  }

  processHeading(node, level, inheritedStyles) {
    const textRuns = this.extractTextRuns(node, inheritedStyles);

    const sizeMap = {
      'h1': 36, // 18pt
      'h2': 32, // 16pt
      'h3': 28, // 14pt
      'h4': 24, // 12pt
      'h5': 22, // 11pt
      'h6': 20, // 10pt
    };

    const size = sizeMap[level];

    return [new Paragraph({
      children: textRuns.map(run =>
        new TextRun({
          ...run.options,
          bold: true,
          size
        })
      ),
      spacing: { before: 200, after: 100 }
    })];
  }

  processInlineStyle(node, styles) {
    // For inline styles, we don't create paragraphs, just process children
    return this.processNode(node, styles);
  }

  processList(node, isOrdered, inheritedStyles) {
    const items = [];

    for (let child of node.children) {
      if (child.nodeName.toLowerCase() === 'li') {
        const textRuns = this.extractTextRuns(child, inheritedStyles);

        items.push(new Paragraph({
          children: textRuns,
          bullet: isOrdered
            ? { level: 0 }
            : { level: 0 },
          spacing: { after: 50 }
        }));
      }
    }

    return items;
  }

  processTable(node) {
    const rows = [];

    for (let row of node.querySelectorAll('tr')) {
      const cells = [];

      for (let cell of row.children) {
        const isHeader = cell.nodeName.toLowerCase() === 'th';
        const textRuns = this.extractTextRuns(cell, { bold: isHeader });

        cells.push(new TableCell({
          children: [new Paragraph({ children: textRuns })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
          }
        }));
      }

      if (cells.length > 0) {
        rows.push(new TableRow({ children: cells }));
      }
    }

    return rows.length > 0
      ? [new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows
        })]
      : [];
  }

  processLink(node, inheritedStyles) {
    const href = node.getAttribute('href');
    const textContent = node.textContent;

    if (!href) {
      return this.processNode(node, inheritedStyles);
    }

    return [new Paragraph({
      children: [
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: textContent,
              style: "Hyperlink",
              color: "0563C1",
              underline: {}
            })
          ],
          link: href
        })
      ],
      spacing: { after: 100 }
    })];
  }

  processImage(node) {
    const src = node.getAttribute('src');

    if (!src) return null;

    try {
      // Check if it's a base64 image
      if (src.startsWith('data:image')) {
        const base64Data = src.replace(/^data:image\/\w+;base64,/, '');
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const width = parseInt(node.getAttribute('width')) || 500;
        const height = parseInt(node.getAttribute('height')) || 350;

        return [new Paragraph({
          children: [
            new ImageRun({
              data: bytes,
              transformation: { width, height }
            })
          ],
          spacing: { after: 200 }
        })];
      } else {
        // External URL - just show the URL as text for now
        return [new Paragraph({
          text: `[Image: ${src}]`,
          spacing: { after: 100 }
        })];
      }
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  }

  processBlockquote(node, inheritedStyles) {
    const textRuns = this.extractTextRuns(node, { ...inheritedStyles, italics: true });

    return [new Paragraph({
      children: textRuns,
      spacing: { after: 100, before: 100 },
      indent: { left: 720 } // 0.5 inch indent
    })];
  }

  processSpan(node, inheritedStyles) {
    const style = node.getAttribute('style') || '';
    const newStyles = { ...inheritedStyles };

    // Parse inline styles
    if (style.includes('color:')) {
      const colorMatch = style.match(/color:\s*([^;]+)/);
      if (colorMatch) {
        const color = this.parseColor(colorMatch[1]);
        if (color) newStyles.color = color;
      }
    }

    if (style.includes('background-color:')) {
      const bgMatch = style.match(/background-color:\s*([^;]+)/);
      if (bgMatch) {
        const color = this.parseColor(bgMatch[1]);
        if (color) newStyles.highlight = color;
      }
    }

    if (style.includes('font-size:')) {
      const sizeMatch = style.match(/font-size:\s*(\d+)px/);
      if (sizeMatch) {
        newStyles.size = parseInt(sizeMatch[1]) * 2; // Convert px to half-points (approx)
      }
    }

    if (style.includes('font-family:')) {
      const fontMatch = style.match(/font-family:\s*([^;]+)/);
      if (fontMatch) {
        newStyles.font = fontMatch[1].replace(/['"]/g, '');
      }
    }

    return this.processNode(node, newStyles);
  }

  /**
   * Extract TextRuns from a node, handling nested inline elements
   */
  extractTextRuns(node, styles = {}) {
    const runs = [];

    const traverse = (n, currentStyles) => {
      if (n.nodeType === Node.TEXT_NODE) {
        const text = n.textContent;
        if (text) {
          runs.push(new TextRun({ text, ...currentStyles }));
        }
        return;
      }

      const nodeName = n.nodeName.toLowerCase();
      let newStyles = { ...currentStyles };

      // Update styles based on element
      if (nodeName === 'strong' || nodeName === 'b') {
        newStyles.bold = true;
      } else if (nodeName === 'em' || nodeName === 'i') {
        newStyles.italics = true;
      } else if (nodeName === 'u') {
        newStyles.underline = {};
      } else if (nodeName === 'mark') {
        newStyles.highlight = "yellow";
      } else if (nodeName === 'code') {
        newStyles.font = "Courier New";
        newStyles.shading = { type: "solid", fill: "F3F4F6" };
      } else if (nodeName === 'span') {
        const style = n.getAttribute('style') || '';

        if (style.includes('color:')) {
          const colorMatch = style.match(/color:\s*([^;]+)/);
          if (colorMatch) {
            const color = this.parseColor(colorMatch[1]);
            if (color) newStyles.color = color;
          }
        }

        if (style.includes('font-size:')) {
          const sizeMatch = style.match(/font-size:\s*(\d+)px/);
          if (sizeMatch) {
            newStyles.size = parseInt(sizeMatch[1]) * 2;
          }
        }
      }

      // Recursively process children
      for (let child of n.childNodes) {
        traverse(child, newStyles);
      }
    };

    traverse(node, styles);

    return runs.length > 0 ? runs : [new TextRun({ text: '', ...styles })];
  }

  /**
   * Get text alignment from node
   */
  getAlignment(node) {
    const style = node.getAttribute('style') || '';

    if (style.includes('text-align: center')) {
      return AlignmentType.CENTER;
    } else if (style.includes('text-align: right')) {
      return AlignmentType.RIGHT;
    } else if (style.includes('text-align: justify')) {
      return AlignmentType.JUSTIFIED;
    }

    return null;
  }

  /**
   * Parse color from CSS color value to hex
   */
  parseColor(colorValue) {
    colorValue = colorValue.trim();

    // Already hex
    if (colorValue.startsWith('#')) {
      return colorValue.substring(1).toUpperCase();
    }

    // RGB/RGBA
    const rgbMatch = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
      return (r + g + b).toUpperCase();
    }

    // Named colors (basic set)
    const namedColors = {
      'black': '000000',
      'white': 'FFFFFF',
      'red': 'FF0000',
      'green': '00FF00',
      'blue': '0000FF',
      'yellow': 'FFFF00',
      'cyan': '00FFFF',
      'magenta': 'FF00FF',
      'gray': '808080',
      'grey': '808080'
    };

    return namedColors[colorValue.toLowerCase()] || null;
  }
}

// Export singleton instance
const converter = new HtmlToDocxConverter();

export const convertHtmlToDocx = (html) => {
  return converter.convert(html);
};

export default converter;
