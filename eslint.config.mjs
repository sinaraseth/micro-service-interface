import js from "@eslint/js";
import typescript from "typescript-eslint";

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
];
