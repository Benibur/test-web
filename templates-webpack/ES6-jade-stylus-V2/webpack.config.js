// Les sources (./src) sont copiées ou buildées dans ./bin
// un --watch
// Source d'inspiration pour rajouter d'autres fonctions (ugly...) : https://github.com/cozy/cozy-proxy/blob/master/client/webpack.config.js

var CopyWebpackPlugin  = require('copy-webpack-plugin')
var ExtractTextPlugin  = require('extract-text-webpack-plugin')
// var BrowserSyncWebpack = require('browser-sync-webpack-plugin')

module.exports = {
    entry: "./src/main.js",
    output: {
        path    : __dirname + "/bin",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/   , loader: "style!css" },
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.styl$/  , loader: 'style-loader!css-loader!stylus-loader' },
            { test: /\.jade$/  , loader: "jade-loader" }
        ]
    },
    plugins: [
        // bundle the css in a single file called from the html (this way, css hot reload is not possible)
        new CopyWebpackPlugin([{from:'src/index-dev.html', to:'index.html'}]),
        // copy ressources in the output directory
        new ExtractTextPlugin('bundle.css', {allChunks:true}),
        // BrowserSync
        // new BrowserSyncWebpack({
        //     open: false,
        //     server: { baseDir: ['./bin'] }
        // })
    ],
    devtool: 'source-map'
};
