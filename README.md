# Vue Project State

[![CodeQL](https://github.com/futugyou/vue-project/actions/workflows/codeql.yml/badge.svg?branch=master)](https://github.com/futugyou/vue-project/actions/workflows/codeql.yml)
[![Dependabot](https://github.com/futugyou/vue-project/actions/workflows/dependabot-auto.yml/badge.svg?branch=master)](https://github.com/futugyou/vue-project/actions/workflows/dependabot-auto.yml)

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### update all package
```
npx npm-check-updates -u
npm install 
```
[lodashjs](https://www.lodashjs.com/)