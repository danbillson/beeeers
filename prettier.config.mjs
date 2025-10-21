/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config & import('prettier-plugin-tailwindcss').PluginOptions}
 */
const config = {
  semi: false,
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"],
}

export default config
