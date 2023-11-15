module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false
  },
  extends: [
    "eslint:recommended",
    "google",
    "@nuxtjs"
  ],
  rules: {
    quotes: ["error", "double"]
  }
}
