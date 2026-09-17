module.exports = {
	root: true,
	extends: ['./node_modules/@limbo-works/lint-configs/.eslintrc.simple.cjs'],
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			parser: '@typescript-eslint/parser',
		},
	],
};
