# Angular Architects - Essentials Workshop

This special Angular Essentials Workshop for Raiffeisen Software was originally generated with the [Angular CLI](https://github.com/angular/angular-cli) by [@Manfred Steyer](https://twitter.com/ManfredSteyer) and has since been improved and updated by [@LX_T](https://twitter.com/LX_T), currently using Angular V17.3.3.

## Slides

You'll find the workshop slides in the `slides` directory.

## Exercises

You'll find the workshop labs in the `labs` directory.

## Free ebook

You'll find a free ebook by my collegue Manfred Steyer in the `book` directory.

## Installation

Run `npm i` or `yarn` to install all dependencies.

## Development

Run `ng s` for a dev server. Navigate to `http://localhost:4200/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [JEST](https://jestjs.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

### HowTo install cypress bypassing your Proxy

If you have problems installing Cypress please try this workaround:

1. Remove these two lines `"cypress": "^13.7.2",` and `"@cypress/schematic": "^2.5.1",` from the `devDependencies` your `package.json` and then run `npm i` (or `yarn`).

2. Download cypress.zip from here: https://docs.cypress.io/guides/getting-started/installing-cypress#Direct-download

3. In your terminal / prompt run this command: `CYPRESS_INSTALL_BINARY=~/Downloads/cypress.zip npm install cypress --save-dev`

4. In your `package.json` re-add this to your `devDependencies`: `"@cypress/schematic": "^2.5.1",`

5. Run `npm i` (or `yarn`) once more.

6. Test via `ng s` and `ng e2e` (in two separate terminals).

## Further help

Use `ng help`, contact your trainer [Alex T.](https://alex.thalhammer.name) or go check out our website [Angular Architects](https://www.angulararchitects.io).
