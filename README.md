# Catalyst Elements

[![David](https://img.shields.io/david/catalyst/CatalystElements.svg?style=flat-square)](https://david-dm.org/catalyst/CatalystElements)
[![David](https://img.shields.io/david/dev/catalyst/CatalystElements.svg?style=flat-square)](https://david-dm.org/catalyst/CatalystElements?type=dev)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/collection/catalyst/CatalystElements)
[![Polymer 2 not supported](https://img.shields.io/badge/Polymer_2-not_supported-red.svg?style=flat-square)]()
[![Polymer 3 support pending](https://img.shields.io/badge/Polymer_3-support_pending-yellow.svg?style=flat-square)]()

[API documentation & Demos ↗](https://catalyst.github.io/CatalystElements/)

A collection of all the Catalyst Elements.

| Element | NPM Version | Build Status | Polymer Support | Standalone |
|:--------|:-----------:|:------------:|:---------------:|:----------:|
| [catalyst-flip-button](https://github.com/catalyst/catalyst-flip-button) | [![npm (scoped)](https://img.shields.io/npm/v/@catalyst-elements/catalyst-flip-button.svg?style=flat-square)](https://www.npmjs.com/package/@catalyst-elements/catalyst-flip-button) | [![Travis](https://img.shields.io/travis/catalyst/catalyst-flip-button.svg?style=flat-square)](https://travis-ci.org/catalyst/catalyst-flip-button) | ![Polymer 2 not supported](https://img.shields.io/badge/Polymer_2-no-red.svg?style=flat-square) ![Polymer 3 support pending](https://img.shields.io/badge/Polymer_3-pending-yellow.svg?style=flat-square) | ![Standalone yes](https://img.shields.io/badge/standalone-yes-blue.svg?style=flat-square) |
| [catalyst-toggle-button](https://github.com/catalyst/catalyst-toggle-button) | [![npm (scoped)](https://img.shields.io/npm/v/@catalyst-elements/catalyst-toggle-button.svg?style=flat-square)](https://www.npmjs.com/package/@catalyst-elements/catalyst-toggle-button) | [![Travis](https://img.shields.io/travis/catalyst/catalyst-toggle-button.svg?style=flat-square)](https://travis-ci.org/catalyst/catalyst-toggle-button) | ![Polymer 2 not supported](https://img.shields.io/badge/Polymer_2-no-red.svg?style=flat-square) ![Polymer 3 support pending](https://img.shields.io/badge/Polymer_3-pending-yellow.svg?style=flat-square) | ![Standalone yes](https://img.shields.io/badge/standalone-yes-blue.svg?style=flat-square) |
| [catalyst-toggle-switch](https://github.com/catalyst/catalyst-toggle-switch) | [![npm (scoped)](https://img.shields.io/npm/v/@catalyst-elements/catalyst-toggle-switch.svg?style=flat-square)](https://www.npmjs.com/package/@catalyst-elements/catalyst-toggle-switch) | [![Travis](https://img.shields.io/travis/catalyst/catalyst-toggle-switch.svg?style=flat-square)](https://travis-ci.org/catalyst/catalyst-toggle-switch) | ![Polymer 2 not supported](https://img.shields.io/badge/Polymer_2-no-red.svg?style=flat-square) ![Polymer 3 support pending](https://img.shields.io/badge/Polymer_3-pending-yellow.svg?style=flat-square) | ![Standalone yes](https://img.shields.io/badge/standalone-yes-blue.svg?style=flat-square) |

## Installation

Install with npm:

```sh
npm install --save @catalyst-elements/bundle
```

Install with yarn:

```sh
yarn add @catalyst-elements/bundle
```

## Usage

### As a Module (Recommend)

Import the module on each page that uses the component.

```html
<script type="module" src="node_modules/@catalyst-elements/bundle/dist/catalyst-elements.module.js"></script>
```

All included elements will now be available for use - see release notes for details on which elements are included in the bundle.

### As a script

Import the Catalyst Element's bundle on each page that uses one or more catalyst elements.

```html
<script src="node_modules/@catalyst-elements/bundle/dist/catalyst-elements.js"></script>
```

## Browser Compatibility

See details on the wiki: [Browser Compatibility](https://github.com/catalyst/CatalystElements/wiki/Browser-Compatibility)

## Contributions

Contributions are most welcome.

Contribution for a particular element should be made on that element's repo.

## Development

### Dependencies

Project dependencies are managed through [Yarn](https://yarnpkg.com/lang/en/docs/install/).

Install dependencies with:

```sh
yarn
```

### Viewing the bundle

First analyze the projcet then start up the included local webserver:

```sh
yarn run analyze
yarn run serve
```

Then visit http://127.0.0.1:8081/components/@catalyst-elements/bundle to load up un unbuilt version of the docs.

Please note that as this is an unbuild version of the docs, not all browser will be able to view the page. To view the built version of the docs see [Docs](#docs)

### Adding New Elements to this Bundle

In the `package.json` file, add the element as a dependency.

The element's key should be in the form `@catalyst-elements/element-name`.  
(Follow the same pattern that the other elements use).

In the `src/catalyst-elements.js` file, import the element with `import { Element } from ...` - Do not use `import * as ...`.

The element will now be included in future builds.

<!-- #### Setting Up Automatic Builds

When creating a new release of an element, that element can automatically trigger a new build and release of the catalyst-elements bundle.

To set this up, configure the element's `.gitlab-ci.yml` file like so:

```yml
stages:
  - deploy

update_bundle:
  stage: deploy
  script:
    - VERSION_REGEX='^v?([0-9]+\.)?([0-9]+\.)?([0-9]+)$'
    - if [[ $CI_COMMIT_TAG =~ $VERSION_REGEX ]]; then
    -   apt-get update && apt-get install -y curl
    -   curl -X POST -F token=$CATALYST_ELEMENTS_PIPELINE_TOKEN -F ref=$CATALYST_ELEMENTS_PIPELINE_REF https://gitlab.wgtn.cat-it.co.nz/api/v4/projects/1077/trigger/pipeline
    - else
    -   echo "Skipping - $CI_COMMIT_TAG is not a version tag."
    - fi
  only:
    - tags

```

Now whenever a new version tag is release for that element, this repo will be notified and will update accordingly. -->

### Building the Bundle

First ensure all dependencies are install and that the catalyst-elements are up to date.

```sh
yarn
yarn upgrade -S @catalyst-elements
```

Then simply run the build task.

```sh
yarn run build
```

### Docs

Docs are build with [Polymer](https://www.polymer-project.org/), the [Polymer Build Tool](https://github.com/Polymer/polymer-build) and the [Polymer Analyzer](https://github.com/Polymer/polymer-analyzer).

To build the docs, first run the analyzer which will update `./analysis.json`. This file contains all the infomation about the bundle the docs will use.

```sh
yarn run analyze
yarn run build-docs
```

The docs are located under `./docs/`.

To view the docs locally, first start up a local webserver:

```sh
yarn run serve
```

Then visit http://127.0.0.1:8081/docs/
