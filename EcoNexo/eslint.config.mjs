import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/set-state-in-render": "off",
      "react-hooks/immutability": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
  globalIgnores([
    "*.js",
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    ".netlify/**",
    ".agent/**",
    "public/**",
    "android/**",
    "ios/**",
    "mcp-server/**",
    "EcoNexo/**",
    "execution/**",
    "scripts/**",
    "next-env.d.ts",
  ]),
]);
