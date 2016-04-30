module.exports = {
    entry: "./main.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.styl$/, loader: "style-loader!css-loader!stylus-loader" },
            { test: /\.jade$/, loader: "jade-loader" }
        ]
    }
};