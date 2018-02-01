// Import the catalyts elements.
import { CatalystFlipButton } from '../../catalyst-flip-button/dist/catalyst-flip-button.module.js';
import { CatalystToggleButton } from '../../catalyst-toggle-button/dist/catalyst-toggle-button.module.js';

/**
 * Register all the elements in this bundle.
 */
function registerCatalystElements() {
  CatalystFlipButton.register();
  CatalystToggleButton.register();
}

// Export all the catalyst elements and the `registerCatalystElements` function.
export {
  registerCatalystElements,
  CatalystFlipButton,
  CatalystToggleButton
};
