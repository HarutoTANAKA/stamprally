module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  // parser: 'babel-eslint',
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {}
}
