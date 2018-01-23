# Catalyst Elements

[API documentation & Demos ↗]()

A collection of all the Catalyst Elements.

## Usage

Import the Catalyst Element's bundle on each page it is to be used on:

```html
<script src="dist/catalyst-elements.js"></script>
```

Then all included elements will be available for use - see release notes for details on which elements are included in the bundle.

## Browser Compatibility

See details on the wiki: [Catalyst Elements - Browser Compatibility](https://wiki.wgtn.cat-it.co.nz/wiki/Catalyst_Elements#Browser_Compatibility)

## Contributions

Contributions are most welcome.

Contribution for a particular element should be made on that element's repo.

## Dependencies

Project dependencies are managed through [Yarn](https://yarnpkg.com/lang/en/docs/install/) (not npm directly).

Install dependencies with:

```sh
yarn install
```

## Adding New Elements to this Bundle

In the `package.json` file, add the element as a dependency.

The element's key should be in the form `@catalyst-elements/element-name`.  
(Follow the same pattern that the other elements use).

The element should now automatically be included in future builds.

### Setting Up Automatic Builds

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
    - if [[ $CI_COMMIT_TAG =~ '^v?([0-9]+\.)?([0-9]+\.)?([0-9]+)$' ]]; then
    -   curl -X POST -F token=$CATALYST_ELEMENTS_PIPELINE_TOKEN -F ref=CATALYST_ELEMENTS_PIPELINE_REF https://gitlab.wgtn.cat-it.co.nz/api/v4/projects/1077/trigger/pipeline
    - else
    -   echo "Skipping - $CI_COMMIT_TAG is not a version tag."
    - fi
  only:
    - tags
```

Now whenever a new version tag is release for that element, this repo will be notified and will update accordingly.

## Building the Bundle

First ensure all dependencies are install and that the catalyst-elements are up to date.

```sh
yarn install
yarn upgrade -S @catalyst-elements
```

Then simply run the build task.

```sh
yarn run build
```

## Docs

Docs are build with [Polymer](https://www.polymer-project.org/), the [Polymer Build Tool](https://github.com/Polymer/polymer-build) and the [Polymer Analyzer](https://github.com/Polymer/polymer-analyzer).

Docs will automatically be update on GitLab pages whenever a change is pushed to the master branch.

To build the docs locally, first run the analyzer which will update `./analysis.json`. The docs are then built from this file.

```sh
yarn run analyze
yarn run build-docs
```

The docs will be located under `./docs/`.

In order to view the docs in a web browser, the files need to be served from a web server (they cannot be open using the `file:///` protocall).
