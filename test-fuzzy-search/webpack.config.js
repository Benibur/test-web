// Les sources (./src) sont buildées dans ./bin pour être servis via le serveur de BrowserSync (--watch)
// Source d'inspiration pour rajouter d'autres fonctions (ugly...) : https://github.com/cozy/cozy-proxy/blob/master/client/webpack.config.js

const CopyWebpackPlugin  = require('copy-webpack-plugin')
const ExtractTextPlugin  = require('extract-text-webpack-plugin')
const BrowserSyncWebpack = require('browser-sync-webpack-plugin')
const path               = require('path')


module.exports = {

    entry: "./src/main.js",

    output: {
        path    : __dirname + "/bin",
        filename: "bundle.js"
    },

    resolveLoader: {
      alias: {"build-loader": path.join(__dirname, "./tools/build-loader.js") }
    },

    module: {
        loaders: [
            // this loader duplicates the lib into a version for debug with logs and a version for perf tests,
            // both libs can be used in the same application.
            { test: /fuzzy-words-search-for-paths.js$/, loader: ['build-loader'] },
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.css$/   , loader: "style!css" },
            { test: /\.styl$/  , loader: ExtractTextPlugin.extract({
                fallback:'style-loader',
                use:'css-loader!stylus-loader'
              })
            },
            { test: /\.jade$/  , loader: "jade-loader" }
        ]
    },

    plugins: [
        // bundle the css in a single file called from the html (this way, css hot reload is not possible)
        new CopyWebpackPlugin([{from:'src/index-dev.html', to:'index.html'},{from:'tools/path-list.json',to:'path-list.json'}]),
        // copy ressources in the output directory
        new ExtractTextPlugin('bundle.css'),
        // BrowserSync
        new BrowserSyncWebpack({
            open: false,
            server: { baseDir: ['./bin'] }
        })
    ],

    devtool: 'source-map'
};
