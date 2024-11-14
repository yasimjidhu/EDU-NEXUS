module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
  ],
  plugins: [
    'react',
    '@typescript-eslint',
    'jsx-a11y',
    'import',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 'off',

    // Allow unused variables (such as unused imports or variables)
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }], // Warn for unused variables but allow those starting with '_'
    'no-unused-vars': 'off', // Turn off the base ESLint rule for unused variables

    // Disable checking for unused imports (to prevent errors related to unused imports)
    'import/no-unused-modules': ['off'], // This disables errors related to unused imports

    // Other useful rules to clean up unused imports or code
    'no-unused-vars': ['off'], // Avoid any conflicts with TypeScript's version of the rule
  },
};
