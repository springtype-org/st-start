# SpringType `start()`

> Bundles and compiles TypeScript/JavaScript projects for any browser and Node.js.

`st-start` is a CLI that imports an optional local `springtype.ts` config module ([API](https://github.com/springtype-org/st-start/src/interface/ibuild-config.ts)) and runs the `start({ ... })` script.

This script uses a dynamic `webpack` and `babel` configuration bundle SpringType TypeScript/JavaScript
projects simply and with the best developer experience.

However, `st-start` it is very well configurable and adapts to many needs easily.

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

Please make sure that `st-start` are installed.

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

## Test

To run the tests, enter the directory: `__test__/fixture` and run: `yarn` to install the dependencies. These tests are based on jest but are in fact real-world / end-2-end tests.

    yarn e2e
