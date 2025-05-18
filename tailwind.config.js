// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tiny5', 'ui-monospace', 'monospace'],
      },
			animation: {
        blink: "blink 1s infinite",
        float: "float 3s ease-in-out infinite",
        "float-delayed": "float 3s ease-in-out 0.5s infinite",
        dots: "dots 1s alternate infinite",
        "ghost-float": "ghost-float 4s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.3 }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" }
        },
      }
    },
  },
  plugins: [],
}
