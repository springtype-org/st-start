export interface IStBabelPresetOptions {
    enableHelpers?: boolean; // default: true
    useAbsoluteRuntime?: boolean; // default: false
    jsxPragma?: string; // default: tsx
    jsxPragmaFrag?: string; // default: tsx
    coreJsVersion?: number; // default: 3
}