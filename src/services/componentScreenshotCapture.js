import { toPng } from 'html-to-image';
import { compressImagesBatch } from '../utils/imageCompression';

/**
 * Simplified screenshot capture service for custom visual components
 * Captures screenshots from components rendered by HiddenComponentsRenderer
 * Optimized for A4 PDF output with image compression
 */

// List of custom visual component field names and their types
// Note: namingConventions removed - rendered as HTML text instead of screenshot
const VISUAL_COMPONENTS = [
  { name: 'organizationalStructure', type: 'orgchart' },
  { name: 'leadAppointedPartiesTable', type: 'orgstructure-data-table' },
  { name: 'cdeStrategy', type: 'cdeDiagram' },
  { name: 'volumeStrategy', type: 'mindmap' },
  { name: 'fileStructureDiagram', type: 'fileStructure' },
  { name: 'federationStrategy', type: 'federation-strategy' }
];

/**
 * Capture a single component as a screenshot using html-to-image
 * Optimized for A4 PDF output (max 1200px width for print quality)
 * This library handles SVG and Canvas elements better than html2canvas
 */
const captureComponent = async (element) => {
  try {
    // Minimal wait for component to fully render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Calculate optimal dimensions for A4 PDF
    const width = element.scrollWidth;
    const height = element.scrollHeight;

    // Use 1.5x pixel ratio for good quality without excessive size
    // A4 content area ~1200px max, so 1.5x gives us up to 1800px which is plenty
    const pixelRatio = width > 800 ? 1.5 : 2; // Lower ratio for large components

    // Use html-to-image (toPng) which handles SVG/Canvas better
    const dataUrl = await toPng(element, {
      pixelRatio: pixelRatio,
      backgroundColor: '#ffffff',
      width: width,
      height: height,
      quality: 0.95, // High quality PNG
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }
    });

    return dataUrl;
  } catch (error) {
    console.error('    ❌ Error capturing component:', error);
    throw error;
  }
};

/**
 * Main function: captures all custom visual components
 * Returns a map of fieldName -> compressed base64 image data
 *
 * Strategy: Prioritize hidden components container for reliable capture
 * Images are compressed to JPEG for optimal A4 PDF output
 */
export const captureCustomComponentScreenshots = async (formData) => {
  const screenshots = {};

  console.log('📸 Starting component screenshot capture...');

  // Capture each component that has data
  for (const { name } of VISUAL_COMPONENTS) {
    // Skip if no data for this field
    if (!formData[name]) continue;

    // Find all elements with this field name
    const allElements = Array.from(document.querySelectorAll(`[data-field-name="${name}"]`));

    // Sort elements: visible first, hidden last
    allElements.sort((a, b) => {
      const aInHidden = a.closest('#hidden-components-for-pdf') !== null;
      const bInHidden = b.closest('#hidden-components-for-pdf') !== null;
      return (aInHidden ? 1 : 0) - (bInHidden ? 1 : 0);
    });

    let captured = false;

    // Try each element, starting with visible ones
    for (const element of allElements) {
      // Check if element has dimensions
      if (element.offsetWidth === 0 || element.offsetHeight === 0) continue;

      try {
        screenshots[name] = await captureComponent(element);
        captured = true;
        console.log(`  ✓ Captured ${name}`);
        break;
      } catch (error) {
        continue;
      }
    }

    if (!captured) {
      console.warn(`  ⚠ Failed to capture ${name}`);
    }
  }

  console.log(`📦 Compressing ${Object.keys(screenshots).length} images for A4 PDF...`);

  // Compress images for A4 PDF output
  const compressedScreenshots = await compressImagesBatch(screenshots, {
    maxWidth: 1200,      // A4 content width
    maxHeight: 1600,     // A4 content height
    quality: 0.85,       // Good quality JPEG
    outputFormat: 'image/jpeg'
  });

  console.log('✅ Screenshots captured and compressed');

  // Save to window for debugging
  if (typeof window !== 'undefined') {
    window.lastCapturedScreenshots = compressedScreenshots;
  }

  return compressedScreenshots;
};

/**
 * Capture a component by direct element reference (for future use)
 */
export const captureComponentByRef = async (componentRef) => {
  if (!componentRef || !componentRef.current) {
    throw new Error('Invalid component reference');
  }
  return await captureComponent(componentRef.current);
};

/**
 * Capture a component by CSS selector (for future use)
 */
export const captureComponentBySelector = async (selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Component not found: ${selector}`);
  }
  return await captureComponent(element);
};
