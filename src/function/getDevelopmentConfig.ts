import { Configuration } from "webpack";
import { IBuildConfig } from "../interface/ibuild-config";
import { getDefaultESLintConfig } from "./getDefaultESLintConfig";
import { getDefaultIndexHTMLConfig } from "./getDefaultIndexHTMLConfig";
import { getDefaultWebpackConfig } from "./getDefaultWebpackConfig";

import webpack = require("webpack");

// common
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// dev only
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

export const getDevelopmentConfig = (config: IBuildConfig): Configuration => {
    
    const privateConfig = getDefaultWebpackConfig(config);

    privateConfig.plugins = [
        ...privateConfig.plugins || [],
        new ErrorOverlayPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new CopyWebpackPlugin(config.copyFiles || []),
        new ForkTsCheckerWebpackPlugin({
            ...getDefaultESLintConfig(config),
        }),
        new ForkTsCheckerNotifierWebpackPlugin({ 
            title: 'TypeScript', 
            excludeWarnings: config.ignoreWarnings || false 
        }),
        new HtmlWebpackPlugin({
            ...getDefaultIndexHTMLConfig(config)
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ManifestPlugin(),

    ];
    return privateConfig;
};