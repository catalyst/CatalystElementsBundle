# Development

## Getting the code

1. Fork the repo.
2. Clone your fork.
3. Install [Node](https://nodejs.org/en/download/). It comes bundled with [yarn](https://yarnpkg.com/).
4. Install the [dependencies](#dependencies)

## Dependencies

Project dependencies are managed through [Yarn](https://yarnpkg.com/lang/en/docs/install/).

Install dependencies with:

```sh
yarn
```

## Viewing the bundle

First analyze the projcet then start up the included local webserver:

```sh
yarn run analyze
yarn run serve
```

Then visit http://127.0.0.1:8081/components/@catalyst-elements/bundle to load up un unbuilt version of the docs.

Please note that as this is an unbuild version of the docs, not all browser will be able to view the page. To view the built version of the docs see [Docs](#docs)

## Adding New Elements to this Bundle

In the `package.json` file, add the element as a dependency.

The element's key should be in the form `@catalyst-elements/element-name`.
(Follow the same pattern that the other elements use).

In the `src/catalyst-elements.js` file, import the element with `import Element from ...`.

The element will now be included in future builds.

## Building the Bundle

First ensure all dependencies are install and that the catalyst-elements are up to date.

```sh
yarn
yarn upgrade -S @catalyst-elements
```

Then simply run the build task.

```sh
yarn run build
```

## Docs

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
