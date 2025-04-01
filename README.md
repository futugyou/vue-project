# Vue Project State

[![CodeQL](https://github.com/futugyou/vue-project/actions/workflows/codeql.yml/badge.svg?branch=master)](https://github.com/futugyou/vue-project/actions/workflows/codeql.yml)
[![Dependabot](https://github.com/futugyou/vue-project/actions/workflows/dependabot-auto.yml/badge.svg)](https://github.com/futugyou/vue-project/actions/workflows/dependabot-auto.yml)
[![Markdownlint](https://github.com/futugyou/vue-project/actions/workflows/markdownlint.yml/badge.svg)](https://github.com/futugyou/vue-project/actions/workflows/markdownlint.yml)
![CircleCI](https://img.shields.io/circleci/build/github/futugyou/vue-project/master?logo=CircleCI&label=circle-ci)
![GitHub deployments](https://img.shields.io/github/deployments/futugyou/vue-project/Preview?logo=vercel&label=Vercel%20Preview)
![GitHub deployments](https://img.shields.io/github/deployments/futugyou/vue-project/Production?logo=vercel&label=Vercel%20Production)

## Run End-to-End Tests with [Playwright](https://playwright.dev)

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

## Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## update all package

```sh
// npm config set registry https://registry.npm.taobao.org/
// npm config set strict-ssl false 
// npm config set fetch-timeout 60000 
// npm cache clean --force
npx npm-check-updates -u
npm install
```

## remove unused package

```sh
npm install -g depcheck
depcheck
```

[lodashjs](https://www.lodashjs.com/)

[jspdf](https://github.com/parallax/jsPDF)
[jspdfDoc](https://rawgit.com/MrRio/jsPDF/master/docs/index.html)

[pdf.js](https://github.com/mozilla/pdf.js)

[moveable](https://github.com/daybrush/moveable)

[drawio embed](https://www.drawio.com/doc/faq/embed-mode)
