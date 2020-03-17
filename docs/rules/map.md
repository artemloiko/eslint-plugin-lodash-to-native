# Replace lodash map with native (map)

JavaScript ES6 have a lot of new methods for working with arrays. Before ES6 we were using Lodash or undescore libs for working with arrays, however it is better to use native methods. It works faster and reduces bundle size.
So it will replace lodash map which is used for arrays.

```js
_.map(array, fn);
```

Will be rewritten as:

```js
array.map(fn);
```

## Rule Details

This rule is aimed at preventing using external library and decreasing bundle size by ensuring that native method can be used. It will warn when \_.map is used with array.
