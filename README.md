# Catalyst Elements

[![pipeline status](https://gitlab.wgtn.cat-it.co.nz/CatalystElements/CatalystElements/badges/master/pipeline.svg)](https://gitlab.wgtn.cat-it.co.nz/CatalystElements/CatalystElements/pipelines)
[![License](https://img.shields.io/badge/license-BSD%203--Clause-blue.svg)](LICENSE)
[![Not published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-unpublished-red.svg)](https://gitlab.wgtn.cat-it.co.nz/CatalystElements/CatalystElements)

[API documentation & Demos ↗](http://catalystelements.pages.gitlab.wgtn.cat-it.co.nz/CatalystElements/)

A collection of all the Catalyst Elements.

## Installation

```sh
npm install --save "git+https://git@gitlab.wgtn.cat-it.co.nz/CatalystElements/CatalystElements.git"
```

## Usage

Import the Catalyst Element's bundle on each page that uses one or more catalyst elements:

```html
<script src="dist/catalyst-elements.js"></script>
```

Then all included elements will be available for use - see release notes for details on which elements are included in the bundle.

### Usage as a Module

Import the module on each page that uses one or more catalyst elements, then register all the elements:

```html
<script type="module">
  // Import all the Catalyst Elements.
  import { * as CatalystElements } from 'dist/catalyst-elements.module.js';

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

## Browser Compatibility

See details on the wiki: [Catalyst Elements - Browser Compatibility](https://wiki.wgtn.cat-it.co.nz/wiki/Catalyst_Elements#Browser_Compatibility)

## Contributions

Contributions are most welcome.

Contribution for a particular element should be made on that element's repo.

## Development

### Dependencies

Project dependencies are managed through [Yarn](https://yarnpkg.com/lang/en/docs/install/) (not npm directly).

Install dependencies with:

```sh
yarn install
```

### Adding New Elements to this Bundle

In the `package.json` file, add the element as a dependency.

The element's key should be in the form `@catalyst-elements/element-name`.  
(Follow the same pattern that the other elements use).

In the `src/catalyst-elements.js` file, import the element with `import { Element } from ...` - Do not use `import * as ...`.

The element will now be included in future builds.

#### Setting Up Automatic Builds

When creating a new release of an element, that element can automatically trigger a new build and release of the catalyst-elements bundle.

To set this up, configure the element's `.gitlab-ci.yml` file like so:

```yml
stages:
  - deploy

update_catalyst_elements:
  stage: deploy
  before_script:
    - apt-get update && apt-get install -y curl
  script:
    - VERSION_REGEX='^v?([0-9]+\.)?([0-9]+\.)?([0-9]+)$'
    - if [[ $CI_COMMIT_TAG =~ $VERSION_REGEX ]]; then
    -   curl -X POST -F token=$CATALYST_ELEMENTS_PIPELINE_TOKEN -F ref=CATALYST_ELEMENTS_PIPELINE_REF https://gitlab.wgtn.cat-it.co.nz/api/v4/projects/1077/trigger/pipeline
    - else
    -   echo "Skipping - $CI_COMMIT_TAG is not a version tag."
    - fi
  only:
    - tags
```

Now whenever a new version tag is release for that element, this repo will be notified and will update accordingly.

### Building the Bundle

First ensure all dependencies are install and that the catalyst-elements are up to date.

```sh
yarn install
yarn upgrade -S @catalyst-elements
```

Then simply run the build task.

```sh
yarn run build
```

### Docs

Docs are build with [Polymer](https://www.polymer-project.org/), the [Polymer Build Tool](https://github.com/Polymer/polymer-build) and the [Polymer Analyzer](https://github.com/Polymer/polymer-analyzer).

Docs will automatically be update on GitLab pages whenever a change is pushed to the master branch.

To build the docs locally, first run the analyzer which will update `./analysis.json`. The docs are then built from this file.

```sh
yarn run analyze
yarn run build-docs
```

The docs will be located under `./docs/`.

In order to view the docs in a web browser, the files need to be served from a web server (they cannot be open using the `file:///` protocall).
