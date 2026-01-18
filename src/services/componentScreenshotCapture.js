import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';

/**
 * Simplified screenshot capture service for custom visual components
 * Captures screenshots from components rendered by HiddenComponentsRenderer
 */

// List of custom visual component field names and their types
const VISUAL_COMPONENTS = [
  { name: 'organizationalStructure', type: 'orgchart' },
  { name: 'leadAppointedPartiesTable', type: 'orgstructure-data-table' },
  { name: 'cdeStrategy', type: 'cdeDiagram' },
  { name: 'volumeStrategy', type: 'mindmap' },
  { name: 'fileStructureDiagram', type: 'fileStructure' },
  { name: 'namingConventions', type: 'naming-conventions' },
  { name: 'federationStrategy', type: 'federation-strategy' }
];

/**
 * Wait for an element to be present in the DOM
 */
const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error(`Element ${selector} not found after ${timeout}ms`));
      }
    }, 100);
  });
};

/**
 * Capture a single component as a screenshot using html-to-image
 * This library handles SVG and Canvas elements better than html2canvas
 */
const captureComponent = async (element) => {
  try {
    // Minimal wait for component to fully render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Use html-to-image (toPng) which handles SVG/Canvas better
    const dataUrl = await toPng(element, {
      pixelRatio: 2, // High quality (2x)
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
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
 * Returns a map of fieldName -> base64 image data
 *
 * Strategy: Prioritize hidden components container for reliable capture
 */
export const captureCustomComponentScreenshots = async (formData) => {
  const screenshots = {};

  // Capture each component that has data
  for (const { name, type } of VISUAL_COMPONENTS) {
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
        break;
      } catch (error) {
        continue;
      }
    }
  }

  // Save to window for debugging
  if (typeof window !== 'undefined') {
    window.lastCapturedScreenshots = screenshots;
  }

  return screenshots;
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
