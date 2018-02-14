// Import the element.
import { CatalystFlipButton } from '../../../@catalyst-elements/catalyst-flip-button/dist/catalyst-flip-button.module.js';

/**
 * Load the polymer elements.
 */
function loadPolymerElements() {
  import('../../../@polymer/iron-demo-helpers/demo-snippet.js');
}

// Register the element.
if (window.WebComponents === undefined || window.WebComponents.ready) {
  CatalystFlipButton.register();
  loadPolymerElements();
} else {
  window.addEventListener('WebComponentsReady', () => {
    CatalystFlipButton.register();
    loadPolymerElements();
  });
}
