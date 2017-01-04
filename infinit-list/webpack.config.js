// Sources (./src) are copied and built in ./bin
// A server is serving the test page on localhost:3000
var CopyWebpackPlugin  = require('copy-webpack-plugin')
var ExtractTextPlugin  = require('extract-text-webpack-plugin')
var BrowserSyncWebpack = require('browser-sync-webpack-plugin')


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
            { test: /\.jade$/  , loader: "jade-loader" },
			{ test: /\.(jpg|png)$/, loader: 'file' }
        ]
    },
    plugins: [
        // bundle the css in a single file called from the html (this way, css hot reload is not possible)
        new CopyWebpackPlugin([{from:'src/index.html', to:'index.html'}]),
        // copy ressources in the output directory
        new ExtractTextPlugin('bundle.css', {allChunks:true}),
        // BrowserSync
        new BrowserSyncWebpack({
            open: false,
            server: { baseDir: ['./bin'] }
        })
    ],
    devtool: 'source-map'

};
