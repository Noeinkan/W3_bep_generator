/**
 * Debug utilities for screenshot capture
 * Use these in the browser console to diagnose issues
 */

/**
 * Check if hidden components are present in the DOM
 */
export const checkHiddenComponents = () => {
  const container = document.querySelector('#hidden-components-for-pdf');

  if (!container) {
    console.error('❌ Hidden components container NOT FOUND');
    return false;
  }

  console.log('✅ Hidden components container found');
  console.log('Container dimensions:', container.offsetWidth, 'x', container.offsetHeight);
  console.log('Container position:', window.getComputedStyle(container).position);
  console.log('Container left:', window.getComputedStyle(container).left);

  const components = container.querySelectorAll('[data-field-name]');
  console.log(`Found ${components.length} components with data-field-name attribute:`);

  components.forEach(comp => {
    const name = comp.getAttribute('data-field-name');
    const type = comp.getAttribute('data-component-type');
    console.log(`  - ${name} (${type}): ${comp.offsetWidth}x${comp.offsetHeight}px`);
  });

  return true;
};

/**
 * Check all elements with data-field-name in the entire document
 */
export const checkAllFieldElements = () => {
  const elements = document.querySelectorAll('[data-field-name]');
  console.log(`Found ${elements.length} total elements with data-field-name:`);

  elements.forEach(el => {
    const name = el.getAttribute('data-field-name');
    const type = el.getAttribute('data-component-type');
    const inHidden = el.closest('#hidden-components-for-pdf') !== null;
    console.log(`  - ${name} (${type}): ${el.offsetWidth}x${el.offsetHeight}px [${inHidden ? 'HIDDEN' : 'VISIBLE'}]`);
  });
};

/**
 * Test capturing a specific component
 */
export const testCaptureComponent = async (fieldName) => {
  const html2canvas = (await import('html2canvas')).default;

  const selector = `#hidden-components-for-pdf [data-field-name="${fieldName}"]`;
  const element = document.querySelector(selector);

  if (!element) {
    console.error(`❌ Element not found: ${selector}`);
    return null;
  }

  console.log(`✅ Element found: ${element.offsetWidth}x${element.offsetHeight}px`);
  console.log('Capturing...');

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: true,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true
    });

    console.log(`✅ Captured: ${canvas.width}x${canvas.height}px`);

    // Open in new window to verify
    const dataUrl = canvas.toDataURL('image/png');
    const newWindow = window.open();
    newWindow.document.write(`<img src="${dataUrl}" />`);

    return dataUrl;
  } catch (error) {
    console.error('❌ Capture failed:', error);
    return null;
  }
};

// Make available in console
if (typeof window !== 'undefined') {
  window.debugScreenshots = {
    checkHiddenComponents,
    checkAllFieldElements,
    testCaptureComponent
  };

  console.log('📸 Debug tools loaded. Available commands:');
  console.log('  window.debugScreenshots.checkHiddenComponents()');
  console.log('  window.debugScreenshots.checkAllFieldElements()');
  console.log('  window.debugScreenshots.testCaptureComponent("organizationalStructure")');
}
