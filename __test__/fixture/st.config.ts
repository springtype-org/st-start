import { setConfig } from "../../dist/function/set-config";

setConfig({
    environments: {
        aron: 'development',
        nightly: 'development'
    },
    env: 'aron',
    watchMode: false,
    enableBundleAnalyzer: false,
});