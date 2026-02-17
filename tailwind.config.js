/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ui: {
          canvas: "var(--ui-canvas)",
          surface: "var(--ui-surface)",
          muted: "var(--ui-muted)",
          border: "var(--ui-border)",
          "border-strong": "var(--ui-border-strong)",
          text: "var(--ui-text)",
          "text-muted": "var(--ui-text-muted)",
          "text-soft": "var(--ui-text-soft)",
          primary: "var(--ui-primary)",
          "primary-hover": "var(--ui-primary-hover)",
          success: "var(--ui-success)",
          "success-bg": "var(--ui-success-bg)",
          warning: "var(--ui-warning)",
          "warning-bg": "var(--ui-warning-bg)",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.06), 0 1px 3px 0 rgb(15 23 42 / 0.1)",
      },
    },
  },
  plugins: [],
}