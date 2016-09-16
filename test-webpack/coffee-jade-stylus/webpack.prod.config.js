//
// here the css will be compile in a seperated css file (no hot reload possible)
//

var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
    entry: "./src/main.coffee",
    output: {
        path: __dirname + "/bin",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.css$/   , loader: "style!css" },
            { test: /\.styl$/  , loader: ExtractTextPlugin.extract('style-loader','css-loader!stylus-loader') },
            { test: /\.jade$/  , loader: "jade-loader" }
        ]
    },
    plugins: [
        // bundle the css in a single file called from the html (this way, css hot reload is not possible)
        new CopyWebpackPlugin([{from:'src/index-prod.html', to:'index.html'}]),
        // copy ressources in the output directory
        new ExtractTextPlugin('bundle.css', {allChunks:true})
    ],
    devServer: {
        contentBase: "./bin"
      }
};
