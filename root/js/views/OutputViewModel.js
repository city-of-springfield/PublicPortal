
/**
 * Output content module
 *
 * @param {type} ko
 * @param {type} $
 * @returns {OutputViewModel}
 */
define(['knockout',
    'jquery',
    'model/Constants'],
    function (ko, $, constants) {

        /**
         * The view model for the Output panel.
         * @constructor
         */
        function OutputViewModel(globe) {
            var self = this;

            this.globe = globe;

            // Get a reference to the SelectController's selectedItem observable
            this.selectedItem = this.globe.selectController.lastSelectedItem;

            // The viewTemplate defines the content displayed in the output pane.
            this.viewTemplateName = ko.observable(null);

            // Update the view template from the selected object.
            this.selectedItem.subscribe(function (newItem) {
                // Determine if the new item has a view template
                if (newItem !== null) {
                    if (typeof newItem.viewTemplateName !== "undefined") {
                        self.viewTemplateName(newItem.viewTemplateName);
                    } else {
                        self.viewTemplateName(null);
                    }
                }
            });
        }

        return OutputViewModel;
    }
);
