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

        const isCollectionTypeArrayExpression = collection.type === "ArrayExpression";
        if (isCollectionTypeArrayExpression) {
          context.report({
            node,
            message: "Add native Array#map",
            fix: ruleFixer
          });
          return;
        }

        const isCollectionTypeIdentifier = collection.type === "Identifier";
        if (!isCollectionTypeIdentifier) {
          return;
        }

        const collectionIdentifierType = getVariableType(collection.name, context.getScope());
        if (collectionIdentifierType === "ArrayExpression") {
          context.report({
            node,
            message: "Add native Array#map",
            fix: ruleFixer
          });
          return;
        } else if (collectionIdentifierType !== undefined) {
          return;
        }

        // reverse() called to start from the closest parent
        const parents = context.getAncestors().reverse();
        const closestCondition = parents.find(
          parent => parent.type === "ConditionalExpression" || parent.type === "IfStatement"
        );

        const isAlreadyConditionUsed =
          closestCondition && isTestArrayIsArray(closestCondition.test);
        if (isAlreadyConditionUsed) {
          return;
        }

        const callbackText = context.getSourceCode().getText(callbackFunction);
        context.report({
          node,
          message: "Add native Array#map",
          fix: function(fixer) {
            return fixer.insertTextBefore(
              node,
              `Array.isArray(${collection.name}) ? ${collection.name}.map(${callbackText}) : `
            );
          }
        });
      }
    };
  }
};

function isTestArrayIsArray(node) {
  let callExpression;
  if (node.type === "CallExpression") {
    callExpression = node;
  } else if (node.type === "UnaryExpression" && node.argument.type === "CallExpression") {
    callExpression = node.argument;
  } else {
    return;
  }

  return (
    callExpression.callee.object.name === "Array" &&
    callExpression.callee.property.name === "isArray"
  );
}

function getVariableType(varName, scope) {
  const findVarRecursively = (varName, scope) => {
    const variable = scope.variables.find(curVar => curVar.name === varName);
    if (variable) return variable;
    return scope.upper ? findVarRecursively(varName, scope.upper) : undefined;
  };

  const variable = findVarRecursively(varName, scope);
  if (!variable) return;

  const varDefinitionList = variable.defs;
  const varDefinition = varDefinitionList.find(varDefinition => {
    const isDefinitionInit = varDefinition.node.init;
    const isDefinitionOfConst = varDefinition.kind === "const";
    return isDefinitionInit && isDefinitionOfConst;
  });

  return varDefinition && varDefinition.node.init.type;
}
