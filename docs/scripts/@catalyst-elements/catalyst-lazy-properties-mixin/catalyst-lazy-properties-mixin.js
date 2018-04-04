const mixinId = Symbol('CatalystLazyPropertiesMixinID');

/**
 * `<catalyst-lazy-properties-mixin>` is a mix in funcation that retruns a class that extends the given super class.
 * The returned class will be the same as the super class except it will also have support for lazy properties.
 *
 * A user may set a property on an _instance_ of an element before its prototype has been connected to its class.
 * This mix provides the `upgradeProperty` method which will check for any instance properties and run them through
 * the proper class setters.
 *
 * See the [lazy properties](https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties)
 * section for more details.
 *
 * @mixinFunction
 * @polymer
 *
 * @param {Class} MixWith
 *   The class to extend/apply this mixin to.
 * @returns {Class.<CatalystLazyProperties>}
 */
const catalystLazyPropertiesMixin = MixWith => {
  // Does this class already have this mixin applied?
  if (MixWith[mixinId] === true) {
    return MixWith;
  }

  // Apply the mixin.
  return class CatalystLazyProperties extends MixWith {
    /**
     * Construct the mixin.
     *
     * @public
     */
    constructor() {
      super();
      this[mixinId] = true;
    }

    /**
     * Upgrade the property on this element with the given name.
     *
     * @protected
     * @param {string} prop
     *   The name of a property.
     */
    upgradeProperty(prop) {
      // If the property exists.
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        // Delete it and reset it.
        const value = this[prop];
        delete this[prop];
        this[prop] = value;
      } else if (this.hasAttribute(prop)) {
        // Else if an attribute exists for the property, set the property using it.
        this[prop] = this.getAttribute(prop);
      }
    }
  };
};

export default catalystLazyPropertiesMixin;
export { catalystLazyPropertiesMixin };
