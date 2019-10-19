
export const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
export const host = process.env.HOST || '0.0.0.0';
export const port = process.env.PORT || '4444';

export const babelOptions = {
    "presets": [
        [
            "@babel/preset-env",
            {
                //useBuiltIns: 'entry',
                //corejs: 3,
                //modules: "commonjs"
            },
            
        ]
    ],
    "plugins": [
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ],
};