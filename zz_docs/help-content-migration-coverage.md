# Help Content Migration Coverage Report

Generated: 2026-02-14T13:18:04.211Z

## Summary

- Configured field references: **110**
- Served by modular help modules: **84**
- Served via legacy fallback: **0**
- Missing in both modular and legacy: **26**

## Per-Step Coverage

| Step | Modules | Config Fields | Modular | Legacy Fallback | Missing |
|---|---|---:|---:|---:|---:|
| 1 | projectInfo | 11 | 11 | 0 | 0 |
| 2 | executiveSummary | 5 | 5 | 0 | 0 |
| 3 | teamAndRoles, teamAndRolesPost | 16 | 15 | 0 | 1 |
| 4 | bimGoals | 7 | 7 | 0 | 0 |
| 5 | loin | 6 | 5 | 0 | 1 |
| 6 | deliveryPlanning | 11 | 8 | 0 | 3 |
| 7 | cde | 6 | 6 | 0 | 0 |
| 8 | technology | 6 | 4 | 0 | 2 |
| 9 | informationProduction | 11 | 11 | 0 | 0 |
| 10 | qualityAssurance | 6 | 6 | 0 | 0 |
| 11 | securityPrivacy | 5 | 5 | 0 | 0 |
| 12 | trainingCompetency | 4 | 0 | 0 | 4 |
| 13 | coordinationRisk | 13 | 1 | 0 | 12 |
| 14 | appendices | 3 | 0 | 0 | 3 |

## Missing Fields by Step

- Step 3: leadAppointedPartiesTable
- Step 5: informationFormats
- Step 6: informationDeliverablesMatrix, informationManagementMatrix, tidpDescription
- Step 8: bimSoftware, fileFormats
- Step 12: bimCompetencyLevels, certificationNeeds, projectSpecificTraining, trainingRequirements
- Step 13: auditTrails, communicationProtocols, contingencyPlans, coordinationMeetings, informationRisks, issueResolution, monitoringProcedures, performanceMetrics, projectKpis, riskMitigation, technologyRisks, updateProcesses
- Step 14: cobieRequirements, referencedDocuments, softwareVersionMatrix

## Legacy Retirement Plan

1. **Stabilize modular coverage**
   - Keep this report in CI or release checklist and drive `Legacy Fallback` to 0 for steps in active migration scope.
2. **Close gaps field-by-field**
   - For fields currently served by fallback, extract exact field objects from `helpContentData.js` into the mapped module.
3. **Enable strict mode (optional flag)**
   - Add an environment flag to disable legacy fallback in non-production test builds and catch regressions early.
4. **Deprecate legacy file**
   - Once fallback reaches 0 and tests pass, remove legacy loader path and retire `helpContentData.js`.
5. **Post-retirement cleanup**
   - Remove migration scaffolding comments and keep step-module mapping as the single source for help loading.

