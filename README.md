# SpringType `start()`

> Bundles and compiles TypeScript/JavaScript projects for any browser and Node.js.

`st-start` is a CLI that imports an optional local `springtype.ts` config module [API](https://github.com/springtype-org/st-start/blob/master/src/interface/ibuild-config.ts) and runs the `start({ ... })` script.

This script uses a dynamic `webpack` and `babel` configuration bundle SpringType TypeScript/JavaScript
projects simply and with the best developer experience.

However, `st-start` it is very well configurable and adapts to many needs easily.

## Install

    yarn add -D st-start

## Usage

### Using the CLI

Create script entries in your `package.json`:

```json
{
    ...
    "scripts": {
        "start:prod": "cross-env NODE_ENV=production st-start",
        "start": "cross-env NODE_ENV=development st-start"
    },
    ...
}
```

Please make sure that `st-start` is installed.

Optionally, create a `springtype.ts` file for customization:

```ts
import { IBuildConfig } from 'st-start';

export default {
    // ...
} as IBuildConfig;
```

### Alternative: Custom build script

Create a script like `start.ts` and paste:

```ts
import { start, IBuildConfig } from 'st-start';

start({
    // ... your custom config here
} as IBuildConfig);
```

Create script entries in your `package.json`:

```json
{
    ...
    "scripts": {
        "start:prod": "cross-env NODE_ENV=production ts-node start.ts",
        "start": "cross-env NODE_ENV=development ts-node start.ts"
    },
    ...
}
```

Please make sure that `ts-node` and `st-start` are installed.

## Build and Test

In a shell:

    # install dependencies
    yarn

    # install fixture dependencies
    cd __test__/fixture
    yarn

    # change back to root dir
    cd ../../

    # build st-start
    yarn build

    # runs a production build and the e2e tests
    yarn test