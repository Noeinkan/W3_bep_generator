import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { resolveSnippetsInText } from '../utils/snippetUtils';

/**
 * Fetches snippet map and provides resolve(text) for {{snippet:key}} in labels/placeholders/panels.
 * @param {string|null} projectId - Optional for future project-scoped snippets
 * @returns {{ snippetMap: Object, resolve: (text: string) => string, isLoading: boolean, error: string|null, refetch: () => void }}
 */
export function useSnippets(projectId = null) {
  const [snippetMap, setSnippetMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMap = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiService.getSnippetsMap(projectId);
      setSnippetMap(res?.data ?? {});
    } catch (err) {
      setError(err?.message ?? 'Failed to load snippets');
      setSnippetMap({});
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMap();
  }, [fetchMap]);

  const resolve = useCallback(
    (text) => resolveSnippetsInText(text, snippetMap),
    [snippetMap]
  );

  return { snippetMap, resolve, isLoading, error, refetch: fetchMap };
}
