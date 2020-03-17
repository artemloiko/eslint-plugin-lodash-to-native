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
      "CallExpression > MemberExpression": function(node) {
        const isLodashMap = node.object.name === "_" && node.property.name === "map";
        if (!isLodashMap) {
          return;
        }
        const callExpression = node.parent;
        const collection = callExpression.arguments[0];
        const callbackFunction = callExpression.arguments[1];

        const ruleFixer = function(fixer) {
          return [
            fixer.removeRange([node.start, collection.start]),
            fixer.replaceTextRange([collection.end, callbackFunction.start], ".map(")
          ];
        };

        const isCollectionArrayExpression = collection.type === "ArrayExpression";

        if (isCollectionArrayExpression) {
          context.report({
            node,
            message: "Replace with native Array#map",
            fix: ruleFixer
          });
          return;
        }

        const isCollectionIdentifier = collection.type === "Identifier";
        if (!isCollectionIdentifier) return;

        const collectionName = collection.name;
        const collectionType = getVariableType(collectionName, context.getScope(), node.start);
        if (collectionType === "ArrayExpression") {
          context.report({
            node,
            message: "Replace with native Array#map",
            fix: ruleFixer
          });
        }
      }
    };
  }
};

function getVariableType(varName, scope, positionStartWhereVarUsed) {
  const findVarRecursively = (varName, scope) => {
    const variable = scope.variables.find(curVar => curVar.name === varName);
    if (variable) return variable;
    return scope.upper ? findVarRecursively(varName, scope.upper) : undefined;
  };

  const variable = findVarRecursively(varName, scope);
  if (!variable) return;

  // reversed to find the closest to using definition, starting from the farthest
  const varDefinitionListReversed = variable.defs.reverse();
  const varDefinition = varDefinitionListReversed.find(varDefinition => {
    const isDefinitionInit = varDefinition.node.init;
    const isDefinitionBeforeUsed = varDefinition.node.end < positionStartWhereVarUsed;
    return isDefinitionInit && isDefinitionBeforeUsed;
  });

  return varDefinition.node.init.type;
}
