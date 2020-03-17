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
    `['1', '2', '3'].map(console.log)`,
    `[[1, 2, 3], [1, 2, 3]].map(console.log)`,
    `[1, 2, 3].map(console.log)`,
    `
      var obj = {
        a: 1,
        b: 2,
        c: 3
      };
      var fn = function(item) { return item + 1; };
      var mappedObj = _.map(obj, fn);
      var obj = [1, 2, 3];
    `,
    `_.map("string", console.log)`,
    `
      var fn = function(item) { return item + 1; };
      _.map({}, fn)
    `
  ],

  invalid: [
    {
      code: `
        var mappedArr = _.map([1, 2, 3], fn);
      `,
      errors: [
        {
          message: "Replace with native Array#map"
        }
      ]
    },
    {
      code: `
        var arr = [1, 2, 3];
        var fn = function(item) { return item + 1; };
        var mappedArr = _.map(arr, fn);
      `,
      errors: [
        {
          message: "Replace with native Array#map"
        }
      ]
    },
    {
      code: `
        var arr;
        var arr = [1, 2, 3];
        var fn = function(item) { return item + 1; };
        var mappedArr = _.map(arr, fn);
        var arr = "string";
      `,
      errors: [
        {
          message: "Replace with native Array#map"
        }
      ]
    }
  ]
});
