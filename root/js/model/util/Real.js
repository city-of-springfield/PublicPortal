

/**
 * The Real module wraps and transforms a JSON Real object into an immutable representation
 * of a VisAD Real.
 * @module {util/Real}
 * @author Bruce Schubert
 */
define(['model/util/Log'],
    function (log) {
        "use strict";
        /**
         * @constructor
         * @exports Real
         */
        var Real = function (json) {
            if (json === undefined || json === null) {
                throw new Error(log.error('Real', 'constructor', 'json is undefined or null.'));
            }
            this._type = json.type;
            this._unit = json.unit;
            this._value = parseFloat(json.value);
        };
        Object.defineProperties(Real.prototype, {
            /**
             * RealType
             */
            type: {
                get: function () {
                    return this._type;
                }
            },
            /**
             * Unit of measure.
             */
            unit: {
                get: function () {
                    return this._unit;
                }
            },
            /**
             * Floating point value.
             */
            value: {
                /**
                 * @returns {Number}
                 */
                get: function () {
                    return this._value;
                }
            },
            isMissing: {
                get: function () {
                    return isNaN(this._value);
                }
            }
        });
        Real.prototype.getValue = function (unit) {
            if (unit === undefined || unit === null) {
                return this._value;
            }
            if (unit === this._unit) {
                return this._value;
            }
            throw new Error(log.error('Real', 'getValue', 'unit conversion not implemented yet.'));
        };
        Real.prototype.toString = function () {
            if (this.isMissing()) {
                return 'missing';
            }
            return this._value.toString();
        };
        Real.prototype.toValueString = function () {
            if (this.isMissing()) {
                return 'missing';
            }
            return this._value.toString() + (this._unit === undefined || this._unit === null ? '' : ' ' + this._unit);
        };
        Real.prototype.longString = function (pre) {
            if (this.isMissing()) {
                return pre + 'missing';
            }
            return pre + "Real: Value = " + this._value + "  (TypeName: " + this._type + ")";
        };

    });


