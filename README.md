# Catalyst Elements

[API documentation & Demos ↗](http://catalystelements.pages.gitlab.wgtn.cat-it.co.nz/CatalystElements/)

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
