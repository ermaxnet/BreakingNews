const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const root = path.join(__dirname, "wwwroot/static");
const viewComponentsRoot = path.join(__dirname, "Views/Shared/Components/");
const ViewComponents = [
    "Touch/Scripts/index.js",
    "Search/Scripts/index.js",
    "Notice/Scripts/index.js"
].map(componentRoot => viewComponentsRoot + componentRoot);

const AssetLoader = {
    loader: "url-loader",
    options: {
        limit: 10000,
        name: "media/[name].[ext]"
    }
};

const CssLoader = [
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: "/BreakingNews/static/"
        }
    },
    { 
        loader: "css-loader",
        options: { 
            sourceMap: true 
        } 
    },
    {
        loader: "postcss-loader",
        options: {
            ident: "postcss",
            plugins: (loader) => [
                require("postcss-flexbugs-fixes"),
                require("autoprefixer")({
                    browsers: [
                        ">1%",
                        "last 4 versions",
                        "Firefox ESR",
                        "not ie < 9"
                    ],
                    flexbox: 'no-2009'
                })
            ],
            sourceMap: true
        }
    }
];

module.exports = env => {
    env = env || { MODE: "development" };

    return {
        mode: env.MODE,
        target: "web",
        entry: [
            require.resolve("./wwwroot/scripts/polyfills.js"),
            "./wwwroot/scripts/main.js",
            ...ViewComponents
        ],
        output: {
            path: root,
            filename: "js/main.js",
            publicPath: "/"
        },
        module: {
            rules: [{
                oneOf: [
                    {
                        test: /\.svg$/,
                        use: [
                            AssetLoader,
                            {
                                loader: "svgo-loader",
                                options: {
                                    plugins: [
                                        { removeTitle: true },
                                        { removeUselessDefs: false },
                                        { cleanupIDs: {
                                            remove: false
                                        } }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        test: [ /\.bpm$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
                        ...AssetLoader
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true
                        }
                    },
                    {
                        test: /\.css$/,
                        use: CssLoader
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            ...CssLoader,
                            { 
                                loader: "sass-loader",
                                options: { 
                                    sourceMap: true 
                                } 
                            }
                        ]
                    },
                    {
                        loader: "file-loader",
                        exclude: [ /\.(js|json)$/, /\.html$/ ],
                        options: {
                            name: "media/[name].[ext]"
                        }
                    }
                ]
            }]
        },
        resolve: {
            descriptionFiles: [ "package.json" ],
            modules: [ 
                "node_modules",
                path.join(__dirname, "wwwroot/assets/scss"),
                path.join(__dirname, "wwwroot/assets/images") 
            ]
        },
        plugins: [
            new CleanWebpackPlugin(
                path.join(__dirname, "wwwroot/static")
            ),
            new CopyWebpackPlugin([
                { 
                    from: "wwwroot/assets/images/apple-touch-icon.png", 
                    to: "media/apple-touch-icon.png" 
                },
                { 
                    from: "wwwroot/assets/images/favicon.ico", 
                    to: "media/favicon.ico" 
                },
                { 
                    from: "wwwroot/assets/images/android-chrome-192x192.png", 
                    to: "media/android-chrome-192x192.png" 
                },
                { 
                    from: "wwwroot/assets/images/android-chrome-512x512.png", 
                    to: "media/android-chrome-512x512.png" 
                },
                { 
                    from: "wwwroot/assets/images/site.webmanifest", 
                    to: "media/site.webmanifest" 
                },
                { 
                    from: "wwwroot/assets/images/favicon.svg", 
                    to: "media/favicon.svg" 
                },
                { 
                    from: "wwwroot/assets/images/favicon-16x16.png", 
                    to: "media/favicon-16x16.png" 
                },
                { 
                    from: "wwwroot/assets/images/favicon-32x32.png", 
                    to: "media/favicon-32x32.png" 
                }
            ]),
            new MiniCssExtractPlugin({
                filename: "css/[name].css"
            }),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ],
        devtool: "cheap-source-map",
        performance: {
            hints: false
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    common: {
                        chunks: "initial",
                        name: "common",
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0
                    },
                    vendor: {
                        test: /node_modules/,
                        chunks: "initial",
                        name: "vendor",
                        priority: 10,
                        enforce: true
                    }
                }
            }
        }
    };
};