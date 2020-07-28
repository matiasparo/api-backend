module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module', // Allows for the use of imports
	},
	env: {
		browser: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin,
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/object-literal-sort-keys': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/quotemark': 'off',
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

		// TODO: temporary disabled not to break existing code.. in future we should turn on and refactor promises/async/await (ie. avoid promise(async (resolve, reject))
		'no-undef': 'off',
		'no-async-promise-executor': 'off',

		//Enforce the codebase follows ESLint's camelcase conventions
		/*'@typescript-eslint/naming-convention': [
			'error',
			{ selector: 'default', format: ['camelCase'] },
			{ selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
			{ selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
			{ selector: 'memberLike', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'allow' },
			{ selector: 'typeLike', format: ['PascalCase'] },
		],*/
	},
};
