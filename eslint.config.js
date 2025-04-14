import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	{
		ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'test-results/**'],
	},
	js.configs.recommended,
	...compat.config({
		extends: ['plugin:storybook/recommended'],
	}),
	// Configuration pour les fichiers de configuration TypeScript
	{
		files: ['*.config.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.node.json',
			},
			globals: {
				process: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
		},
	},
	// Configuration principale pour les fichiers TypeScript/React
	{
		files: ['**/*.{ts,tsx}'],
		ignores: ['*.config.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.eslint.json',
			},
			globals: {
				process: 'readonly',
				document: 'readonly',
				window: 'readonly',
				console: 'readonly',
				fetch: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
			'react-refresh': reactRefreshPlugin,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			...reactPlugin.configs.recommended.rules,
			...reactHooksPlugin.configs.recommended.rules,
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			'@typescript-eslint/triple-slash-reference': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react/react-in-jsx-scope': 'off',
			'react/no-unescaped-entities': 'off',
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						// React and external packages
						['^react', '^@?\\w'],
						// Internal imports with alias (@)
						['^@\\w'],
						// Relative imports
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
						// Style imports
						['^.+\\.css$'],
					],
				},
			],
			'simple-import-sort/exports': 'error',
			'padding-line-between-statements': [
				'error',
				{ blankLine: 'always', prev: 'import', next: '*' },
				{ blankLine: 'any', prev: 'import', next: 'import' },
			],
			'react/jsx-uses-react': 'off',
			'react/prop-types': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-non-null-assertion': 'warn',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	// Specific rule for shadcn UI components
	{
		files: ['**/src/components/ui/**/*.{ts,tsx}'],
		rules: {
			'react-refresh/only-export-components': 'off',
		},
	},
];
