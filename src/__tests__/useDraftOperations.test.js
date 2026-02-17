import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/draftApiService', () => ({
  draftApiService: {
    getAllDrafts: vi.fn(),
    saveDraft: vi.fn(),
    deleteDraft: vi.fn(),
    updateDraft: vi.fn()
  }
}));

import { useDraftOperations } from '../hooks/useDraftOperations';
import { draftApiService } from '../services/draftApiService';

describe('useDraftOperations regression', () => {
  const user = { id: 'user-1' };
  const formData = { projectName: 'Demo Project' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes all draft operations from the hook', () => {
    const { result } = renderHook(() =>
      useDraftOperations(user, formData, 'pre-appointment', vi.fn(), vi.fn())
    );

    expect(typeof result.current.findDraftByName).toBe('function');
    expect(typeof result.current.saveDraft).toBe('function');
    expect(typeof result.current.deleteDraft).toBe('function');
    expect(typeof result.current.renameDraft).toBe('function');
    expect(typeof result.current.loadDraft).toBe('function');
    expect(typeof result.current.exportDraft).toBe('function');
    expect(typeof result.current.importBepFromJson).toBe('function');
  });

  it('returns existing draft when name already exists and overwrite is false', async () => {
    const existingDraft = { id: 'draft-123', name: 'Existing Draft', data: {} };

    draftApiService.getAllDrafts.mockResolvedValue([existingDraft]);

    const { result } = renderHook(() =>
      useDraftOperations(user, formData, 'pre-appointment', vi.fn(), vi.fn())
    );

    let response;
    await act(async () => {
      response = await result.current.saveDraft('  Existing Draft  ', formData, false);
    });

    expect(response.success).toBe(false);
    expect(response.existingDraft).toEqual(existingDraft);
    expect(draftApiService.saveDraft).not.toHaveBeenCalled();
  });
});