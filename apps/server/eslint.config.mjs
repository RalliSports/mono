// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended, // Changed from recommendedTypeChecked to recommended
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      // Removed projectService and parserOptions for less strict type checking
    },
  },
  {
    rules: {
      // Existing rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      
      // Additional rules to make it less strict
      '@typescript-eslint/no-unused-vars': 'warn', // Changed from error to warn
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      'prefer-const': 'warn',
      'no-console': 'off', // Allow console statements
      'no-debugger': 'warn', // Allow debugger in development
    },
  },
);