import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

import baseConfig from "../eslint.config.js";

export default defineConfig([
    ...baseConfig,
    react.configs.flat.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: { globals: globals.browser },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react/prop-types": "off",
            "react-refresh/only-export-components": "off",
            "react-hooks/incompatible-library": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]);
