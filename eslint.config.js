// eslint.config.js
module.exports = [
  {
    ignores: ['dist/', 'build/', 'node_modules/', 'coverage/'],
  },
  {
    files: ['src/**/*.{js,ts}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // Base ESLint rules
      'no-unused-vars': 'off', // TypeScript handles this
      'no-console': 'off',

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
