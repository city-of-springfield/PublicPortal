

/**
 * Math utiltities module for WMT.
 * @author Bruce Schubert
 * @module {util/WmtMath}
 * @param {Object} WorldWind
 */
define(['worldwind'],
    function (ww) {
        "use strict";
        var WmtMath = {
            /**
             * Computes the angle between two Vec3 objects.
             * @param {Vec3} a
             * @param {Vec3} b
             * @returns {Number} Degrees.
             */
            angleBetween: function (a, b) {
                if (!a || !b) {
                    throw new WorldWind.ArgumentError(
                        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE,
                            "Terrain", "projectOnty", "missingVector"));
                }
                var dot = a.dot(b),
                    length = a.magnitude() * b.magnitude();
                // Normalize the dot product, if necessary.
                if (!(length === 0) && (length !== 1.0)) {
                    dot /= length;
                }
                // The normalized dot product should be in the range [-1, 1]. Otherwise the result is an error from floating
                // point roundoff. So if a_dot_b is less than -1 or greater than +1, we treat it as -1 and +1 respectively.
                if (dot < -1.0) {
                    dot = -1.0;
                }
                else if (dot > 1.0) {
                    dot = 1.0;
                }
                // Angle is arc-cosine of normalized dot product ack.
                return Math.acos(dot) * WorldWind.Angle.RADIANS_TO_DEGREES;
            },
            /**
             * 
             * @param {Vec3} a
             * @param {Vec3} b
             * @param {Vec3} result
             * @returns {Vec3} result
             */
            projectOnto: function (a, b, result) {
                if (!a || !b || !result) {
                    throw new WorldWind.ArgumentError(
                        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "Terrain", "projectOnty", "missingVector"));
                }
                var dot = a.dot(b),
                    length = b.magnitude();
                // Normalize the dot product, if necessary
                if (!(length === 0) && (length !== 1.0)) {
                    dot /= length;
                }
                result.copy(b).multiply(dot);
                return result;
            },
            /**
             * 
             * @param {Vec3} a
             * @param {Vec3} b
             * @param {Vec3} result
             * @returns {Vec3}
             */
            perpendicularTo: function (a, b, result) {
                if (!a || !b || !result) {
                    throw new WorldWind.ArgumentError(
                        WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "Terrain", "projectOnty", "missingVector"));
                }
                var projected = new WorldWind.Vec3();
                this.projectOnto(a, b, projected);
                result.copy(a).subtract(projected);
                return result;
            }
        };
        return WmtMath;
    }
);

