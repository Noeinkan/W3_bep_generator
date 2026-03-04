import React from 'react';

/**
 * Top-level error boundary so a render error shows a fallback instead of a white screen.
 * Use only at the root (e.g. in index.jsx).
 */
class RootErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Root error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const err = this.state.error;
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
            background: '#f8fafc',
            color: '#1e293b',
          }}
          role="alert"
        >
          <h1 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: '#64748b', marginBottom: 16, maxWidth: 480, textAlign: 'center' }}>
            {err?.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RootErrorBoundary;
