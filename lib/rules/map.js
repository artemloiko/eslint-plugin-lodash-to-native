/**
 * @fileoverview Rule to replace lodash array map with native map
 * @author Artem Loiko
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "replace lodash map with native",
            category: "Best Practices",
            recommended: false,
            url:
                "https://github.com/artuom130/eslint-plugin-lodash-to-native/blob/master/docs/rules/map.md"
        },
        fixable: "code",
        schema: [] // no options
    },
    create: function(context) {
        return {
            // callback functions
        };
    }
};
