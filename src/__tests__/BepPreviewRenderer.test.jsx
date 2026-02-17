import React from 'react';
import { render, screen } from '@testing-library/react';
import BepPreviewRenderer from '../components/export/BepPreviewRenderer';

describe('BepPreviewRenderer milestones-table rendering', () => {
  test('renders key milestones as table cells instead of object strings', () => {
    const formData = {
      projectName: 'Test Project',
      projectNumber: 'TP-001',
      keyMilestones: [
        {
          stage: 'Stage 2',
          description: 'Concept Design Complete',
          deliverables: 'Spatial coordination model',
          dueDate: '2026-04-30'
        }
      ]
    };

    render(<BepPreviewRenderer formData={formData} bepType="pre-appointment" />);

    expect(screen.getByText('Stage 2')).toBeInTheDocument();
    expect(screen.getByText('Concept Design Complete')).toBeInTheDocument();
    expect(screen.queryByText('[object Object]')).not.toBeInTheDocument();
  });
});
