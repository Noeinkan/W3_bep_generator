/**
 * Enhanced MIDP compliance checking against ISO 19650 requirements.
 * Checks: LOI/format, required fields, TIDP completeness, naming conventions,
 * date consistency, and discipline coverage.
 * @param {Array} midps - Array of MIDP objects
 * @returns {Object} Structured compliance results with per-rule findings
 */
export const checkMIDPCompliance = (midps) => {
  const findings = [];
  let totalChecks = 0;
  let passedChecks = 0;

  midps.forEach((midp, midpIndex) => {
    const midpLabel = midp.projectName || `MIDP ${midpIndex + 1}`;
    const containers = midp.aggregatedData?.containers || [];
    const includedTidps = midp.includedTIDPs || [];

    // Rule 1: LOI + Format exist on each container
    containers.forEach(container => {
      totalChecks++;
      const loiLevel = container.loiLevel || container['LOI Level'] || container.loin;
      const format = container.format || container['Format/Type'];
      if (loiLevel && format) {
        passedChecks++;
      } else {
        const missing = [];
        if (!loiLevel) missing.push('LOI/LOD level');
        if (!format) missing.push('Format');
        findings.push({
          rule: 'LOI & Format',
          severity: 'warning',
          midp: midpLabel,
          container: container.name || container.containerName || container.id,
          message: `Missing: ${missing.join(', ')}`
        });
      }
    });

    // Rule 2: Required fields check (due date, responsible party, acceptance criteria)
    containers.forEach(container => {
      totalChecks++;
      const dueDate = container.dueDate || container['Due Date'];
      const responsible = container.responsibleParty || container['Responsible Task Team/Party'] || container.team;
      const acceptance = container.acceptanceCriteria || container['Acceptance Criteria'];
      const missingFields = [];
      if (!dueDate) missingFields.push('Due Date');
      if (!responsible) missingFields.push('Responsible Party');
      if (!acceptance) missingFields.push('Acceptance Criteria');
      if (missingFields.length === 0) {
        passedChecks++;
      } else {
        findings.push({
          rule: 'Required Fields',
          severity: 'error',
          midp: midpLabel,
          container: container.name || container.containerName || container.id,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
    });

    // Rule 3: TIDP completeness (leader, discipline, at least 1 container)
    if (midp.aggregatedData?.disciplines) {
      totalChecks++;
      if (midp.aggregatedData.disciplines.length > 0 && includedTidps.length > 0) {
        passedChecks++;
      } else {
        findings.push({
          rule: 'TIDP Completeness',
          severity: 'error',
          midp: midpLabel,
          message: 'MIDP should include at least one TIDP with a defined discipline and containers'
        });
      }
    }

    // Rule 4: Naming convention validation — container IDs should follow a pattern
    containers.forEach(container => {
      totalChecks++;
      const containerId = container.containerId || container['Information Container ID'] || container.id;
      // ISO 19650 suggests structured naming; check for basic alphanumeric-with-separators pattern
      if (containerId && /^[A-Za-z0-9][\w\-\.]+$/.test(containerId)) {
        passedChecks++;
      } else {
        findings.push({
          rule: 'Naming Convention',
          severity: 'info',
          midp: midpLabel,
          container: container.name || container.containerName || containerId,
          message: `Container ID "${containerId || '(empty)'}" may not follow recommended naming pattern`
        });
      }
    });

    // Rule 5: Date consistency — due dates should not precede MIDP creation
    containers.forEach(container => {
      const dueDate = container.dueDate || container['Due Date'];
      if (dueDate) {
        totalChecks++;
        const due = new Date(dueDate);
        if (!isNaN(due.getTime())) {
          passedChecks++;
        } else {
          findings.push({
            rule: 'Date Consistency',
            severity: 'warning',
            midp: midpLabel,
            container: container.name || container.containerName || container.id,
            message: `Invalid due date: "${dueDate}"`
          });
        }
      }
    });

    // Rule 6: Discipline coverage — check that MIDP covers multiple disciplines for a meaningful plan
    totalChecks++;
    const disciplineCount = midp.aggregatedData?.disciplines?.length || 0;
    if (disciplineCount >= 2) {
      passedChecks++;
    } else {
      findings.push({
        rule: 'Discipline Coverage',
        severity: 'info',
        midp: midpLabel,
        message: `Only ${disciplineCount} discipline(s) covered. ISO 19650 recommends multi-discipline coordination.`
      });
    }
  });

  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;
  const compliant = findings.filter(f => f.severity === 'error').length === 0;

  return {
    compliant,
    score,
    totalChecks,
    passedChecks,
    findings,
    summary: {
      errors: findings.filter(f => f.severity === 'error').length,
      warnings: findings.filter(f => f.severity === 'warning').length,
      info: findings.filter(f => f.severity === 'info').length
    },
    message: compliant
      ? `Compliant (${score}% score) - ${findings.length} recommendation${findings.length !== 1 ? 's' : ''}`
      : `Non-compliant (${score}% score) - ${findings.filter(f => f.severity === 'error').length} error(s) found`
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
