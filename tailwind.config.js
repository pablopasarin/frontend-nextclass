const flowbite = require("flowbite-react/tailwind");

module.exports = {
  mode: 'jit', // Activa el modo JIT
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    flowbite.content(),
  ],
  theme: {
    colors: {
      dark: '#0F0F20',
    },
    extend: {
      animation: {
        blink: 'blink 1.5s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },

      },
    },
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
  }),
  require("@tailwindcss/typography")
]
};