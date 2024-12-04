import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier'; // Prettier integration
import prettierPlugin from 'eslint-plugin-prettier'; // Prettier as a plugin

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 2021,
    },
    ...pluginJs.configs.recommended,
    plugins: {
      prettier: prettierPlugin, // Add Prettier plugin
    },
    rules: {
      ...prettier.rules, // Apply Prettier rules
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn',
      'no-console': 'error',
      indent: ['error', 2],
      'arrow-parens': 'as-needed',
      'prettier/prettier': 'error', // Enforce Prettier formatting as ESLint errors

      'spaced-comment': 'off',

      'consistent-return': 'off',
      'func-names': 'off',
      'object-shorthand': 'off',
      'no-process-exit': 'off',
      'no-param-reassign': 'off',
      'no-return-await': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|val' }],
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
