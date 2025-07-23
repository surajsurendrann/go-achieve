/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1B3C53",
        secondary: "#456882",
        dark: "#212121",
        darkContainer: "#212130",
        light: "#F8F8F8"
      }
    },
  },
  plugins: [],
}