

/**
 * Provides utilities for working with cookies.
 * 
 * @module {Cookie}
 */
define([],
    function () {
        "use strict";
        var Cookie = {
            /**
             * Saves the name/value pair in a cookie.
             * @param {String} cookieName The value to be formatted.
             * @param {String} cookieValue The number decimal places.
             * @param {Number} expirationDays The number days before the cookie expires.
             */
            save: function (cookieName, cookieValue, expirationDays) {
                var d = new Date(),
                    expires;
                d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
                expires = "expires=" + d.toUTCString();
                document.cookie = cookieName + "=" + cookieValue + "; " + expires;
            },
            /**
             * Gets the value for the given cookie name.
             * @param {String) cookieName The cookie name to search for.
             * @returns {String} The cookie value or an empty string if not found.
             */
            read: function (cookieName) {
                var name,
                    cookies,
                    cookieKeyValue,
                    i;
                // Establish the text to search for
                name = cookieName + "=";
                // Split the cookie property into an array 
                cookies = document.cookie.split(';');
                for (i = 0; i < cookies.length; i++) {
                    cookieKeyValue = cookies[i];
                    // Strip/trim spaces
                    while (cookieKeyValue.charAt(0) === ' ') {
                        cookieKeyValue = cookieKeyValue.substring(1);
                    }
                    // Return the value associated with the name
                    if (cookieKeyValue.indexOf(name) === 0) {
                        return cookieKeyValue.substring(name.length, cookieKeyValue.length);
                    }
                }
                return "";
            }

        };

        return Cookie;
    }
);
