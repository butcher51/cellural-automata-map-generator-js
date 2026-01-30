import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";

export default [
    {
        ignores: [
            "node_modules/",
            "**/*.min.js",
            "**/*.bundle.js",
            "coverage/",
            "dist/",
            "build/",
        ],
    },
    js.configs.recommended,
    {
        files: ["**/*.js"],
        plugins: {
            import: importPlugin,
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                // Browser globals
                window: "readonly",
                document: "readonly",
                console: "readonly",
                requestAnimationFrame: "readonly",
                cancelAnimationFrame: "readonly",
                Image: "readonly",
                localStorage: "readonly",
                fetch: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                // Node globals (for server.js)
                process: "readonly",
                __dirname: "readonly",
            },
        },
        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js"],
                },
            },
        },
        rules: {
            // Recommended base rules
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-undef": "error",
            "no-console": "off",
            "prefer-const": "warn",
            "no-var": "error",

            // Import validation (stricter)
            "import/no-unresolved": "error",
            "import/named": "error",
            "import/default": "error",
            "import/no-duplicates": "error",
            "import/first": "error",
            "import/newline-after-import": "warn",
            "import/no-unused-modules": "warn",

            // Code quality
            eqeqeq: ["error", "always"],
            curly: ["error", "all"],
            "no-eval": "error",
            "no-implied-eval": "error",
            "no-unused-expressions": "error",
            "no-implicit-globals": "error",
            "no-shadow": "warn",
            "no-use-before-define": ["error", { "functions": false, "classes": true }],

            // Style preferences
            semi: ["warn", "always"],
            quotes: ["warn", "double", { avoidEscape: true }],
            indent: ["warn", 4],
            "comma-dangle": ["warn", "always-multiline"],
        },
    },
];
