

/**
 * The Locator module is responsble for locating the host device's geographic location
 * and centering the globe's crosshairs on this location.
 * @param {type} log
 * @param {type} messenger
 * @module Locator
 * @author Bruce Schubert
 */
define(['jquery',
        'model/Explorer'],
    function ($, explorer) {
        "use strict";
        var Locator = {
            /**
             * Center's the globe on the user's current position using the GeoLocation API.
             * @description Centers the globe on the user's current position.
             * @public
             */
            locateCurrentPosition: function () {
                // Prerequisite: GeoLocation API
                if (!window.navigator.geolocation) {
                    $.growl.warning({title: "Locate Not Supported",
                        message: "Sorry, your system doesn't support GeoLocation."});
                    return;
                }

                $.growl({title: "Locating...", message: "Setting your location."});

                // Use the GeoLocation API to get the current position.
                window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        /**
                         * onSuccess callback centers the crosshairs on the given position
                         * @param {GeoLocation.Position} position Coordinates and accuracy information.
                         */
                        explorer.lookAtLatLon(
                            position.coords.latitude,
                            position.coords.longitude);
                    },
                    function (error) {
                        /**
                         * onFail callback notifies the user of the error
                         * @param {GeoLocation.PositionError} error Error message and code.
                         */
                        var reason, messageText;
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                reason = "User denied the request for Geolocation.";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                reason = "Location information is unavailable.";
                                break;
                            case error.TIMEOUT:
                                reason = "The request to get user location timed out.";
                                break;
                            case error.UNKNOWN_ERROR:
                                reason = "An unknown error occurred in Geolocation.";
                                break;
                            default:
                                reason = "An unhandled error occurred in Geolocation.";
                        }
                        messageText = "<h3>Sorry. " + reason + "</h3>"
                            + "<p>Details: " + error.message + "</p>";
                        $.growl({message: messageText});

                    });
            }
        };

        return Locator;
    }
);
