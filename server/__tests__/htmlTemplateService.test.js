const htmlTemplateService = require('../services/htmlTemplateService');

describe('HtmlTemplateService table rendering', () => {
  test('renders table type with EditableTable shape { columns, data }', () => {
    const field = {
      type: 'table',
      name: 'taskTeamsBreakdown',
      columns: ['Task Team', 'Discipline', 'Leader', 'Leader Contact', 'Company']
    };
    const value = {
      columns: ['Task Team', 'Discipline', 'Leader', 'Leader Contact', 'Company'],
      data: [
        { 'Task Team': 'Design', Discipline: 'Architecture', Leader: 'Jane', 'Leader Contact': 'jane@firm.com', Company: 'Acme Ltd' }
      ]
    };
    const rendered = htmlTemplateService.renderFieldValue(field, value, {});
    expect(rendered).toContain('<table');
    expect(rendered).toContain('Design');
    expect(rendered).toContain('jane@firm.com');
    expect(rendered).toContain('Acme Ltd');
  });

  test('hasRenderableValue treats table { columns, data } with empty data as not renderable', () => {
    const field = { type: 'table', name: 'taskTeamsBreakdown' };
    expect(htmlTemplateService.hasRenderableValue(field, { columns: [], data: [] })).toBe(false);
    expect(htmlTemplateService.hasRenderableValue(field, { columns: ['A'], data: [] })).toBe(false);
  });

  test('hasRenderableValue treats table { columns, data } with rows as renderable', () => {
    const field = { type: 'table', name: 'taskTeamsBreakdown' };
    expect(htmlTemplateService.hasRenderableValue(field, { columns: ['A'], data: [{ A: 'x' }] })).toBe(true);
  });
});

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
