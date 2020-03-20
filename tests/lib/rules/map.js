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

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });
ruleTester.run("map", rule, {
  valid: [
    `[1, 2, 3].map((item) => item)`,
    `
    function someMapperWithCondition(collection) {
      const fn = item => item + 1;
    
      return Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn);
    }
    `,
    `
    function someMapperWithLongCondition(collection) {
      const fn = item => item + 1;
      
      if (Array.isArray(collection)) {
        return collection.map(fn);
      } else {
        return _.map(collection, fn);
      }
    }
    `,
    `
    function someMapperWithReverse(collection) {
      const fn = item => item + 1;
    
      return !Array.isArray(collection) ? _.map(collection, fn) : collection.map(fn);
    }
    `,
    `
    const obj = { a: 1, b: 2, c: 3 };
    const mappedObj = _.map(obj, fn);
    `
  ],

  invalid: [
    {
      code: `
      let letArr = [1, 2, 3];
      var varArr = [1, 2, 3];
      const fn = item => item + 1;
      const letArrMapped = _.map(letArr, (item) => item);
      const varArrMapped = _.map(varArr, fn);
      `,
      errors: [{ message: "Add native Array#map" }, { message: "Add native Array#map" }],
      output: `
      let letArr = [1, 2, 3];
      var varArr = [1, 2, 3];
      const fn = item => item + 1;
      const letArrMapped = Array.isArray(letArr) ? letArr.map((item) => item) : _.map(letArr, (item) => item);
      const varArrMapped = Array.isArray(varArr) ? varArr.map(fn) : _.map(varArr, fn);
      `
    },
    {
      code: `
      const constArr = [1, 2, 3];
      const fn = item => item + 1;
      const constArrMapped = _.map(constArr, fn);
      const literalMapped = _.map([1, 2, 3], fn);
      `,
      errors: [{ message: "Add native Array#map" }, { message: "Add native Array#map" }],
      output: `
      const constArr = [1, 2, 3];
      const fn = item => item + 1;
      const constArrMapped = constArr.map(fn);
      const literalMapped = [1, 2, 3].map(fn);
      `
    },
    {
      code: `
      const constArr = [1, 2, 3];
      const fn = item => item + 1;
      const mapperWithOuterVar = () => {
        return _.map(constArr, fn);
      };
      `,
      errors: [{ message: "Add native Array#map" }],
      output: `
      const constArr = [1, 2, 3];
      const fn = item => item + 1;
      const mapperWithOuterVar = () => {
        return constArr.map(fn);
      };
      `
    },
    {
      code: `
      var varobj = { a: 1, b: 2, c: 3 };
      const mappedVarObj = _.map(varobj, fn);
      `,
      errors: [{ message: "Add native Array#map" }],
      output: `
      var varobj = { a: 1, b: 2, c: 3 };
      const mappedVarObj = Array.isArray(varobj) ? varobj.map(fn) : _.map(varobj, fn);
      `
    }
  ]
});
