# Catalyst Elements

[![License](https://img.shields.io/badge/license-BSD%203--Clause-blue.svg?style=flat-square)](LICENSE)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/collection/catalyst/CatalystElements)

[API documentation & Demos ↗](https://catalyst.github.io/CatalystElements/)

A collection of all the Catalyst Elements.

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

Import the module on each page that uses one or more catalyst elements, then register all the elements.

```html
<script type="module">
  // Import all the Catalyst Elements.
  import * as CatalystElements from './node_modules/@catalyst-elements/bundle/dist/catalyst-elements.module.js';

  // If not using web component polyfills or if polyfills are ready, register all the Catalyst Elements.
  if (window.WebComponents === undefined || window.WebComponents.ready) {
    CatalystElements.registerCatalystElements();
  }
  // Otherwise wait until the polyfills are ready.
  else {
    window.addEventListener('WebComponentsReady', () => {
      CatalystElements.registerCatalystElements();
    });
  }
</script>
```

All included elements will now be available for use - see release notes for details on which elements are included in the bundle.

### As a script

Import the Catalyst Element's bundle on each page that uses one or more catalyst elements.

```html
<script src="./node_modules/@catalyst-elements/bundle/dist/catalyst-elements.js"></script>
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
yarn run fix-dependencies
```

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

To build the docs, first run the analyzer which will update `./analysis.json`. The docs are then built from this file.

```sh
yarn run analyze
yarn run build-docs
```

The docs will be located under `./docs/`.

In order to view the docs in a web browser, the files need to be served from a web server (they cannot be open using the `file:///` protocall).
