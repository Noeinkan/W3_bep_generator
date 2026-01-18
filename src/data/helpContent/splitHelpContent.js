// Script to split the large helpContentData.js into smaller modules
// Run this with: node src/data/helpContent/splitHelpContent.js

const fs = require('fs');
const path = require('path');

// Categories for organizing help content
const categories = {
  projectInfo: [
    'projectName', 'projectNumber', 'projectType', 'appointingParty',
    'proposedTimeline', 'confirmedTimeline', 'estimatedBudget', 'confirmedBudget',
    'projectDescription', 'tenderApproach'
  ],
  executiveSummary: [
    'projectContext', 'bimStrategy', 'keyCommitments', 'keyContacts', 'valueProposition'
  ],
  teamAndRoles: [
    'proposedLead', 'confirmedLead', 'proposedInfoManager', 'confirmedInfoManager',
    'proposedTeamMembers', 'confirmedTeamMembers', 'teamCapabilities', 'teamExperience',
    'roles', 'responsibilities', 'communicationMatrix', 'escalationProcedures'
  ],
  bimGoals: [
    'bimObjectives', 'bimUses', 'informationPurposes', 'performanceMetrics',
    'successCriteria', 'kpis', 'valueDelivery'
  ],
  loin: [
    'loinStrategy', 'loinBreakdown', 'geometricDetail', 'alphanumericData',
    'documentation', 'geometryLOD', 'informationLOI'
  ],
  deliveryPlanning: [
    'midpReference', 'tidpReference', 'keyMilestones',
    'informationDeliveryDates', 'coordinationSchedule'
  ],
  cde: [
    'cdePlatform', 'cdeWorkflow', 'cdeStructure', 'accessPermissions',
    'informationStates', 'namingConvention', 'fileNamingConvention',
    'versionControl', 'statusCodes'
  ],
  technology: [
    'softwareTools', 'authoringSoftware', 'coordinationSoftware', 'analysisSoftware',
    'hardwareSpecs', 'itInfrastructure', 'networkRequirements', 'cloudServices',
    'fileFormats', 'nativeFormats', 'exchangeFormats', 'archiveFormats',
    'interoperability', 'ifcStrategy', 'dataExchange'
  ],
  informationProduction: [
    'modelingStandards', 'originPoint', 'coordinateSystem', 'unitsAndTolerance',
    'drawingStandards', 'layerStandards', 'annotationStandards',
    'contentLibrary', 'objectLibrary', 'familyStandards', 'templateFiles',
    'classificationSystem', 'uniclass', 'omniclass', 'masterFormat',
    'metadataRequirements', 'propertyData', 'customParameters'
  ],
  qualityAssurance: [
    'qaFramework', 'qaProcesses', 'qualityChecks', 'modelValidation',
    'clashDetection', 'clashMatrices', 'clashReporting', 'clashResolution',
    'reviewProcess', 'designReviews', 'coordinationMeetings', 'issueManagement',
    'auditTrails', 'changeControl', 'rfiProcess'
  ],
  security: [
    'securityMeasures', 'accessControl', 'dataProtection', 'backupStrategy',
    'cyberSecurity', 'encryptionStandards', 'gdprCompliance', 'dataPrivacy',
    'dataClassification', 'confidentialityLevels', 'dataRetention'
  ],
  training: [
    'trainingRequirements', 'competencyLevels', 'trainingPlan', 'skillsMatrix',
    'onboarding', 'continuousDevelopment', 'certifications', 'knowledgeSharing'
  ],
  coordination: [
    'coordinationProcedures', 'collaborationProtocol', 'meetingSchedule',
    'communicationPlan', 'issueResolution', 'decisionLog',
    'riskManagement', 'riskRegister', 'mitigationStrategies', 'contingencyPlans'
  ],
  appendices: [
    'appendixA', 'appendixB', 'appendixC', 'appendixD',
    'standards', 'templates', 'protocols', 'definitions',
    'applicableStandards', 'deliverablesList', 'acronyms', 'glossary'
  ]
};

console.log('🔧 Help Content Splitter');
console.log('========================\n');

// Read the original file
const originalPath = path.join(__dirname, '..', 'helpContentData.js');
const targetDir = __dirname;

try {
  // Check if original file exists
  if (!fs.existsSync(originalPath)) {
    console.log('❌ Original helpContentData.js not found at:', originalPath);
    console.log('ℹ️  This is expected if you\'re starting fresh with the modular system.');
    process.exit(0);
  }

  console.log('✅ Found original file:', originalPath);
  console.log('📁 Target directory:', targetDir);
  console.log('\n📊 Categories to create:');
  Object.keys(categories).forEach(cat => {
    console.log(`   - ${cat}.js (${categories[cat].length} fields)`);
  });

  console.log('\n⚠️  This script is a template for manual splitting.');
  console.log('💡 Due to the large file size, you should:');
  console.log('   1. Review the category mappings above');
  console.log('   2. Manually copy relevant sections from helpContentData.js');
  console.log('   3. Create separate files for each category');
  console.log('   4. Update index.js to import all new modules');
  console.log('\n📝 Example file structure:');
  console.log('   export const executiveSummaryHelp = {');
  console.log('     projectContext: { ... },');
  console.log('     bimStrategy: { ... },');
  console.log('     ...');
  console.log('   };');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log('\n✨ Review the category organization and proceed with manual splitting.');
