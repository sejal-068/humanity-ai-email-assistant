// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#635BFF", // indigo/violet accent
        navy: "#172033",
        surface: "#F7F8FC",
        background: "#F7F8FC",
        text: "#1F2937",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#EF4444",
        neutral: "#9CA3AF",
      },
      borderRadius: {
        DEFAULT: "12px",
        md: "10px",
        lg: "16px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
        medium: "0 4px 12px rgba(0,0,0,0.1)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

