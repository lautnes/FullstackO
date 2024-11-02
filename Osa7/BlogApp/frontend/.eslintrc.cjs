module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Changed 'false' to 'off' to properly disable this rule

    // General formatting and consistency rules
    'no-unused-vars': 'warn', // Warns on unused variables
    'indent': ['error', 2], // Enforces 2-space indentation
    'quotes': ['error', 'single'], // Enforces single quotes
    'semi': ['error', 'never'], // Disallows semicolons except as necessary
    'eqeqeq': 'error', // Requires strict equality operators
    'no-trailing-spaces': 'error', // Disallows trailing whitespace
    'object-curly-spacing': ['error', 'always'], // Requires spaces inside braces
    'arrow-spacing': ['error', { before: true, after: true }], // Enforces spacing in arrow functions
    'linebreak-style': ['error', 'unix'], // Enforces Unix linebreaks
  },
}
