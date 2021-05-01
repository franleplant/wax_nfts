module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks"],
  env: {
    browser: true,
    node: true,
    mocha: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],

  rules: {
    "react/display-name": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],

    //"@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: false, variables: false },
    ],
    // note you must disable the base rule as it can report incorrect errors
    //"no-unused-vars": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
  },
  overrides: [
    {
      files: ["*.tsx?"],
      rules: {
        "@typescript-eslint/no-var-requires": "error",
      },
    },
  ],

  settings: {
    react: {
      version: "detect",
    },
  },
};
