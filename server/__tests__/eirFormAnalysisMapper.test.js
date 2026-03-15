const {
  mapEirFormDataToAnalysis,
  buildBasicEirSummaryMarkdown,
} = require('../services/eirFormAnalysisMapper');

describe('eirFormAnalysisMapper', () => {
  describe('mapEirFormDataToAnalysis', () => {
    test('returns full analysis shape for empty form data', () => {
      const analysis = mapEirFormDataToAnalysis({});
      expect(analysis).toMatchObject({
        project_info: expect.any(Object),
        bim_objectives: expect.any(Array),
        information_requirements: expect.objectContaining({
          OIR: expect.any(Array),
          PIR: expect.any(Array),
          AIR: expect.any(Array),
          EIR_specifics: expect.any(Array),
        }),
        delivery_milestones: expect.any(Array),
        standards_protocols: expect.any(Object),
        cde_requirements: expect.any(Object),
        roles_responsibilities: expect.any(Array),
        software_requirements: expect.any(Array),
        plain_language_questions: expect.any(Array),
        quality_requirements: expect.any(Object),
        handover_requirements: expect.any(Object),
        specific_risks: expect.any(Array),
        other_requirements: expect.any(Array),
      });
      expect(analysis.project_info).toMatchObject({
        name: null,
        description: null,
        location: null,
        client: null,
        project_type: null,
        estimated_value: null,
      });
      expect(analysis.bim_objectives).toEqual([]);
      expect(analysis.delivery_milestones).toEqual([]);
    });

    test('accepts null/undefined and treats as empty', () => {
      const a1 = mapEirFormDataToAnalysis(null);
      const a2 = mapEirFormDataToAnalysis(undefined);
      expect(a1.project_info.description).toBeNull();
      expect(a2.project_info.description).toBeNull();
    });

    test('maps executiveSummary and eirPurpose to project_info.description', () => {
      const analysis = mapEirFormDataToAnalysis({
        executiveSummary: 'Summary here',
        eirPurpose: '',
      });
      expect(analysis.project_info.description).toBe('Summary here');
    });

    test('uses eirPurpose when executiveSummary is empty', () => {
      const analysis = mapEirFormDataToAnalysis({
        eirPurpose: 'Purpose text',
      });
      expect(analysis.project_info.description).toBe('Purpose text');
    });

    test('maps goals and objectives to bim_objectives as lines', () => {
      const analysis = mapEirFormDataToAnalysis({
        goals: 'Goal A\nGoal B',
        objectives: 'Objective 1',
      });
      expect(analysis.bim_objectives).toContain('Goal A');
      expect(analysis.bim_objectives).toContain('Goal B');
      expect(analysis.bim_objectives).toContain('Objective 1');
    });

    test('maps informationDeliveryMilestones to delivery_milestones', () => {
      const analysis = mapEirFormDataToAnalysis({
        informationDeliveryMilestones: [
          { 'Stage/Phase': 'Stage 2', 'Milestone Description': 'Concept design', 'Due Date': '2026-06-01' },
          { Stage: 'Stage 3', Description: 'Spatial coordination', Date: '2026-09-01' },
        ],
      });
      expect(analysis.delivery_milestones).toHaveLength(2);
      expect(analysis.delivery_milestones[0]).toMatchObject({
        phase: 'Stage 2',
        description: 'Concept design',
        date: '2026-06-01',
      });
      expect(analysis.delivery_milestones[1]).toMatchObject({
        phase: 'Stage 3',
        description: 'Spatial coordination',
        date: '2026-09-01',
      });
    });

    test('maps informationModelQuality to quality_requirements.model_checking', () => {
      const analysis = mapEirFormDataToAnalysis({
        informationModelQuality: 'Clash detection weekly',
      });
      expect(analysis.quality_requirements.model_checking).toBe('Clash detection weekly');
    });

    test('maps aimRequirements to handover_requirements.asset_data', () => {
      const analysis = mapEirFormDataToAnalysis({
        aimRequirements: 'COBie and asset data required',
      });
      expect(analysis.handover_requirements.asset_data).toBe('COBie and asset data required');
    });

    test('aggregates other_requirements from projectSpecificStandards and related text fields', () => {
      const analysis = mapEirFormDataToAnalysis({
        projectSpecificStandards: 'ISO 19650',
        lessonsLearnt: 'Lesson one',
      });
      expect(analysis.other_requirements).toContain('ISO 19650');
      expect(analysis.other_requirements).toContain('Lesson one');
    });
  });

  describe('buildBasicEirSummaryMarkdown', () => {
    test('returns empty string for null/undefined analysis', () => {
      expect(buildBasicEirSummaryMarkdown(null)).toBe('');
      expect(buildBasicEirSummaryMarkdown(undefined)).toBe('');
    });

    test('returns default overview when project_info has no description', () => {
      const markdown = buildBasicEirSummaryMarkdown({ project_info: {} });
      expect(markdown).toContain('## Project Overview');
      expect(markdown).toContain('Exchange Information Requirements authored in Arcquio');
    });

    test('includes project_info.description when set', () => {
      const markdown = buildBasicEirSummaryMarkdown({
        project_info: { description: 'My EIR purpose' },
      });
      expect(markdown).toContain('My EIR purpose');
    });

    test('includes BIM objectives section when present', () => {
      const markdown = buildBasicEirSummaryMarkdown({
        project_info: {},
        bim_objectives: ['Objective A', 'Objective B'],
      });
      expect(markdown).toContain('## BIM Objectives');
      expect(markdown).toContain('- Objective A');
      expect(markdown).toContain('- Objective B');
    });

    test('includes delivery milestones section when present', () => {
      const markdown = buildBasicEirSummaryMarkdown({
        project_info: {},
        delivery_milestones: [
          { phase: 'Stage 2', description: 'Concept', date: '2026-06-01' },
        ],
      });
      expect(markdown).toContain('## Delivery Milestones');
      expect(markdown).toContain('Stage 2 (2026-06-01): Concept');
    });

    test('includes standards section when standards_protocols has data', () => {
      const markdown = buildBasicEirSummaryMarkdown({
        project_info: {},
        standards_protocols: {
          classification_systems: ['Uniclass'],
          file_formats: ['IFC4'],
          naming_conventions: 'Defined',
          lod_loi_requirements: 'Matrix in EIR',
        },
      });
      expect(markdown).toContain('## Standards & Protocols');
      expect(markdown).toContain('Uniclass');
      expect(markdown).toContain('IFC4');
    });

    test('includes software and risks sections when present', () => {
      const markdown = buildBasicEirSummaryMarkdown({
        project_info: {},
        software_requirements: ['Revit', 'Solibri'],
        specific_risks: ['Coordination risk'],
      });
      expect(markdown).toContain('## Technical Requirements');
      expect(markdown).toContain('Revit');
      expect(markdown).toContain('## Risks & Specific Requirements');
      expect(markdown).toContain('Coordination risk');
    });
  });
});
