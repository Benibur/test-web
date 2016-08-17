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
            { test: /\.styl$/  , loader: "style-loader!css-loader!stylus-loader" },
            { test: /\.jade$/  , loader: "jade-loader" }
        ]
    },
    devServer: {
        contentBase: "./bin"
      }
};