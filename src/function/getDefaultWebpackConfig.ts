import { existsSync } from "fs";
import { resolve } from "path";
import { Configuration } from "webpack";
import { babelOptions } from "../defaults";
import { IBuildConfig } from "../interface/ibuild-config";
import webpack = require("webpack");

const PnpWebpackPlugin = require("pnp-webpack-plugin");

const stringifyDefinitions = (definitions: any = {}): any => {
    for (let name in definitions) {
        definitions[name] = JSON.stringify(definitions[name]);
    }
}

export const getDefaultWebpackConfig = (config: IBuildConfig): Configuration => {

    // @ts-ignore
    const privateConfig: Configuration = {};

    privateConfig.mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    privateConfig.context = config.context || process.cwd();
    privateConfig.entry = {
        main: [
            config.entryPoint || existsSync('./src/index.tsx') ? './src/index.tsx' : './src/index.ts' 
        ]
    }
    //privateConfig.safari10NoModuleFix =  'inline-data-base64';

    privateConfig.output = {
        path: config.outputPath || resolve(process.cwd(), 'dist'),
        filename: config.outputFileName || '[name].[hash:6].js',
        publicPath: config.publicPath || ""
    }

    privateConfig.plugins = [
        new webpack.DefinePlugin({
            ...stringifyDefinitions(config.definitions) || {},
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ];

    privateConfig.resolve = {
        symlinks: false,
        extensions: config.fileExtensions || [".tsx", ".ts", ".js"],
        plugins: [
            PnpWebpackPlugin,
        ]
    };

    privateConfig.resolveLoader =  {
        plugins: [
            PnpWebpackPlugin.moduleLoader(module),
        ],
    };
    
    privateConfig.devtool = 'cheap-module-source-map';

    privateConfig.module = {
        rules: [
            {
                test: /.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: babelOptions
                    },
                    {
                        loader: require.resolve('ts-loader'),
                        options: PnpWebpackPlugin.tsLoaderOptions({ 
                            transpileOnly: true 
                        })
                    }
                ]
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: babelOptions
                    }
                ]
              }
        ]
    };
    return privateConfig;
}