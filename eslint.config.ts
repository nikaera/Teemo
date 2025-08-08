import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import { fileURLToPath } from "url";
import { dirname } from "path";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default [
  js.configs.recommended,
  { ignores: ["node_modules", "build"] },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir,
        sourceType: "module",
        ecmaVersion: 2020,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
    },
    rules: {
      ...tseslint.configs["recommended"].rules,
      ...tseslint.configs["recommended-type-checked"].rules,
    },
  },
  prettier,
];
