const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const configPath = path.join(workspaceRoot, 'src', 'config', 'bepConfig.js');
const indexPath = path.join(workspaceRoot, 'src', 'data', 'helpContent', 'index.js');
const legacyPath = path.join(workspaceRoot, 'src', 'data', 'helpContentData.js');
const helpDir = path.join(workspaceRoot, 'src', 'data', 'helpContent');
const reportPath = path.join(workspaceRoot, 'docs', 'help-content-migration-coverage.md');

const read = (filePath) => fs.readFileSync(filePath, 'utf8');

const extractStepFieldsFromConfig = (configContent) => {
  const stepFields = new Map();
  const lines = configContent.split(/\r?\n/);

  let currentStep = null;
  let inFieldsArray = false;
  let bracketDepth = 0;

  const countChar = (input, char) => (input.match(new RegExp(`\\${char}`, 'g')) || []).length;

  for (const line of lines) {
    const trimmed = line.trim();

    const stepMatch = trimmed.match(/^number:\s*'(\d+)'\s*,?$/);
    if (stepMatch) {
      const stepNumber = Number.parseInt(stepMatch[1], 10);
      if (stepNumber >= 1 && stepNumber <= 14) {
        currentStep = stepNumber;
        if (!stepFields.has(stepNumber)) {
          stepFields.set(stepNumber, new Set());
        }
      }
    }

    if (!inFieldsArray && trimmed.includes('fields: [')) {
      inFieldsArray = true;
      bracketDepth = countChar(trimmed, '[') - countChar(trimmed, ']');
      continue;
    }

    if (inFieldsArray) {
      const fieldNameMatch = trimmed.match(/name:\s*'([^']+)'/);
      if (fieldNameMatch && currentStep) {
        stepFields.get(currentStep).add(fieldNameMatch[1]);
      }

      bracketDepth += countChar(trimmed, '[');
      bracketDepth -= countChar(trimmed, ']');

      if (bracketDepth <= 0) {
        inFieldsArray = false;
        bracketDepth = 0;
      }
    }
  }

  return stepFields;
};

const extractStepToModules = (indexContent) => {
  const stepToModules = new Map();
  const mappingMatch = indexContent.match(/const STEP_TO_MODULE_KEYS = \{([\s\S]*?)\};/);
  if (!mappingMatch) return stepToModules;

  const block = mappingMatch[1];
  const lineRegex = /(\d+)\s*:\s*\[([^\]]*)\]/g;
  let match;
  while ((match = lineRegex.exec(block)) !== null) {
    const step = Number.parseInt(match[1], 10);
    const modules = match[2]
      .split(',')
      .map((item) => item.trim().replace(/^'|'$/g, ''))
      .filter(Boolean);
    stepToModules.set(step, modules);
  }

  return stepToModules;
};

const extractTopLevelFieldNames = (content) => {
  const names = new Set();
  const regex = /^  ([A-Za-z0-9_]+):\s*\{/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    names.add(match[1]);
  }
  return names;
};

const buildReport = ({ stepFields, stepToModules, legacyFields, moduleFieldsByKey }) => {
  const now = new Date();
  const generatedAt = now.toISOString();
  const rows = [];
  const missingByStep = [];

  let totalConfigured = 0;
  let totalModular = 0;
  let totalLegacyFallback = 0;
  let totalMissing = 0;

  for (let step = 1; step <= 14; step += 1) {
    const configured = Array.from(stepFields.get(step) || []).sort();
    const modules = stepToModules.get(step) || [];

    const modularSet = new Set();
    for (const moduleKey of modules) {
      for (const fieldName of moduleFieldsByKey.get(moduleKey) || []) {
        modularSet.add(fieldName);
      }
    }

    let modularCount = 0;
    let legacyFallbackCount = 0;
    let missingCount = 0;
    const missingFields = [];

    configured.forEach((fieldName) => {
      if (modularSet.has(fieldName)) {
        modularCount += 1;
      } else if (legacyFields.has(fieldName)) {
        legacyFallbackCount += 1;
      } else {
        missingCount += 1;
        missingFields.push(fieldName);
      }
    });

    totalConfigured += configured.length;
    totalModular += modularCount;
    totalLegacyFallback += legacyFallbackCount;
    totalMissing += missingCount;

    rows.push({
      step,
      modules,
      configured: configured.length,
      modularCount,
      legacyFallbackCount,
      missingCount
    });

    if (missingFields.length) {
      missingByStep.push({ step, missingFields });
    }
  }

  const lines = [];
  lines.push('# Help Content Migration Coverage Report');
  lines.push('');
  lines.push(`Generated: ${generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Configured field references: **${totalConfigured}**`);
  lines.push(`- Served by modular help modules: **${totalModular}**`);
  lines.push(`- Served via legacy fallback: **${totalLegacyFallback}**`);
  lines.push(`- Missing in both modular and legacy: **${totalMissing}**`);
  lines.push('');
  lines.push('## Per-Step Coverage');
  lines.push('');
  lines.push('| Step | Modules | Config Fields | Modular | Legacy Fallback | Missing |');
  lines.push('|---|---|---:|---:|---:|---:|');
  rows.forEach((row) => {
    lines.push(`| ${row.step} | ${row.modules.join(', ') || '-'} | ${row.configured} | ${row.modularCount} | ${row.legacyFallbackCount} | ${row.missingCount} |`);
  });

  lines.push('');
  lines.push('## Missing Fields by Step');
  lines.push('');
  if (!missingByStep.length) {
    lines.push('- None');
  } else {
    missingByStep.forEach(({ step, missingFields }) => {
      lines.push(`- Step ${step}: ${missingFields.join(', ')}`);
    });
  }

  lines.push('');
  lines.push('## Legacy Retirement Plan');
  lines.push('');
  lines.push('1. **Stabilize modular coverage**');
  lines.push('   - Keep this report in CI or release checklist and drive `Legacy Fallback` to 0 for steps in active migration scope.');
  lines.push('2. **Close gaps field-by-field**');
  lines.push('   - For fields currently served by fallback, extract exact field objects from `helpContentData.js` into the mapped module.');
  lines.push('3. **Enable strict mode (optional flag)**');
  lines.push('   - Add an environment flag to disable legacy fallback in non-production test builds and catch regressions early.');
  lines.push('4. **Deprecate legacy file**');
  lines.push('   - Once fallback reaches 0 and tests pass, remove legacy loader path and retire `helpContentData.js`.');
  lines.push('5. **Post-retirement cleanup**');
  lines.push('   - Remove migration scaffolding comments and keep step-module mapping as the single source for help loading.');
  lines.push('');

  return `${lines.join('\n')}\n`;
};

const main = () => {
  const configContent = read(configPath);
  const indexContent = read(indexPath);
  const legacyContent = read(legacyPath);

  const stepFields = extractStepFieldsFromConfig(configContent);
  const stepToModules = extractStepToModules(indexContent);
  const legacyFields = extractTopLevelFieldNames(legacyContent);

  const moduleFieldsByKey = new Map();
  for (const modules of stepToModules.values()) {
    for (const moduleKey of modules) {
      if (moduleFieldsByKey.has(moduleKey)) continue;
      const modulePath = path.join(helpDir, `${moduleKey}.js`);
      if (!fs.existsSync(modulePath)) {
        moduleFieldsByKey.set(moduleKey, new Set());
        continue;
      }
      const moduleContent = read(modulePath);
      moduleFieldsByKey.set(moduleKey, extractTopLevelFieldNames(moduleContent));
    }
  }

  const report = buildReport({ stepFields, stepToModules, legacyFields, moduleFieldsByKey });
  fs.writeFileSync(reportPath, report, 'utf8');

  console.log(`Help content migration report written to ${path.relative(workspaceRoot, reportPath)}`);
};

main();
