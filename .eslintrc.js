module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		project: "./tsconfig.json",
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:promise/recommended",
	],
	plugins: ["@typescript-eslint", "promise"],
	rules: {
		// "@typescript-eslint/no-var-requires": "off",
		"promise/prefer-await-to-then": "warn",
		"@typescript-eslint/await-thenable": "off",
		"@typescript-eslint/dot-notation": "warn",
	},
	ignorePatterns: ["dist", "node_modules"],
}
