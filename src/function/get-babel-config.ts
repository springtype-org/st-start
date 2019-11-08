import { dirname } from "path";
import { defaultCoreJsVersion, defaultJSXPragma } from "../defaults";
import { isDevelopment, isTest } from "./config-getters";
import { getPlatform } from "./get-platform";

export interface IBabelConfig {
    presets: Array<any>;
    plugins: Array<any>;
}

export const getBabelConfig = (): IBabelConfig => {
    const presetEnv = [require('@babel/preset-env')];
    const platform = getPlatform();

    if (platform === 'nodejs') {
        presetEnv.push({
            targets: {
                node: 'current',
            },
        });
    } else {
        presetEnv.push({
            // allow importing core-js in entrypoint
            // use browserlist to select polyfills
            useBuiltIns: 'entry',
            modules: false,
            exclude: ['transform-typeof-symbol'],
            corejs: defaultCoreJsVersion,
        });
    }

    const presets = [
        presetEnv,
        [
            require('@babel/preset-react'),
            {
                // will use the native built-in instead of trying to polyfill
                useBuiltIns: true,
                // TODO: Configurable!
                pragma: defaultJSXPragma,
                pragmaFrag: defaultJSXPragma,
                // adds a stack trace to warnings
                development: isDevelopment() || isTest(),
                throwIfNamespace: false,
            },
        ],
        [require('@babel/preset-typescript'), { jsxPragma: defaultJSXPragma }],
    ];

    const plugins = [
        //require('babel-plugin-macros'),
        [
            require('@babel/plugin-transform-destructuring'),
            {
                loose: false,
                selectiveLoose: [
                    'useCallback',
                    'useMemo',
                    'useRef',
                    'useImperativeHandle',
                    'useLayoutEffect',
                    'useState',
                    'useEffect',
                    'useContext',
                    'useReducer',
                    'useDebugValue',
                ],
            },
        ],
        // legacy TypeScript decorators
        [
            require('../loaders/st-transform-decorator'),
            {
                legacy: true
            },
        ],
        // class { handleClick = () => { } } loose mode, not using Object.defineProperty()
        [
            require('@babel/plugin-proposal-class-properties'),
            {
                loose: true,
            },
        ],
        // {...other, foo: 'bar'} support
        [
            require('@babel/plugin-proposal-object-rest-spread'),
            {
                useBuiltIns: true,
            },
        ],
        // polyfills for async/await, regenerator etc.
        [
            require('@babel/plugin-transform-runtime'),
            {
                regenerator: true,
                corejs: false,
                helpers: false, // TODO: config
                useESModules: true,
                absoluteRuntime: false // TODO: config
                    ? dirname(require.resolve('@babel/runtime/package.json'))
                    : undefined,
            },
        ],
    ];

    plugins.push(
        // adds syntax support for dynamic import()
        require('@babel/plugin-syntax-dynamic-import'),
    );

    if (getPlatform() === 'nodejs') {
        plugins.push(
            // transforms dynamic import to require
            require('babel-plugin-dynamic-import-node'),
        );
    }

    return {
        presets,
        plugins,
    };
}