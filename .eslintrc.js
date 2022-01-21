module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  // extends: ['plugin:react/recommended', 'airbnb', 'plugin:@typescript-eslint/recommended'],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    // 'no-use-before-define': 'off',
    // '@typescript-eslint/no-use-before-define': ['error'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-shadow': 'off',
    // '@typescript-eslint/no-shadow': ['error'],
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    "prettier/prettier": [
      "warn",
      {
        printWidth: 100,
        tabWidth: 4,
        singleQuote: true,
        semi: true,
        trailingComma: 'es5',
        useTabs: false,
        "object-curly-spacing": ["error", "always"],
        "array-bracket-spacing": ["error", "always"],
        "computed-property-spacing": ["error", "always"]
      }
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
