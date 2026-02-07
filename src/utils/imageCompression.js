/**
 * Image compression utilities for PDF generation
 * Optimizes images for A4 PDF output
 */

/**
 * Compress a base64 data URL to JPEG with quality control
 * @param {string} dataUrl - Base64 data URL (image/png or image/jpeg)
 * @param {Object} options - Compression options
 * @returns {Promise<string>} Compressed base64 data URL
 */
export const compressBase64Image = async (dataUrl, options = {}) => {
  const {
    maxWidth = 1200,        // Max width for A4 print quality
    maxHeight = 1600,       // Max height for A4 print quality
    quality = 0.85,         // JPEG quality (0-1)
    outputFormat = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate dimensions maintaining aspect ratio
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas for compression
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        // White background for JPEG (no transparency)
        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed data URL
        const compressedDataUrl = canvas.toDataURL(outputFormat, quality);

        resolve(compressedDataUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    img.src = dataUrl;
  });
};

/**
 * Compress multiple images in parallel
 * @param {Object} imagesMap - Map of fieldName -> dataUrl
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} Map of fieldName -> compressed dataUrl
 */
export const compressImagesBatch = async (imagesMap, options = {}) => {
  const entries = Object.entries(imagesMap);

  const compressed = await Promise.all(
    entries.map(async ([fieldName, dataUrl]) => {
      try {
        const compressedUrl = await compressBase64Image(dataUrl, options);
        return [fieldName, compressedUrl];
      } catch (error) {
        console.warn(`Failed to compress ${fieldName}:`, error);
        // Return original on error
        return [fieldName, dataUrl];
      }
    })
  );

  return Object.fromEntries(compressed);
};

/**
 * Get size reduction stats
 * @param {string} originalDataUrl - Original data URL
 * @param {string} compressedDataUrl - Compressed data URL
 * @returns {Object} Size statistics
 */
export const getCompressionStats = (originalDataUrl, compressedDataUrl) => {
  const originalSize = originalDataUrl.length;
  const compressedSize = compressedDataUrl.length;
  const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

  return {
    originalSizeKB: (originalSize / 1024).toFixed(2),
    compressedSizeKB: (compressedSize / 1024).toFixed(2),
    reductionPercent: reduction
  };
};

/**
 * Calculate optimal dimensions for A4 PDF
 * A4 at 150 DPI with margins: ~1000-1100px content width
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @returns {Object} Optimal dimensions
 */
export const calculateA4Dimensions = (width, height) => {
  const MAX_CONTENT_WIDTH = 1200;  // Max width for A4 content area
  const MAX_CONTENT_HEIGHT = 1600; // Max height for A4 content area

  let newWidth = width;
  let newHeight = height;

  // Scale down if larger than max
  if (width > MAX_CONTENT_WIDTH || height > MAX_CONTENT_HEIGHT) {
    const widthRatio = MAX_CONTENT_WIDTH / width;
    const heightRatio = MAX_CONTENT_HEIGHT / height;
    const ratio = Math.min(widthRatio, heightRatio);

    newWidth = Math.round(width * ratio);
    newHeight = Math.round(height * ratio);
  }

  return { width: newWidth, height: newHeight };
};
