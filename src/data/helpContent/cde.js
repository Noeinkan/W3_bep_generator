// Common Data Environment (CDE) Help Content
export const cdeHelp = {
  cdeStrategy: {
    description: `Describe the overall CDE strategy including platform selection, workflow implementation, and governance approach.`,

    iso19650: `ISO 19650-1:2018 Section 5.5 - Common Data Environment

The CDE is the agreed source of information for the project, used to collect, manage, and disseminate information through a managed process.`,

    bestPractices: [
      'Define CDE platform(s) and their specific purposes',
      'Explain workflow states (WIP, Shared, Published, Archived)',
      'Address multi-platform integration if applicable',
      'Include governance and administration approach',
      'Reference security and access control strategy',
      'Address backup and business continuity'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 information management lead. Define a Common Data Environment (CDE) strategy with governance, workflow, and security controls.',
      instructions: 'Describe the overall CDE strategy. State the selected platform(s) and what each is used for, define the workflow states (WIP, Shared, Published, Archived) and how they are implemented, and explain governance (administration, ownership, audits). Reference access control/security principles and backup/business continuity at a high level. Maximum 140 words.',
      style: 'ISO 19650 tone, governance-first, clear workflow states, concise and actionable'
    },

    relatedFields: ['cdePlatforms', 'workflowStates', 'accessControl']
  },

  cdePlatforms: {
    description: `List and describe CDE platforms in use, their purposes, information types managed, and workflow integration.`,

    iso19650: `ISO 19650-1:2018 Section 5.5 - CDE Implementation

The CDE may consist of multiple integrated platforms serving different purposes while maintaining unified information governance.`,

    bestPractices: [
      'Specify each platform and its primary purpose',
      'Define information types managed by each platform',
      'Map workflow states to each platform',
      'Explain integration between platforms',
      'Include access control per platform',
      'Address cross-platform synchronization'
    ],

    aiPrompt: {
      system: 'You are a CDE administrator. Specify CDE platforms and how they integrate while maintaining ISO 19650 governance and workflow control.',
      instructions: 'List each CDE platform in use and, for each, state: purpose, information types managed, how workflow states map (WIP/Shared/Published/Archived), key user groups/roles, and how the platform integrates with others (sync, links, single source of truth, naming/metadata). Include a brief note on access controls per platform. Maximum 160 words.',
      style: 'structured per-platform bullets, integration clarity, no marketing language, concise'
    },

    relatedFields: ['cdeStrategy', 'workflowStates', 'accessControl']
  },

  workflowStates: {
    description: `Define the CDE workflow states (WIP, Shared, Published, Archived) and transition criteria between states.`,

    iso19650: `ISO 19650-1:2018 Section 5.5.2 - Information States

Workflow states define the status and accessibility of information as it progresses from work-in-progress through to archival.`,

    bestPractices: [
      'Define all four workflow states clearly (WIP, Shared, Published, Archived)',
      'Specify access permissions for each state',
      'Define transition criteria between states',
      'Include approval requirements for state changes',
      'Address quality checking before progression',
      'Implement automated workflows where possible'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 information manager. Define CDE workflow states and objective transition criteria with clear approvals and quality gates.',
      instructions: 'Define WIP, Shared, Published, and Archived. For each state include: intent/purpose, who can access (read/write), and typical content. Then define transition criteria between states, including required checks (model/document QA), approvals/authorizations, and how status/suitability is recorded. Keep it practical and enforceable. Maximum 170 words.',
      style: 'state-by-state structure, criteria-driven, audit-friendly, concise'
    },

    relatedFields: ['cdeStrategy', 'approvalWorkflows', 'accessControl']
  },

  accessControl: {
    description: `Define access control policies including role-based permissions, authentication, and security protocols.`,

    iso19650: `ISO 19650-1:2018 Section 5.6 - Information Security

Access control ensures only authorized personnel can access, modify, or approve information based on their role and responsibilities.`,

    bestPractices: [
      'Implement role-based access control (RBAC)',
      'Use Single Sign-On (SSO) where possible',
      'Require multi-factor authentication (MFA)',
      'Define read/write permissions by discipline and workflow state',
      'Include guest access protocols with time limits',
      'Regular access audits and permission reviews',
      'Document access request and approval process'
    ],

    aiPrompt: {
      system: 'You are an information security lead for a BIM project. Define role-based access control for a CDE in line with ISO 19650 information management.',
      instructions: 'Specify access control policies for the CDE. Include RBAC roles (e.g., Admin, Information Manager, Discipline Lead, Author, Client, Contractor), authentication (SSO/MFA), permissions by workflow state (WIP/Shared/Published/Archived), and an access request/approval and periodic review process. Include guest/external access time limits and audit logging expectations. Maximum 170 words.',
      style: 'policy-style, least-privilege, role/state matrix mindset, concise'
    },

    relatedFields: ['cdeStrategy', 'workflowStates', 'securityMeasures']
  },

  securityMeasures: {
    description: `Define comprehensive security measures protecting information confidentiality, integrity, and availability.`,

    iso19650: `ISO 19650-1:2018 Section 5.6 - Information Security

Security measures must protect information from unauthorized access, modification, or loss throughout the information lifecycle.`,

    bestPractices: [
      'Implement end-to-end encryption (AES-256)',
      'Use SSL/TLS for all data transmission',
      'Regular security audits and penetration testing',
      'ISO 27001 certified infrastructure where possible',
      'Automated malware scanning',
      'GDPR and data residency compliance',
      'Security incident response procedures'
    ],

    aiPrompt: {
      system: 'You are a project information security specialist. Define proportionate security measures protecting confidentiality, integrity, and availability of BIM information.',
      instructions: 'Describe security measures for the project information environment. Cover encryption in transit (TLS) and at rest (e.g., AES-256), malware scanning, vulnerability management (patching, audits/pen tests), logging/monitoring, secure configuration, and incident response (detection, containment, reporting, lessons learned). Note GDPR/data residency where relevant. Keep it practical and aligned to CDE operations. Maximum 160 words.',
      style: 'risk-based, operational controls, clear bullets, concise'
    },

    relatedFields: ['accessControl', 'backupProcedures', 'encryptionRequirements']
  },

  backupProcedures: {
    description: `Define backup and disaster recovery procedures ensuring information protection and business continuity.`,

    iso19650: `ISO 19650-1:2018 Section 5.6 - Information Protection

Backup procedures must ensure information can be recovered in case of data loss, corruption, or system failure.`,

    bestPractices: [
      'Automated daily backups with 30-day retention',
      'Weekly full system backups with extended retention',
      'Geo-redundant storage across multiple data centers',
      'Define Recovery Point Objective (RPO) and Recovery Time Objective (RTO)',
      'Regular backup integrity testing',
      'Documented restoration procedures',
      'Monthly backup verification reports'
    ],

    aiPrompt: {
      system: 'You are an IT resilience lead supporting ISO 19650 information management. Define backup and disaster recovery procedures for a CDE and project data.',
      instructions: 'Define backup and disaster recovery arrangements. Include backup frequency (daily incremental, weekly full), retention periods, offsite/geo-redundant storage, and RPO/RTO targets. Describe integrity testing, restoration steps and responsibilities, and how backup status is reported (e.g., monthly verification). Mention business continuity considerations for CDE outages. Maximum 170 words.',
      style: 'operational, measurable (RPO/RTO/retention), responsibilities clear, concise'
    },

    relatedFields: ['cdeStrategy', 'securityMeasures', 'contingencyPlans']
  }
};
