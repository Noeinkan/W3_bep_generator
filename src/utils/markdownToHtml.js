/**
 * Markdown to HTML Converter for TipTap Editor
 *
 * Converts AI-generated markdown text into clean, professional HTML
 * that renders beautifully in TipTap editor.
 */

/**
 * Convert markdown text to TipTap-compatible HTML
 * @param {string} markdown - The markdown text to convert
 * @returns {string} - Clean HTML ready for TipTap with proper spacing
 */
export function markdownToTipTapHtml(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // Pre-process: Add newlines before numbered lists and after periods for better structure
  // This helps when AI generates continuous text without proper line breaks
  let processed = markdown;

  // Add newline before numbered lists (1. 2. 3. etc.)
  processed = processed.replace(/(\S)\s+(\d+\.)\s+/g, '$1\n$2 ');

  // Add newline before bullet points if they appear mid-text
  processed = processed.replace(/(\S)\s+([•\*\-])\s+/g, '$1\n$2 ');

  // Add newline before common section headers (words ending with colon at sentence start)
  processed = processed.replace(/\.\s+([A-Z][^.?!:]{3,30}:)/g, '.\n\n$1');

  // Split by lines first to process line-by-line
  const lines = processed.split('\n');
  const htmlBlocks = [];

  let inBulletList = false;
  let bulletListItems = [];
  let inNumberedList = false;
  let numberedListItems = [];

  const processBold = (text) => text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/__(.+?)__/g, '<strong>$1</strong>');
  const processItalic = (text) => text.replace(/\*([^\*]+?)\*/g, '<em>$1</em>').replace(/_([^_]+?)_/g, '<em>$1</em>');
  const processInlineFormatting = (text) => {
    let result = processBold(text);
    result = processItalic(result);
    result = result.replace(/`(.+?)`/g, '<code>$1</code>');
    result = result.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    return result;
  };

  const closeBulletList = () => {
    if (inBulletList && bulletListItems.length > 0) {
      htmlBlocks.push('<ul>');
      bulletListItems.forEach(item => htmlBlocks.push(`<li><p>${processInlineFormatting(item)}</p></li>`));
      htmlBlocks.push('</ul>');
      bulletListItems = [];
      inBulletList = false;
    }
  };

  const closeNumberedList = () => {
    if (inNumberedList && numberedListItems.length > 0) {
      htmlBlocks.push('<ol>');
      numberedListItems.forEach(item => htmlBlocks.push(`<li><p>${processInlineFormatting(item)}</p></li>`));
      htmlBlocks.push('</ol>');
      numberedListItems = [];
      inNumberedList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line - close any open lists
    if (!trimmed) {
      closeBulletList();
      closeNumberedList();
      return;
    }

    // Headings with # markers
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeBulletList();
      closeNumberedList();
      const level = headingMatch[1].length;
      const text = processInlineFormatting(headingMatch[2]);
      htmlBlocks.push(`<h${level}>${text}</h${level}>`);
      return;
    }

    // Detect section headers (lines ending with colon, capitalized, no punctuation before)
    const sectionHeaderMatch = trimmed.match(/^([A-Z][^.?!]{3,60}):$/);
    if (sectionHeaderMatch) {
      closeBulletList();
      closeNumberedList();
      htmlBlocks.push(`<h4>${processInlineFormatting(sectionHeaderMatch[1])}</h4>`);
      return;
    }

    // Detect standalone capitalized titles (short lines, all caps or title case, no punctuation at end)
    if (trimmed.length < 60 && trimmed.length > 5 &&
        /^[A-Z]/.test(trimmed) &&
        !/[.!?]$/.test(trimmed) &&
        (trimmed === trimmed.toUpperCase() || /^[A-Z][a-z\s]+([A-Z][a-z\s]+)*$/.test(trimmed))) {
      // Check if next line exists and is normal text (not a list)
      const nextLine = lines[index + 1]?.trim();
      if (nextLine && !nextLine.match(/^[\d•\*\-]/)) {
        closeBulletList();
        closeNumberedList();
        htmlBlocks.push(`<h4>${processInlineFormatting(trimmed)}</h4>`);
        return;
      }
    }

    // Bullet lists (•, *, -)
    const bulletMatch = trimmed.match(/^[•\*\-]\s+(.+)$/);
    if (bulletMatch) {
      closeNumberedList();
      inBulletList = true;
      bulletListItems.push(bulletMatch[1]);
      return;
    }

    // Numbered lists (1. or 1))
    const numberedMatch = trimmed.match(/^\d+[\.\)]\s+(.+)$/);
    if (numberedMatch) {
      closeBulletList();
      inNumberedList = true;
      numberedListItems.push(numberedMatch[1]);
      return;
    }

    // Blockquote
    const quoteMatch = trimmed.match(/^>\s+(.+)$/);
    if (quoteMatch) {
      closeBulletList();
      closeNumberedList();
      htmlBlocks.push(`<blockquote><p>${processInlineFormatting(quoteMatch[1])}</p></blockquote>`);
      return;
    }

    // Horizontal rule
    if (trimmed.match(/^[\-\*]{3,}$/)) {
      closeBulletList();
      closeNumberedList();
      htmlBlocks.push('<hr />');
      return;
    }

    // Regular paragraph
    closeBulletList();
    closeNumberedList();
    htmlBlocks.push(`<p>${processInlineFormatting(trimmed)}</p>`);
  });

  // Close any remaining lists
  closeBulletList();
  closeNumberedList();

  // Join with nothing - TipTap will handle the spacing
  return htmlBlocks.join('');
}

/**
 * Clean markdown artifacts from plain text
 * (Alternative lighter approach if full conversion isn't needed)
 */
export function cleanMarkdownArtifacts(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleaned = text;

  // Remove ** for bold
  cleaned = cleaned.replace(/\*\*/g, '');

  // Remove * for italic/bullets (keep the content)
  cleaned = cleaned.replace(/^\s*[\*\-•]\s+/gm, '');

  // Remove # for headings
  cleaned = cleaned.replace(/^#+\s+/gm, '');

  // Remove > for blockquotes
  cleaned = cleaned.replace(/^>\s+/gm, '');

  // Remove numbered list markers
  cleaned = cleaned.replace(/^\s*\d+[\.\)]\s+/gm, '');

  return cleaned.trim();
}

export default markdownToTipTapHtml;
