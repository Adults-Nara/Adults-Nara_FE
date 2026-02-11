import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import storybook from "eslint-plugin-storybook";

const compat = new FlatCompat();

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
  ...storybook.configs["flat/recommended"],
];
