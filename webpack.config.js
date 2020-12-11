const path = require("path");

module.exports = (env) => {
    return {
        mode: env.prod ? "production" : "development",
        devtool: env.prod ? undefined : 'inline-source-map',
        entry: './src/index.tsx',
        output: {
            filename: 'bundle.js',
            path: __dirname + '/build',
            publicPath: '/'
        },
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