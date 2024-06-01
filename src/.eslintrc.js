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
    },
  };
  