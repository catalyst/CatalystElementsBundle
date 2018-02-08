// Import the catalyts elements.
import { CatalystFlipButton } from '../../catalyst-flip-button/dist/catalyst-flip-button.module.js';
import { CatalystToggleButton } from '../../catalyst-toggle-button/dist/catalyst-toggle-button.module.js';
import { CatalystToggleSwitch } from '../../catalyst-toggle-switch/dist/catalyst-toggle-switch.module.js';

/**
 * Register all the elements in this bundle.
 */
function registerCatalystElements() {
  CatalystFlipButton.register();
  CatalystToggleButton.register();
  CatalystToggleSwitch.register();
}

// Export all the catalyst elements and the `registerCatalystElements` function.
export {
  registerCatalystElements,
  CatalystFlipButton,
  CatalystToggleButton,
  CatalystToggleSwitch
};
