# Replace lodash map with native (map)

JavaScript ES6 have a lot of new methods for working with arrays. Before ES6 we were using Lodash or undescore libs for working with arrays, however it is better to use native methods. It works faster and reduces bundle size.
So we will replace lodash map if firstArgument is arrayExpression or definetely Array (for example declared with const).
For example

```js
const definitelyArray = [1, 2, 3];

_.map(definitelyArray, fn);

_.map([1, 2, 3], fn);
```

Will be rewritten as:

```js
const definitelyArray = [1, 2, 3];

definitelyArray.map(fn);

[1, 2, 3].map(fn);
```

Otherwise we will replace the lodash map with next condition

```js
_.map(collection, fn);
```

Will be rewritten as:

```js
Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn);
```

If we sure that collection is not Array, it won't be changed

```js
const notArray = { a: 2, b: 3, c: 4 };
_.map(notArray, fn);
```

## Rule Details

This rule is aimed at preventing using external library and decreasing bundle size by ensuring that native method can be used. It will warn when \_.map is used with array.
