
/**
 * Header content module
 *
 * @param {type} ko
 * @returns {HeaderViewModel}
 */
define(['knockout'],
    function (ko) {
        "use strict";
        /**
         * The view model for the Header panel.
         * @constructor
         */
        function OutputViewModel() {
            var self = this;
            self.appName = ko.observable("World Wind Explorer");
        }

        return OutputViewModel;
    }
);
