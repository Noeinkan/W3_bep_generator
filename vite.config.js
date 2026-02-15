import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.(js|jsx)$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'build',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'tiptap-vendor': [
              '@tiptap/react',
              '@tiptap/starter-kit',
              '@tiptap/extension-bubble-menu',
              '@tiptap/extension-color',
              '@tiptap/extension-font-family',
              '@tiptap/extension-highlight',
              '@tiptap/extension-image',
              '@tiptap/extension-link',
              '@tiptap/extension-placeholder',
              '@tiptap/extension-table',
              '@tiptap/extension-table-cell',
              '@tiptap/extension-table-header',
              '@tiptap/extension-table-row',
              '@tiptap/extension-text-align',
              '@tiptap/extension-text-style',
              '@tiptap/extension-underline',
            ],
            'dnd-vendor': [
              '@dnd-kit/core',
              '@dnd-kit/sortable',
              '@dnd-kit/modifiers',
              '@dnd-kit/utilities',
            ],
            'diagram-vendor': ['@xyflow/react', 'd3', 'dagre'],
            'office-vendor': ['docx', 'xlsx', 'papaparse'],
          },
        },
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.REACT_APP_API_URL': JSON.stringify(env.VITE_API_URL),
    },
  };
});
