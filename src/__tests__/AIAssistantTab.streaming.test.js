import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIAssistantTab from '../components/forms/ai/AIAssistantTab';

const baseProps = {
  editor: null,
  fieldName: 'projectDescription',
  fieldType: 'projectDescription',
  fieldState: 'empty',
  onClose: vi.fn(),
  aiLoading: false,
  aiError: null,
  aiSuccess: false,
  handleAIGenerate: vi.fn(),
  handleAIImprove: vi.fn(),
  improveOptions: { grammar: true, professional: false, iso19650: false, expand: false, concise: false },
  setImproveOptions: vi.fn(),
  streamingText: '',
  thinkingStage: '',
  isStreaming: false
};

// Navigate the component from 'pick' to 'quick' mode
function renderInQuickMode(props = {}) {
  const { rerender, ...utils } = render(<AIAssistantTab {...baseProps} {...props} />);
  // Click the Quick AI card to enter quick mode
  fireEvent.click(screen.getByText('Quick AI').closest('button'));
  // Rerender with updated props after navigation (simulates parent state update)
  rerender(<AIAssistantTab {...baseProps} {...props} />);
  return { rerender, ...utils };
}

describe('AIAssistantTab — streaming loading UI (QuickGenerateView)', () => {
  it('shows indeterminate progress bar when loading with no thinkingStage yet', () => {
    renderInQuickMode({ aiLoading: true, thinkingStage: '', streamingText: '' });
    // The progress bar div should be present (identified by its gradient classes)
    const progressBar = document.querySelector('.bg-gradient-to-r.from-blue-500');
    expect(progressBar).not.toBeNull();
  });

  it('shows thinking stage banner when loading with a stage message but no tokens yet', () => {
    renderInQuickMode({
      aiLoading: true,
      thinkingStage: 'Parsing ISO 19650 requirements\u2026',
      streamingText: ''
    });
    expect(screen.getByText('Parsing ISO 19650 requirements\u2026')).toBeTruthy();
  });

  it('shows live preview panel with streaming text once tokens arrive', () => {
    renderInQuickMode({
      aiLoading: true,
      thinkingStage: '',
      streamingText: 'The project BIM strategy'
    });
    expect(screen.getByText(/The project BIM strategy/)).toBeTruthy();
    expect(screen.getByText('Generating\u2026')).toBeTruthy();
  });

  it('does not show thinking stage banner when streaming text is already present', () => {
    renderInQuickMode({
      aiLoading: true,
      thinkingStage: 'Consulting BIM framework\u2026',
      streamingText: 'Some tokens arrived'
    });
    // Stage banner should be hidden once text arrives
    expect(screen.queryByText('Consulting BIM framework\u2026')).toBeNull();
    expect(screen.getByText(/Some tokens arrived/)).toBeTruthy();
  });

  it('shows success state when aiSuccess is true', () => {
    renderInQuickMode({ aiLoading: false, aiSuccess: true });
    expect(screen.getByText('Success!')).toBeTruthy();
  });

  it('shows error state when aiError is set', () => {
    renderInQuickMode({ aiLoading: false, aiError: 'Cannot connect to AI service' });
    expect(screen.getByText('Cannot connect to AI service')).toBeTruthy();
  });
});

describe('AIAssistantTab — streaming loading UI (QuickImproveView)', () => {
  it('shows thinking stage banner in improve mode when loading with a stage', () => {
    render(
      <AIAssistantTab
        {...baseProps}
        fieldState="hasContent"
        aiLoading={true}
        thinkingStage={'Reviewing information delivery plan\u2026'}
        streamingText=""
      />
    );
    fireEvent.click(screen.getByText('Quick AI').closest('button'));
    expect(screen.getByText('Reviewing information delivery plan\u2026')).toBeTruthy();
  });

  it('shows green live preview panel in improve mode once tokens arrive', () => {
    const { rerender } = render(
      <AIAssistantTab {...baseProps} fieldState="hasContent" />
    );
    fireEvent.click(screen.getByText('Quick AI').closest('button'));
    rerender(
      <AIAssistantTab
        {...baseProps}
        fieldState="hasContent"
        aiLoading={true}
        streamingText="Improved text here"
        thinkingStage=""
      />
    );
    expect(screen.getByText(/Improved text here/)).toBeTruthy();
    expect(screen.getByText('Improving\u2026')).toBeTruthy();
  });
});
