/** @type {import('prettier').Config} */
export default {
  // Keep consistent, readable diffs
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,

  // Plugins
  plugins: [
    "prettier-plugin-tailwindcss",
    "prettier-plugin-organize-imports",
  ],

  // Tailwind class sorting
  tailwindAttributes: ["class", "className"],
};

