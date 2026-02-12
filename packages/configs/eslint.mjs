import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

export const eslintConfig = [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript", "airbnb-base", "prettier"),
  {
    rules: {
      "no-unused-vars": "error",
      "no-var": "error",
      "no-console": "warn",
    },
  },
];
