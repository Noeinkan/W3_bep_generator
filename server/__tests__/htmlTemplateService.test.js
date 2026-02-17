const htmlTemplateService = require('../services/htmlTemplateService');

describe('HtmlTemplateService milestones-table rendering', () => {
  test('renders key milestones rows as an HTML table', () => {
    const field = {
      type: 'milestones-table',
      name: 'keyMilestones',
      label: 'Key Information Delivery Milestones',
      columns: ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date']
    };

    const value = [
      {
        stage: 'Stage 2',
        description: 'Concept Design Complete',
        deliverables: 'Spatial coordination model',
        dueDate: '2026-04-30'
      },
      {
        'Stage/Phase': 'Stage 3',
        'Milestone Description': 'Spatial Coordination',
        Deliverables: 'Federated model package',
        'Due Date': '2026-08-15'
      }
    ];

    const rendered = htmlTemplateService.renderFieldValue(field, value, {});

    expect(rendered).toContain('<table');
    expect(rendered).toContain('Stage 2');
    expect(rendered).toContain('Concept Design Complete');
    expect(rendered).not.toContain('[object Object]');
  });
});
