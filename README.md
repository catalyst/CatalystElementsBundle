# Catalyst Elements Bundle

[![David](https://img.shields.io/david/catalyst/CatalystElementsBundle.svg?style=flat-square)](https://david-dm.org/catalyst/CatalystElementsBundle)
[![David](https://img.shields.io/david/dev/catalyst/CatalystElementsBundle.svg?style=flat-square)](https://david-dm.org/catalyst/CatalystElementsBundle?type=dev)
[![npm (scoped)](https://img.shields.io/npm/v/@catalyst-elements/bundle.svg?style=flat-square)](https://www.npmjs.com/package/@catalyst-elements/bundle)
[![Bower not supported](https://img.shields.io/badge/bower-not_supported-red.svg?style=flat-square)]()
[![Polymer 2 not supported](https://img.shields.io/badge/Polymer_2-not_supported-red.svg?style=flat-square)]()
[![Polymer 3 support pending](https://img.shields.io/badge/Polymer_3-support_pending-yellow.svg?style=flat-square)]()

[API documentation & Demos ↗](https://catalyst.github.io/CatalystElementsBundle/)

A bundle of all the [Catalyst Elements](https://github.com/catalyst/CatalystElements).

## Installation

Install with npm:

```sh
npm install --save @catalyst-elements/bundle
```

Install with yarn:

```sh
yarn add @catalyst-elements/bundle
```

Please note that this package is not compatible with Bower.

## Usage

### As a Module (Recommend)

Import the module on each page that uses the component.

```html
<script type="module" src="node_modules/@catalyst-elements/bundle/catalyst-elements.js"></script>
```

All included elements will now be available for use - see release notes for details on which elements are included in the bundle.

### As a Script

Import the script on each page that uses one or more catalyst elements.

```html
<script src="node_modules/@catalyst-elements/bundle/catalyst-elements.es5.min.js"></script>
```

Please note that this script has been transpiled to es5 and thus use of `custom-elements-es5-adapter.js` or an equivalent library is required. See [es5 support](https://github.com/catalyst/CatalystElements/wiki/Browser-Compatibility#es5-support) on the Catalyst Elements wiki for details.

All included elements will now be available for use - see release notes for details on which elements are included in the bundle.

## Browser Compatibility

See details on the wiki: [Browser Compatibility](https://github.com/catalyst/CatalystElements/wiki/Browser-Compatibility)

## Contributions

Contributions are most welcome. Please read our [contributing guidelines](CONTRIBUTING.md) first.

Contribution for a particular element should be made on that element's repo.
