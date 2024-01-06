const base = require('../../config/eslint.config.base.js');

module.exports = {
  ...base,
  extends: [
    ...base.extends,
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
  ],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
