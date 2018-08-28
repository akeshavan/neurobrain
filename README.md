# neuroimage (not the journal)

## Get started

Clone this repo, cd into the folder, then do:

```bash
yarn install --ignore-engines
yarn build #or yarn dev for hot reload
```

In another webpack build (like https://github.com/akeshavan/neurobrain_example), symlink to this repo in the `node_modules` folder, and then you should be able to import:

```js
import { Viewer } from 'neurobrain';

const v = new Viewer("foo");
```


## Readings

* [Start your own JavaScript library using webpack and ES6](http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6)

## Misc

### An example of using dependencies that shouldn’t be resolved by webpack, but should become dependencies of the resulting bundle

In the following example we are excluding React and Lodash:

```js
{
  devtool: 'source-map',
  output: {
    path: '...',
    libraryTarget: 'umd',
    library: '...'
  },
  entry: '...',
  ...
  externals: {
    react: 'react'
    // Use more complicated mapping for lodash.
    // We need to access it differently depending
    // on the environment.
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: '_',
      root: '_'
    }
  }
}
```
