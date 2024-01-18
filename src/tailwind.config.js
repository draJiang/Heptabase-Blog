// tailwind.config.js
const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // single component styles
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/components/navbar.js",
    ],
    theme: {
        extend: {},
    },
    darkMode: "media",
    plugins: [nextui()],
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//       "./src/**/*.{js,jsx,ts,tsx}",
//     ],
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   }