/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 120,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
