/**
 * @fileoverview Rule to replace lodash array map with native map
 * @author Artem Loiko
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/map"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("map", rule, {
    valid: [
        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "Cannot convert lodash map to native",
            errors: [
                {
                    message: "Fill me in.",
                    type: "Me too"
                }
            ]
        }
    ]
});
