export default {
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  // Fix issue with prettier 3 and trivago plugin
  // https://github.com/trivago/prettier-plugin-sort-imports/issues/245
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
