// Information Security and Privacy Help Content
export const securityPrivacyHelp = {
  dataClassification: {
    description: `Define data classification levels and corresponding security controls to protect sensitive project information.

Establish classification levels such as:
• Public: Information suitable for public release
• Internal: Information for project team use only
• Confidential: Sensitive commercial or proprietary information
• Restricted: Highly sensitive information requiring strict controls

For each level, define access controls, encryption requirements, sharing restrictions, and retention policies.`,

    iso19650: `ISO 19650-5:2020 - Security-Minded Approach to Information Management

Data classification is fundamental to information security, ensuring appropriate protection measures are applied based on information sensitivity.`,

    bestPractices: [
      'Define 3-4 classification levels appropriate to project risk',
      'Apply classification labels to all project information',
      'Align classification with client information security policies',
      'Define handling requirements for each classification level',
      'Implement need-to-know access controls',
      'Establish de-classification procedures for handover',
      'Train team on classification system and responsibilities',
      'Audit classification compliance regularly'
    ],

    examples: {
      'Commercial Building': `Data classification framework:

**PUBLIC**
Description: Non-sensitive information suitable for public release
Examples: Marketing visualizations, project overview, sustainability credentials
Access Controls: Publicly accessible
Encryption: Not required
Sharing: Unrestricted
Retention: Permanent archive

**INTERNAL**
Description: General project information for authorized project team
Examples: Design models, coordination reports, meeting minutes
Access Controls: Project team members only, role-based access
Encryption: In transit (SSL/TLS)
Sharing: Secure CDE sharing only, no email attachments >10MB
Retention: 7 years post-completion

**CONFIDENTIAL**
Description: Sensitive commercial information
Examples: Cost estimates, contractor pricing, commercial negotiations
Access Controls: Named individuals only, multi-factor authentication
Encryption: In transit and at rest (AES-256)
Sharing: Encrypted file transfer only, watermarked documents
Retention: 10 years, secure destruction

**RESTRICTED**
Description: Highly sensitive information requiring maximum protection
Examples: Security systems design, client confidential data, personal information
Access Controls: Explicit authorization required, access logged
Encryption: Military-grade encryption, secure enclaves
Sharing: Prohibited without written authorization
Retention: Defined by legal/contractual requirements`,

      'Infrastructure': `Infrastructure security classification:

**PUBLIC**
Examples: Planning visualizations, community engagement materials

**OFFICIAL**
Description: Routine project information (Government Security Classification)
Examples: General design drawings, non-sensitive correspondence
Access: Vetted project team personnel
Encryption: TLS for transmission

**OFFICIAL-SENSITIVE**
Description: Information requiring protection from unauthorized disclosure
Examples: Detailed infrastructure drawings, utilities diversions
Access: Security-cleared personnel only
Encryption: End-to-end encryption, secure storage
Sharing: Secure government networks (PSN, GSI)
Handling: Controlled print, numbered copies, destruction logs

**SECRET** (if applicable)
Description: National security sensitive information
Examples: Critical national infrastructure details, counter-terrorism measures
Access: SC/DV cleared personnel only
Encryption: CESG-approved encryption
Sharing: Secure government networks only, face-to-face meetings
Handling: Maximum security protocols, secure facilities only`
    },

    commonMistakes: [
      'No classification system defined - all data treated equally',
      'Over-classification making collaboration difficult',
      'Under-classification exposing sensitive information',
      'Classification labels not applied to documents',
      'No enforcement of classification handling requirements',
      'Missing alignment with client security policies',
      'Team not trained on classification system',
      'No audit or monitoring of classification compliance'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650-5 information security specialist. Define data classification levels and handling controls suitable for project information management.',
      instructions: 'Define 3-4 data classification levels and, for each, specify: typical examples, access controls (role/need-to-know), encryption requirements (in transit/at rest), sharing restrictions, and retention/disposal. Include requirements for labelling/metadata, training/awareness, and periodic audits. Keep controls proportionate and aligned to client security policies. Maximum 180 words.',
      style: 'security-minded, policy-style, level-by-level structure, concise'
    },

    relatedFields: ['accessPermissions', 'encryptionRequirements', 'dataTransferProtocols', 'privacyConsiderations']
  },

  accessPermissions: {
    description: `Define access control policies and permissions ensuring information is accessible only to authorized personnel based on role and need-to-know.

Specify:
• Role-based access control (RBAC) framework
• Permission levels (read, write, edit, delete, share)
• Access request and approval procedures
• Access review and recertification processes
• Guest/external party access protocols
• Access revocation procedures (leavers, project completion)`,

    iso19650: `ISO 19650-5:2020 Section 7 - Information Security Management

Access controls ensure that information is only accessible to authorized individuals, preventing unauthorized disclosure, modification, or deletion.`,

    bestPractices: [
      'Implement role-based access control (RBAC) aligned with project roles',
      'Follow principle of least privilege - minimum access needed for role',
      'Define permission levels clearly (view, edit, approve, share)',
      'Require approval workflow for access requests',
      'Implement multi-factor authentication for remote access',
      'Conduct quarterly access reviews and recertification',
      'Revoke access immediately upon personnel departure',
      'Maintain audit logs of access grants and revocations'
    ],

    examples: {
      'Commercial Building': `Access control framework:

**Role-Based Access Control:**

Project Administrator:
• Full access to all project folders and workflow states
• User management and access granting authority
• CDE configuration and security settings
• Audit log access

Discipline Lead:
• Full access to own discipline folders (read/write/delete)
• Read access to other disciplines' Shared/Published models
• Cannot access financial/commercial folders
• Can approve models for own discipline

Design Team Member:
• Read/write access to own discipline WIP folder
• Read-only access to Shared folder (all disciplines)
• Read-only access to Published folder
• Cannot publish or approve models

Client Representative:
• Read-only access to Shared and Published folders
• Comment and markup permissions
• Cannot modify or delete project information
• Access to reports and dashboards

Contractor (Construction Phase):
• Read access to Published construction models
• Write access to site progress/as-built folders
• Cannot access pre-construction commercial data
• Time-limited access (contract duration only)

External Consultant:
• Access limited to specific folders relevant to scope
• Time-limited access (engagement duration)
• Cannot download bulk data
• Activity monitored and logged

**Access Request Workflow:**
1. Submit access request via CDE portal
2. Line manager approval
3. Information Manager verification
4. Access granted with expiry date
5. Welcome email with security guidelines
6. Quarterly access review and revalidation`,

      'Infrastructure': `Government infrastructure access control:

**Security Clearance-Based Access:**

SC Cleared Personnel (Security Check):
• Access to OFFICIAL-SENSITIVE information
• Full design model access
• Critical infrastructure details
• Subject to 5-year reclearance

BPSS Cleared Personnel (Baseline Personnel Security Standard):
• Access to OFFICIAL information only
• General design information
• Non-sensitive project data
• Annual recertification

Guest Access (Uncleared):
• PUBLIC information only
• Visualization models only
• Supervised access required
• Maximum 30-day duration

**Need-to-Know Enforcement:**
Even with appropriate clearance, access granted only for specific project need
Access logged and auditable
Periodic access reviews by security manager
Immediate revocation upon project departure or role change`
    },

    commonMistakes: [
      'No role-based access control - everyone has full access',
      'Excessive permissions granted (more than needed for role)',
      'No access request approval workflow',
      'Access not revoked when personnel leave project',
      'No periodic access reviews leading to permission creep',
      'Guest/external access not time-limited',
      'No audit logs of who accessed what information',
      'Missing multi-factor authentication for remote access'
    ],

    relatedFields: ['dataClassification', 'accessControl', 'securityMeasures', 'workflowStates']
  },

  encryptionRequirements: {
    description: `Define encryption requirements ensuring information confidentiality during transmission, storage, and backup.

Specify encryption for:
• Data in transit (network transmission, file transfers)
• Data at rest (CDE storage, backups, archives)
• End-to-end encryption for sensitive communications
• Encryption key management and rotation
• Compliance with industry standards (AES-256, TLS 1.2+)`,

    iso19650: `ISO 19650-5:2020 Section 8.3 - Cryptographic Controls

Encryption protects information from unauthorized access during transmission and storage, ensuring confidentiality even if physical security is breached.`,

    bestPractices: [
      'AES-256 encryption for data at rest (storage, backups)',
      'TLS 1.2 or higher for data in transit (network communications)',
      'End-to-end encryption for highly sensitive information',
      'Encrypt all mobile devices and removable media',
      'Implement certificate-based encryption for CDE access',
      'Define encryption key management and rotation policies',
      'Ensure cloud storage providers meet encryption standards',
      'Encrypt email attachments containing sensitive information'
    ],

    examples: {
      'Commercial Building': `Encryption framework:

**Data at Rest:**
• CDE cloud storage: AES-256 encryption (Microsoft Azure/AWS standard)
• Local workstation storage: BitLocker full disk encryption
• Backup systems: AES-256 encryption with separate key management
• Archive storage: Encrypted compressed archives (7-Zip AES-256)
• Mobile devices: Device-level encryption (iOS/Android native)
• USB drives: VeraCrypt or BitLocker To Go encryption required

**Data in Transit:**
• CDE access: TLS 1.3 with certificate pinning
• VPN connections: IPSec with AES-256-GCM encryption
• File transfers: SFTP or HTTPS only (no FTP/HTTP)
• Email: TLS encryption for all SMTP traffic
• Large file transfers: Encrypted file transfer services (ShareFile, Citrix)

**Key Management:**
• Encryption keys stored in hardware security modules (HSM)
• Key rotation every 12 months
• Separate keys for different data classification levels
• Key escrow for business continuity (dual control)
• Secure key deletion procedures for decommissioned systems

**Sensitive Communications:**
• Financial information: Encrypted email with read receipts
• Personal data: End-to-end encrypted messaging (Signal, Teams E2E)
• Commercial negotiations: Encrypted virtual data rooms
• Security information: Government-approved encryption (CESG)`,

      'Infrastructure': `Government-grade encryption:

**OFFICIAL-SENSITIVE Data:**
• Encryption: CESG-approved product (TLS 1.2+, AES-256)
• Storage: Government-approved cloud (G-Cloud framework)
• Transmission: Secure government networks (PSN, GSI)
• Key management: Public Key Infrastructure (PKI)

**Physical Media:**
• Encrypted USB drives only (FIPS 140-2 Level 2 certified)
• Encrypted external hard drives for large data transfers
• Secure destruction of encryption keys when media retired

**Email Security:**
• TLS encryption for all external email
• S/MIME or PGP for sensitive attachments
• DLP (Data Loss Prevention) scanning before sending
• Encrypted email gateway for government correspondence`
    },

    commonMistakes: [
      'No encryption for data at rest (unencrypted CDE storage)',
      'Using outdated encryption protocols (TLS 1.0, SSL)',
      'Unencrypted backup systems exposing sensitive data',
      'No encryption for mobile devices or USB drives',
      'Missing encryption key management and rotation procedures',
      'Email attachments sent unencrypted',
      'Cloud storage without encryption verification',
      'No policy for secure key storage and escrow'
    ],

    relatedFields: ['securityMeasures', 'dataClassification', 'dataTransferProtocols', 'backupProcedures']
  },

  dataTransferProtocols: {
    description: `Define secure protocols and procedures for transferring information between project team members, external parties, and client systems.

Specify protocols for:
• Internal file transfers within project team
• External file transfers to client and stakeholders
• Large file transfer procedures
• Secure email communications
• Mobile and remote access
• Third-party data exchange`,

    iso19650: `ISO 19650-5:2020 Section 8.2 - Communications Security

Secure data transfer protocols prevent unauthorized interception, modification, or disclosure of information during exchange.`,

    bestPractices: [
      'Use CDE for primary file sharing (not email attachments)',
      'Implement secure file transfer for large files (SFTP, managed file transfer)',
      'Encrypt all email attachments containing sensitive information',
      'Prohibit use of consumer file-sharing services (Dropbox, WeTransfer personal)',
      'Require VPN for remote access to project systems',
      'Implement data loss prevention (DLP) scanning',
      'Define maximum file size for email attachments (e.g., 10MB)',
      'Maintain transfer logs for audit and compliance'
    ],

    examples: {
      'Commercial Building': `Data transfer protocols:

**Internal Team File Sharing:**
• Primary Method: CDE (BIM 360, Aconex)
  - Automatic encryption in transit (TLS)
  - Version control and audit trails
  - Role-based access control
• Secondary Method: Secure network shares (SMB 3.0 encrypted)
• Prohibited: Email attachments >10MB, personal cloud services

**External File Transfers:**
• Client Deliverables: CDE Published folder with automated notification
• Large Files to External Parties: Citrix ShareFile (encrypted links, expiry dates)
• Email Attachments: Maximum 10MB, encrypted if confidential
• Physical Media: Encrypted USB drives with courier tracking

**Secure Email:**
• Standard Email: TLS encryption automatic (Office 365/Google Workspace)
• Confidential Attachments: Password-protected ZIP or PDF encryption
• Highly Sensitive: S/MIME encrypted email or secure portal
• External Email: Warning banner on classification level

**Remote Access:**
• VPN Required: IPSec VPN with multi-factor authentication
• Cloud CDE Access: Certificate-based authentication + MFA
• Mobile Access: MDM (Mobile Device Management) enrolled devices only
• Public WiFi: VPN mandatory before accessing project data

**Third-Party Data Exchange:**
• Contractors: Dedicated CDE folders with time-limited access
• Consultants: VPN access to specific network shares
• Suppliers: Secure vendor portal for product data
• Regulatory Authorities: Secure government file transfer (Egress, Galaxkey)

**Data Loss Prevention (DLP):**
• Email scanning for sensitive information (cost data, personal info)
• Automatic encryption trigger for keywords (confidential, budget, personal)
• Block unauthorized cloud upload attempts
• Alert for large data exfiltration attempts`,

      'Infrastructure': `Government infrastructure data transfer:

**OFFICIAL Data Transfer:**
• Government Secure Network: PSN (Public Services Network)
• Secure Email: GSI (Government Secure Intranet) email
• File Transfer: Secure FTP to government systems
• Courier: Approved government courier services

**OFFICIAL-SENSITIVE Transfer:**
• Transmission: Encrypted channels only (CESG-approved)
• Email: S/MIME or PGP encryption mandatory
• Physical Media: Encrypted drives with dual-lock courier
• Hand Delivery: Signed receipt required
• Destruction: Certificate of secure destruction

**External Stakeholder Transfer:**
• Planning Authority: Secure planning portal upload
• Statutory Undertakers: Encrypted email or secure web portal
• Local Authorities: Government-approved file sharing (Egress)
• Public Consultation: Redacted documents on public portal (PUBLIC classification only)`
    },

    commonMistakes: [
      'Relying on email attachments for large file transfers',
      'Using consumer file-sharing services without encryption',
      'No restrictions on email attachment size or type',
      'Missing VPN requirement for remote access',
      'Unencrypted physical media for data transfer',
      'No data loss prevention scanning',
      'External parties granted direct CDE access without controls',
      'No audit logging of data transfers'
    ],

    relatedFields: ['encryptionRequirements', 'accessPermissions', 'securityMeasures', 'cdeStrategy']
  },

  privacyConsiderations: {
    description: `Define privacy protection measures ensuring compliance with UK GDPR and Data Protection Act 2018, particularly for personal data captured in project information.

Address:
• Identification of personal data in project information
• Lawful basis for processing personal data
• Data minimization and retention policies
• Individual rights (access, rectification, erasure)
• Data protection impact assessments (DPIA)
• Third-party data processor agreements
• Data breach notification procedures`,

    iso19650: `ISO 19650-5:2020 Section 5.3 - Legal and Regulatory Requirements

Privacy considerations ensure compliance with data protection legislation, protecting individuals' rights and avoiding significant legal and reputational risks.`,

    bestPractices: [
      'Identify and document all personal data in project (staff, clients, residents)',
      'Minimize personal data collection - only what is necessary',
      'Define retention periods and secure deletion procedures',
      'Establish procedures for data subject access requests',
      'Conduct DPIA for projects involving significant personal data',
      'Ensure third-party contracts include data processor clauses',
      'Implement data breach detection and notification procedures',
      'Appoint Data Protection Officer (DPO) or privacy lead',
      'Train team on GDPR obligations and privacy awareness'
    ],

    examples: {
      'Commercial Building': `Privacy protection framework:

**Personal Data Identification:**
• Project Personnel: Names, contact details, signatures, photographs
• Client Representatives: Contact information, site visit records
• Site Workers: Names, CSCS card details, access logs, inductions
• Building Users: Tenant contact details, accessibility requirements
• Visitors: Sign-in sheets, CCTV footage, access card records

**Lawful Basis:**
• Contractual Performance: Processing necessary for project delivery
• Legitimate Interests: Security, health and safety compliance
• Consent: Photographs for marketing (explicit opt-in required)
• Legal Obligation: Health and safety records, building control submissions

**Data Minimization:**
• Collect only name and role (not full personal details) for project contacts
• Anonymize site photographs where possible
• Redact personal data from published documents
• Limit CCTV retention to 30 days unless security incident

**Data Retention:**
• Project Personnel Data: Duration of project + 6 months, then secure deletion
• H&S Records: 7 years from project completion (legal requirement)
• Access Logs: 90 days retention, then automatic deletion
• CCTV: 30 days rolling retention, secure overwrite

**Individual Rights:**
• Data Subject Access Request (DSAR): Respond within 30 days
• Right to Rectification: Correct inaccurate personal data within 5 days
• Right to Erasure: Delete data when no longer needed (unless legal retention)
• Right to Object: Opt-out of marketing photographs

**Data Protection Impact Assessment (DPIA):**
Required for:
• Extensive CCTV monitoring of construction site
• Biometric access control systems (fingerprint, facial recognition)
• Processing of special category data (health data for accessibility)

**Third-Party Processors:**
All subcontractors and suppliers sign Data Processor Agreement:
• Process data only on documented instructions
• Implement appropriate security measures
• Assist with data subject rights requests
• Notify of data breaches within 24 hours
• Delete/return data at end of contract

**Data Breach Procedures:**
1. Detect: Monitoring, incident reports, audit logs
2. Contain: Isolate affected systems, revoke access
3. Assess: Severity, individuals affected, risks
4. Notify: ICO within 72 hours if high risk, affected individuals if severe
5. Remediate: Fix vulnerability, prevent recurrence
6. Document: Breach register, lessons learned`,

      'Infrastructure': `Infrastructure privacy compliance:

**Public Realm Considerations:**
• Highway CCTV: Privacy notices, limited retention, DPIA conducted
• Resident Consultation: Anonymized feedback, consent for attribution
• Land Ownership Data: Treated as confidential, secure handling
• Noise/Air Quality Monitoring: Anonymize property addresses
• Public Inquiry Submissions: Redact personal data before publication

**Utilities and Property Data:**
• Property Owner Information: Confidential, secure storage, limited access
• Utility Customer Data: Third-party NDA, strict access controls
• Compensation Claims: Secure legal hold, extended retention

**Workforce Privacy:**
• Site Worker Records: Secure, access-limited to H&S manager
• Security Clearance Data: Encrypted, restricted access, secure destruction
• Incident Reports: Anonymize where possible, limited distribution

**Data Sharing:**
• Statutory Undertakers: DPA in place, data minimization
• Planning Authority: Public data only, redact private information
• Emergency Services: Lawful basis under public safety`
    },

    commonMistakes: [
      'No identification of personal data in project information',
      'Excessive retention of personal data beyond project needs',
      'Missing lawful basis for processing personal data',
      'No procedures for data subject access requests',
      'CCTV without privacy notices or DPIA',
      'Third-party contracts without data processor clauses',
      'No data breach notification procedures',
      'Publishing documents containing unredacted personal data',
      'No privacy training for project team'
    ],

    relatedFields: ['dataClassification', 'accessPermissions', 'securityMeasures', 'auditTrails']
  }
};
