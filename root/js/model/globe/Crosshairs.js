
define(['worldwind'],
    function (ww) {
        "use strict";
        
        var Crosshairs = function (imagePath) {

            var sOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5),
                iPath = imagePath + "32x32-crosshair-outline.png";

            WorldWind.ScreenImage.call(this, sOffset, iPath);

            // Must set the default image offset and scale after calling the constructor above.
            // Align the center of the image with the center of the screen
            this.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);               
            // Scale the default image.
            this.imageScale = 1.2;
        };

        Crosshairs.prototype = Object.create(WorldWind.ScreenImage.prototype);

        return Crosshairs;
    }
);