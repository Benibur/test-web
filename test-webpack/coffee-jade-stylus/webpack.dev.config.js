//
// here the css will be compiled in the bundle.js file (hot reload is then possible)
//

var CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
    devtool: 'eval-source-map',
    entry: "./src/main.coffee",
    output: {
        path: __dirname + "/bin",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.css$/   , loader: "style!css" },
            { test: /\.styl$/  , loader: "style-loader!css-loader!stylus-loader" },
            { test: /\.jade$/  , loader: "jade-loader" }
        ]
    },
    plugins: [
        // copy ressources in the output directory
        new CopyWebpackPlugin([{from:'src/index-build.html', to:'index.html'}])
    ],
    devServer: {
        contentBase: "./bin"
      }
};
