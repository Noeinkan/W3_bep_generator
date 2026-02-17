import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/apiService', () => ({
  apiClient: {
    request: vi.fn()
  }
}));

import { apiClient } from '../services/apiService';
import { useBepStructure } from '../components/form-builder/useBepStructure';

describe('useBepStructure api client regression', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(['pre-appointment', 'post-appointment'])('loads BEP structure endpoints through shared apiClient for %s', async (bepType) => {
    apiClient.request
      .mockResolvedValueOnce({
        data: { data: [] }
      })
      .mockResolvedValueOnce({
        data: { data: [] }
      });

    renderHook(() => useBepStructure({ bepType }));

    await waitFor(() => {
      expect(apiClient.request).toHaveBeenCalledTimes(2);
    });

    const firstCallOptions = apiClient.request.mock.calls[0][0];
    const secondCallOptions = apiClient.request.mock.calls[1][0];

    expect(firstCallOptions.url).toBe(`/bep-structure/template?bepType=${bepType}`);
    expect(secondCallOptions.url).toBe('/bep-structure/field-types');
    expect(firstCallOptions.method).toBe('GET');
    expect(secondCallOptions.method).toBe('GET');
  });

  it('does not surface request cancellation as a structure loading error', async () => {
    apiClient.request.mockRejectedValueOnce({
      code: 'ERR_CANCELED',
      name: 'CanceledError',
      message: 'canceled'
    });

    const { result } = renderHook(() => useBepStructure({ bepType: 'post-appointment' }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });
});
