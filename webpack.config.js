const path = require("path");
const analyser = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (env) => {
    return {
        mode: env.prod ? "production" : "development",
        devtool: env.prod ? undefined : 'inline-source-map',
        entry: {
            app: {
                import: './src/index.tsx',
                dependOn: "vendors"
            },
            vendors: ["framer-motion", "@fortawesome/react-fontawesome", "@fortawesome/free-solid-svg-icons", "ace-builds"]
        },
        output: {
            filename: '[name]-bundle.js',
            path: __dirname + '/build',
            publicPath: '/'
        },
        plugins: [
            new analyser({analyzerMode: env.analyse ? "server" : "disabled"})
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                "@config": path.join(__dirname, "src", "config", env.prod ? "live": "local"),
                "@src": path.join(__dirname, "src"),
                "react": "preact/compat",
                "react-dom": "preact/compat"
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: '/node_modules/'
                }
            ]
        },
        devServer: {
            host: "localhost.app.com",
            port: 30,
            contentBase: './wwwroot',
            publicPath: '/',
            hot: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            historyApiFallback: true,
          }
    };
};