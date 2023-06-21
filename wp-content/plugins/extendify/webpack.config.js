const defaultConfig = require('@wordpress/scripts/config/webpack.config')
const { resolve } = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    ...defaultConfig,
    devServer: {
        ...defaultConfig.devServer,
        host: process.env.WP_DEVHOST || 'wordpress.test',
    },
    plugins: [
        ...defaultConfig.plugins,
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/Library/utility-minimum.css',
                    to: 'utility-minimum.css',
                },
            ],
        }),
    ],
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            '@library': resolve(__dirname, 'src/Library'),
            '@onboarding': resolve(__dirname, 'src/Onboarding'),
            '@assist': resolve(__dirname, 'src/Assist'),
            '@chat': resolve(__dirname, 'src/Chat'),
        },
    },
    entry: {
        extendify: './src/Library/app.js',
        'extendify-onboarding': './src/Onboarding/app.js',
        'extendify-assist': './src/Assist/app.js',
        'extendify-chat': './src/Chat/app.js',
        'editorplus.min': './editorplus/editorplus.js',
        'extendify-deactivate': './src/Library/DeactivationPrompt.js',
    },
    output: {
        filename: '[name].js',
        path: resolve(process.cwd(), 'public/build'),
    },
}
