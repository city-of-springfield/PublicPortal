
/**
 * The Formatter utiltity provides convienient methods for obtaining pretty strings. 
 * @module {Formatter}
 * @author Bruce Schubert
 */
define([
    'model/util/WmtUtil', 'worldwind'],
    function (
        util,
        ww) {
        "use strict";
        /**
         * Provides useful utilities specicially for WMT.
         * @exports WmtUtil
         */
        var Formatter = {
            /**
             * Returns a number formatted as decimal degrees: [+/-]DD.DDDD°.
             * @param {Number} number The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees.
             */
            formatDecimalDegrees: function (number, decimals) {
				
                return parseFloat(number).toFixed(decimals) + "\u00b0";
            },
            /**
             * Returns a number formatted as decimal minutes: [+/-]DD°MM.MMM'
             * @param {Number} number The value to be formatted.
             * @param {Number} decimals The number decimal places for minutes.
             * @returns {String} The number formatted as decimal degrees.
             */
            formatDecimalMinutes: function (number, decimals) {
                // Truncate degrees, keeping the sign.
                var degrees = Math.floor(number) + (number < 0 ? 1 : 0),
                    minutes = WorldWind.WWMath.fabs(number - degrees) * 60;

                return degrees + "\u00b0" + minutes.toFixed(decimals) + "\'";
            },
            /**
             * Returns a number formatted as degrees-minutes-seconds: [+/-]DD°MM'SS.SS".
             * @param {Number} number The value to be formatted.
             * @param {Number} decimals The number decimal places for seconds.
             * @returns {String} The number formatted as decimal degrees.
             */
            formatDegreesMinutesSeconds: function (number, decimals) {
                // Truncate degrees, keeping the sign.
                var degrees = Math.floor(number) + (number < 0 ? 1 : 0),
                    minutesNum = WorldWind.WWMath.fabs(number - degrees) * 60,
                    minutesInt = Math.floor(minutesNum),
                    seconds = WorldWind.WWMath.fabs(minutesNum - minutesInt) * 60;

                return degrees + "\u00b0" + minutesInt + "\'" + seconds.toFixed(decimals) + "\"";
            },
            /**
             * Returns a number formatted as decimal degrees latitude: DD.DDDD°[N/S].
             * @param {Number} latitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees latitude.
             */
            formatDecimalDegreesLat: function (latitude, decimals) {
                var number = WorldWind.WWMath.fabs(latitude);
				
                return this.formatDecimalDegrees(number, decimals) + (latitude >= 0 ? "N" : "S");
            },
            /**
             * Returns a number formatted as decimal degrees longitude: DD.DDDD°[E/W].
             * @param {Number} longitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees longitude.
             */
            formatDecimalDegreesLon: function (longitude, decimals) {
                var number = WorldWind.WWMath.fabs(longitude);
				
                return this.formatDecimalDegrees(number, decimals) + (longitude >= 0 ? "E" : "W");
            },
            /**
             * Returns a number formatted as decimal minutes latitude: DD°MM.MMM[N/S].
             * @param {Number} latitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees latitude.
             */
            formatDecimalMinutesLat: function (latitude, decimals) {
                var number = WorldWind.WWMath.fabs(latitude);
                return this.formatDecimalMinutes(number, decimals) + (latitude >= 0 ? "N" : "S");
            },
            /**
             * Returns a number formatted as decimal minutes longitude: DD°MM.MMM'[E/W].
             * @param {Number} longitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees longitude.
             */
            formatDecimalMinutesLon: function (longitude, decimals) {
                var number = WorldWind.WWMath.fabs(longitude);
                return this.formatDecimalMinutes(number, decimals) + (longitude >= 0 ? "E" : "W");
            },
            /**
             * Returns a number formatted as degrees, minutes, seconds latiude: DD°[N/S].
             * @param {Number} latitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees longitude.
             */
            formatDMSLatitude: function (latitude, decimals) {
                var number = WorldWind.WWMath.fabs(latitude);
                return this.formatDegreesMinutesSeconds(number, decimals) + (latitude >= 0 ? "N" : "S");
            },
            /**
             * Returns a number formatted as degrees, minutes, seconds longitude: DD°[E/W].
             * @param {Number} longitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees longitude.
             */
            formatDMSLongitude: function (longitude, decimals) {
                var number = WorldWind.WWMath.fabs(longitude);
                return this.formatDegreesMinutesSeconds(number, decimals) + (longitude >= 0 ? "E" : "W");
            },
            /**
             * Returns a number formatted as degrees: DD.DDD°
             * @param {Number} angle The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees.
             */
            formatAngle360: function (angle, decimals) {
                while (angle < 0) {
                    angle += 360;
                }
                while (angle >= 360) {
                    angle -= 360;
                }
                return angle.toFixed(decimals) + "\u00b0";
            },
            /**
             * Returns a number formatted as +/- 180 degrees: DD.DDD°
             * @param {Number} angle The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as +/- decimal degrees.
             */
            formatAngle180: function (angle, decimals) {
                while (angle > 180) {
                    angle -= 360;
                }
                while (angle < -180) {
                    angle += 360;
                }
                return angle.toFixed(decimals) + "\u00b0";
            },
            /**
             * Format an altitude with a units suffix.
             * @param {Number} altitude Meters.
             * @param {String} units Optional. 
             * @returns {String} Formatted string with units.
             */
            formatAltitude: function (altitude, units) {
                // Convert from meters to the desired units format.
                if (units === "km") {
                    altitude /= 1e3;
                }
                // Round to the nearest integer and place a comma every three digits. See the following Stack Overflow thread
                // for more information:
                // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
				
                return altitude.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + units;

            },
            formatDayOfMonthTime: function (datetime, locale) {
                var timeOptions =
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    }, dateOptions =
                    {
                        day: "2-digit"
                    };

                return datetime.toLocaleDateString(locale || 'en', dateOptions)
                    + ' ' + datetime.toLocaleTimeString(locale || 'en', timeOptions);
            },
            /**
             * Formats an angle to slope as a percent of slope.
             * @param {type} angle
             * @param {type} decimals
             * @returns {String} Formatted string with % sign.
             */
            formatPercentSlope: function (angle, decimals) {
                while (angle < 0) {
                    angle += 360;
                }
                while (angle >= 360) {
                    angle -= 360;
                }
                var percent = Math.tan(angle * util.DEG_TO_RAD) * 100;
                return percent.toFixed(decimals) + "%";
            },

        };
        return Formatter;
    }
);