import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import BepStructureMap from '../components/form-builder/BepStructureMap';
import FormBuilderContext from '../components/form-builder/FormBuilderContext';

const baseSteps = [
  {
    id: 'step-1',
    step_number: 1,
    title: 'BEP Type & Project Info',
    description: 'Define BEP type and basic project information',
    category: 'Commercial',
    order_index: 0,
    is_visible: 1,
  },
  {
    id: 'step-2',
    step_number: 2,
    title: 'Commercial Team Setup',
    description: 'Define key stakeholders',
    category: 'Commercial',
    order_index: 1,
    is_visible: 1,
  },
];

const baseFields = [
  {
    id: 'field-1',
    step_id: 'step-1',
    label: 'Project Name',
    name: 'projectName',
    type: 'text',
    is_required: 1,
  },
];

const renderWithContext = (ui, overrides = {}) => {
  const value = {
    steps: baseSteps,
    fields: baseFields,
    isLoading: false,
    error: null,
    isEditMode: false,
    toggleEditMode: vi.fn(),
    ...overrides,
  };

  return render(
    <FormBuilderContext.Provider value={value}>
      {ui}
    </FormBuilderContext.Provider>
  );
};

describe('BepStructureMap UX behavior', () => {
  it('starts with category collapsed and reveals steps on demand', async () => {
    renderWithContext(<BepStructureMap showHeader={true} showEditToggle={false} />);

    expect(screen.queryByText('BEP Type & Project Info')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Commercial/i }));

    expect(screen.getByText('BEP Type & Project Info')).toBeInTheDocument();
  });

  it('supports preview selection in non-edit mode without navigation callback', async () => {
    const onSelectedStepChange = vi.fn();

    renderWithContext(
      <BepStructureMap
        showHeader={true}
        showEditToggle={false}
        onSelectedStepChange={onSelectedStepChange}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /Commercial/i }));
    await userEvent.click(screen.getByRole('button', { name: /Commercial Team Setup/i }));

    await waitFor(() => {
      expect(onSelectedStepChange).toHaveBeenLastCalledWith('step-2');
    });
  });

  it('disables edit toggle when structure editing is not allowed', () => {
    renderWithContext(
      <BepStructureMap
        showHeader={true}
        showEditToggle={true}
        canEditStructure={false}
        editDisabledReason="Create or select a draft first. Structure editing is draft-only."
      />
    );

    expect(screen.getByRole('button', { name: /Edit structure/i })).toBeDisabled();
    expect(screen.getByText(/Structure editing is draft-only/i)).toBeInTheDocument();
  });
});
