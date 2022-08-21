module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    // "es2021": true
  },
  "extends": "eslint:recommended",
  "overrides": [
    {
      "files": ["*.js"]
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-undef": "warn",
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
  }
};
