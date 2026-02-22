import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAISuggestion } from '../hooks/useAISuggestion';

// Helper: build a ReadableStream that emits SSE-formatted chunks
function makeSSEStream(events) {
  const encoder = new TextEncoder();
  const chunks = events.map(e => encoder.encode(`data: ${JSON.stringify(e)}\n\n`));
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i < chunks.length) {
        controller.enqueue(chunks[i++]);
      } else {
        controller.close();
      }
    }
  });
}

describe('useAISuggestion — generateSuggestionStream', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('processes stage, token, and done events and calls callbacks', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      body: makeSSEStream([
        { type: 'stage', message: 'Parsing ISO 19650 requirements\u2026' },
        { type: 'token', text: 'The ' },
        { type: 'token', text: 'project.' },
        { type: 'done', fullText: 'The project.' }
      ])
    }));

    const { result } = renderHook(() => useAISuggestion());
    const onStage = vi.fn();
    const onToken = vi.fn();
    const onDone = vi.fn();

    let returned;
    await act(async () => {
      returned = await result.current.generateSuggestionStream(
        'projectDescription', '', 200,
        { onStage, onToken, onDone }
      );
    });

    expect(onStage).toHaveBeenCalledWith('Parsing ISO 19650 requirements\u2026');
    expect(onToken).toHaveBeenCalledWith('The ', 'The ');
    expect(onToken).toHaveBeenCalledWith('project.', 'The project.');
    expect(onDone).toHaveBeenCalledWith('The project.');
    expect(returned).toBe('The project.');
  });

  it('resets isLoading and isStreaming to false after completion', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      body: makeSSEStream([
        { type: 'token', text: 'Hello.' },
        { type: 'done', fullText: 'Hello.' }
      ])
    }));

    const { result } = renderHook(() => useAISuggestion());

    await act(async () => {
      await result.current.generateSuggestionStream('bimUses', '', 200, {});
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.streamingText).toBe('Hello.');
  });

  it('sets error state and throws when stream returns an error event', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      body: makeSSEStream([{ type: 'error', message: 'Ollama connection refused' }])
    }));

    const { result } = renderHook(() => useAISuggestion());
    const onError = vi.fn();

    await act(async () => {
      await expect(
        result.current.generateSuggestionStream('projectDescription', '', 200, { onError })
      ).rejects.toThrow('Ollama connection refused');
    });

    expect(onError).toHaveBeenCalledWith('Ollama connection refused');
    expect(result.current.error).toBe('Ollama connection refused');
    expect(result.current.isLoading).toBe(false);
  });

  it('sets error and throws on non-ok HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable'
    }));

    const { result } = renderHook(() => useAISuggestion());

    await act(async () => {
      await expect(
        result.current.generateSuggestionStream('projectDescription')
      ).rejects.toThrow('HTTP 503');
    });

    expect(result.current.error).toMatch(/503/);
  });

  it('still exposes non-streaming methods unchanged', () => {
    const { result } = renderHook(() => useAISuggestion());
    expect(typeof result.current.generateSuggestion).toBe('function');
    expect(typeof result.current.generateFromPrompt).toBe('function');
    expect(typeof result.current.checkAIHealth).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });
});
