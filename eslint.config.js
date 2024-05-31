import unusedImports from "eslint-plugin-unused-imports";
import eslintPluginSvelte from 'eslint-plugin-svelte';

export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  ...eslintPluginSvelte.configs['flat/prettier'],
  {
    plugins: {"unused-imports": unusedImports},
    rules: {
      "svelte/valid-compile": ["error", { ignoreWarnings: true }],
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
          "warn",
          {
              "vars": "all",
              "varsIgnorePattern": "^_",
              "args": "after-used",
              "argsIgnorePattern": "^_",
          },
      ]
    },
    ignores: [
        "node_modules",
        "*.d.ts",
        "*.html",
        "*.css",
        ".vscode/*",
        "*.log"
      ]
  }
];