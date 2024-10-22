/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        low: '#f28cb1',         // Color para valores bajos (rosa)
        medium: '#3bb2d0',      // Color para valores medios (azul claro)
        high: '#2a9d8f',        // Color adicional para valores altos (verde esmeralda)
        veryHigh: '#e9c46a',    // Color adicional para valores muy altos (amarillo claro)
        extreme: '#e76f51',     // Color para valores extremadamente altos (naranja)
      },
    },
  },
  plugins: [],
};


35000, '#f28cb1',  // Color para valores bajos (rosa)
          45000, '#3bb2d0',  // Color para valores medios (azul claro)
          55000, '#2a9d8f',  // Color adicional para valores altos (verde esmeralda)
          65000, '#e9c46a',  // Color adicional para valores muy altos (amarillo claro)
          80000, '#e76f51'   // Color para valores extremadamente altos (naranja)