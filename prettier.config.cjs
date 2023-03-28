/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 120,
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^types$',
    '^~/types/(.*)$',
    '^~/pages/(.*)$',
    '^~/layouts/(.*)$',
    '^~/components/(.*)$',
    '^~/hooks/(.*)$',
    '^~/constants/(.*)$',
    '^~/utils/(.*)$',
    '^~/styles/(.*)$',
    '^~/server/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
};

module.exports = config;
