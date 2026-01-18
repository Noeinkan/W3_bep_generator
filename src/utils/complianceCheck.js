export const checkMIDPCompliance = (midps) => {
  const compliant = midps.every(midp => {
    return midp.aggregatedData?.containers?.every(container =>
      container.loiLevel && container.format
    );
  });

  return {
    compliant,
    message: compliant
      ? 'All MIDPs are compliant with ISO 19650 standards'
      : 'Some MIDPs may not be fully compliant - check LOD/LOI details'
  };
};

// TEMPORARILY DISABLED - To be migrated to Puppeteer in the future
// This function was using jsPDF for MIDP compliance reports
export const generateComplianceReport = async (midps) => {
  console.warn('⚠️  generateComplianceReport is temporarily disabled');
  console.log('This feature will be migrated to use Puppeteer PDF generation in a future update');

  // Return success with message for now
  return {
    success: false,
    error: new Error('Compliance report generation is temporarily unavailable. Feature will be restored in next update.')
  };
};

/* ORIGINAL IMPLEMENTATION - TO BE MIGRATED TO PUPPETEER
export const generateComplianceReport = async (midps) => {
  try {
    const { default: jsPDF } = await import('jspdf');

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('MIDP Compliance Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

    // Add relationship summary
    doc.setFontSize(14);
    doc.text('TIDP-MIDP Relationship Summary', 20, 55);
    doc.setFontSize(10);
    const relationshipText = [
      'In the context of ISO 19650, TIDPs and MIDPs are key elements for BIM project planning.',
      'TIDPs provide detailed team-specific deliverables, while MIDPs integrate them into a unified plan.',
      'This hierarchical relationship ensures synchronized delivery and proactive collaboration.'
    ];

    relationshipText.forEach((line, index) => {
      doc.text(line, 20, 70 + (index * 5));
    });

    // Add compliance status
    doc.setFontSize(12);
    doc.text('Compliance Status:', 20, 100);
    const compliant = midps.every(midp =>
      midp.aggregatedData?.containers?.every(container => container.loiLevel)
    );
    doc.setFontSize(10);
    doc.text(compliant ? '✓ Compliant with ISO 19650' : '⚠ Review required', 20, 110);

    doc.save('MIDP_Compliance_Report.pdf');

    return { success: true };
  } catch (error) {
    console.error('Report generation failed:', error);
    return { success: false, error };
  }
};
*/
