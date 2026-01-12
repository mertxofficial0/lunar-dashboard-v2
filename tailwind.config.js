/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
module.exports = {
  theme: {
    extend: {
      spacing: {
        ui: "calc(1rem * var(--ui-scale))",
      },
      fontSize: {
        ui: ["calc(1rem * var(--ui-scale))", { lineHeight: "1.5" }],
        uism: ["calc(0.875rem * var(--ui-scale))", { lineHeight: "1.4" }],
        uixs: ["calc(0.75rem * var(--ui-scale))", { lineHeight: "1.3" }],
      },
      borderRadius: {
        ui: "calc(0.75rem * var(--ui-scale))",
      },
    },
  },
};
