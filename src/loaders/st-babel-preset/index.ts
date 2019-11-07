import { dirname } from 'path';
import { defaultCoreJsVersion, defaultJSXPragma } from '../../defaults';
import { isDevelopment, isTest } from '../../function/config-getters';
import { Platform } from '../../interface/platform';
import { getPlatform } from './../../function/get-platform';
import { IStBabelPresetOptions } from './interface/ioptions';

// @ts-ignore
export default (api: any, opts: IStBabelPresetOptions = {}) => {
    const platform = <Platform>getPlatform();
    const presetEnv = [require('@babel/preset-env')];

    if (!opts.jsxPragma) {
        opts.jsxPragma = defaultJSXPragma;
    }

    if (!opts.jsxPragmaFrag) {
        opts.jsxPragmaFrag = defaultJSXPragma;
    }

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
            corejs: opts.coreJsVersion ? opts.coreJsVersion : defaultCoreJsVersion,
        });
    }

    const presets = [
        presetEnv,
        [
            require('@babel/preset-react'),
            {
                // will use the native built-in instead of trying to polyfill
                useBuiltIns: true,
                pragma: opts.jsxPragma,
                pragmaFrag: opts.jsxPragmaFrag,
                // adds a stack trace to warnings
                development: isDevelopment() || isTest(),
                throwIfNamespace: false,
            },
        ],
        [require('@babel/preset-typescript'), { jsxPragma: opts.jsxPragma }],
    ];

    const plugins = [
        require('babel-plugin-macros'),
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
        [require('@babel/plugin-proposal-decorators'), false],
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
                helpers: opts.enableHelpers,
                useESModules: true,
                absoluteRuntime: opts.useAbsoluteRuntime
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
        overrides: [
            {
                test: /\.tsx?$/,
                plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }]],
            },
        ],
    };
};
