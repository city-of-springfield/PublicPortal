
define(['model/Constants', 'worldwind'],
    function (constants, ww) {
        "use strict";
        /**
         * Constructs a view controls layer.
         * @param {WorldWindow} worldWindow
         * @constructor
         */
        var EnhancedViewControlsLayer = function (worldWindow) {

            ww.ViewControlsLayer.call(this, worldWindow);

            // Override the default placement at bottom-left and place at top-left
            // Leave room at the top for the Coordinates output
            this.placement = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0,
                WorldWind.OFFSET_FRACTION, 1);
            this.alignment = new WorldWind.Offset(
                WorldWind.OFFSET_PIXELS, -10,
                WorldWind.OFFSET_INSET_PIXELS, -18);

        };
        // Inherit the ViewControlsLayer methods
        EnhancedViewControlsLayer.prototype = Object.create(ww.ViewControlsLayer.prototype);

        return EnhancedViewControlsLayer;
    }
);