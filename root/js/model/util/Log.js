

/**
 * @module Log.
 * @returns {Log}
 */
define([],
    function () {
        "use strict";
        var Log = {
            /**
             * Logs an error message.
             * @param {String} className - The name of the class/object generating the log entry.
             * @param {String} functionName - The name of the function generating the log entry.
             * @param {String} message - The message or a name of a predefined message (see messageTable).
             * @returns {String} The message that was logged.
             */
            error: function (className, functionName, message) {
                var msg = this.makeMessage(className, functionName, message);
                console.error(msg);
                return msg;
            },
            /**
             * Logs a warning message.
             * @param {String} className - The name of the class/object generating the log entry.
             * @param {String} functionName - The name of the function generating the log entry.
             * @param {String} message - The message or a name of a predefined message (see messageTable).
             * @returns {String} The message that was logged.
             */
            warning: function (className, functionName, message) {
                var msg = this.makeMessage(className, functionName, message);
                console.warn(msg);
                return msg;
            },
            /**
             * Logs an information message.
             * @param {String} className - The name of the class/object generating the log entry.
             * @param {String} functionName - The name of the function generating the log entry.
             * @param {String} message - The message or a name of a predefined message (see messageTable).
             * @returns {String} The message that was logged.
             */
            info: function (className, functionName, message) {
                var msg = this.makeMessage(className, functionName, message);
                console.info(msg);
                return msg;
            },
            /**
             * @returns {String}
             */
            makeMessage: function (className, functionName, message) {
                var msg = this.messageTable[message] || message;

                return className + (functionName ? "." : "") + functionName + ": " + msg;
            },
            /**
             * Predefined message strings.
             */
            messageTable: {// KEEP THIS TABLE IN ALPHABETICAL ORDER
                constructor: "Constructing the object.",
                missingTerrain: "The specified terrain is null or undefined."
            }
        };
        return Log;
    }

);

