// Appendices Help Content
// No Step 14-specific fields currently exist in legacy helpContentData.js.
// Keep module in place so loader/step mapping is explicit and fallback remains safe.
export const appendicesHelp = {

  // === Migrated from legacy helpContentData.js ===
  responsibilityMatrix: {
      "description": "Create a RACI (Responsible, Accountable, Consulted, Informed) matrix defining task/activity responsibilities across the team.",
      "iso19650": "ISO 19650-2:2018 Section 5.1.3 - Roles and Responsibilities\n\nClear responsibility assignment ensures accountability for information production, validation, approval, and delivery.",
      "bestPractices": [
          "Use RACI format (Responsible, Accountable, Consulted, Informed)",
          "Cover all major information management activities",
          "Include model production, coordination, quality checking, approval",
          "Address CDE management and security responsibilities",
          "Ensure each activity has one Accountable party",
          "Include client and stakeholder roles where relevant"
      ],
      "aiPrompt": {
          "system": "You are a project governance specialist focusing on role definition and responsibility assignment per ISO 19650 standards.",
          "instructions": "Generate a RACI (Responsible, Accountable, Consulted, Informed) matrix for BIM project activities. Cover major information management activities including model production, model coordination, quality checking, clash detection, approval workflows, CDE management, security administration, and information delivery. Include roles such as Information Manager, Lead Appointed Party, Task Team Leaders (Architecture, Structure, MEP), BIM Coordinator, Quality Manager, and Client representatives. Ensure each activity has exactly one Accountable party. Use table format with pipe separators. Maximum 180 words.",
          "style": "table format, governance-first, unambiguous roles, concise"
      },
      "relatedFields": [
          "assignedTeamLeaders",
          "informationManagementResponsibilities"
      ]
  },
};
