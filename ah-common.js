(function ($) {
    'use strict';

    // Global namespace
    window.BOA = window.BOA || {};

    BOA.helpers = {
        /**
         * Simple confirm wrapper used anywhere
         */
        confirm: function (message) {
            return window.confirm(message || 'Are you sure?');
        }
    };

    $(document).ready(function () {
        // صرف debug کیلئے
        // console.log('BOA common JS loaded');
    });

})(jQuery);
