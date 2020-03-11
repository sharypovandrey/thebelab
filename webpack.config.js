const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const shimJS = path.resolve(__dirname, "src", "emptyshim.js");
function shim(regExp) {
  return new webpack.NormalModuleReplacementPlugin(regExp, shimJS);
}
const pkg = require("./package.json");

module.exports = {
  mode: 'production',
  // watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: ['node_modules/**', 'examples/**']
  },
  devtool: "source-map",
  entry: ["./src/index.js"],
  output: {
    filename: "thebelab.js",
    // path: path.resolve(__dirname, "lib"),
    path: path.resolve(__dirname, 'dist'),
    publicPath: "https://unpkg.com/" + pkg.name + "@" + pkg.version + "/dist/",
  },
  plugins: [
    // get slim jQuery
    new webpack.NormalModuleReplacementPlugin(
      /jquery$/,
      "jquery/dist/jquery.slim.js"
    ),
    // Not using moment
    shim(/moment/),
    // Don't need vim keymap
    shim(/codemirror\/keymap\/vim/),
    shim(/codemirror\/addon\/search/),
    // shim out some unused packages
    shim(/elliptic/),
    shim(/bn\.js/),
    shim(/readable\-stream/),
    // can we get away without react-dom?
    shim(/react\-dom/),
    // skip postcss
    shim(/postcss/),
    shim(/font\-awesome/),
    // shim(/ajv/),
    // shim(/lodash/),
    // shim(/@phosphor\/coreutils\/lib\/random/),
    // shim out some unused phosphor
    shim(
      /@phosphor\/widgets\/lib\/(box|commandpalette|contextmenu|dock|grid|menu|scroll|split|stacked|tab).*/
    ),
    shim(/@phosphor\/collections\/lib\/(bplustree).*/),
    shim(/@phosphor\/(dragdrop|commands).*/),

    // unused @jupyterlab
    // shim(/@jupyterlab\/apputils/),
    shim(
      /@jupyterlab\/apputils\/lib\/(clientsession|dialog|instancetracker|mainareawidget|mainmenu|thememanager|toolbar|widgettracker)/
    ),
    // shim(/@jupyterlab\/apputils\/style\/.*/),

    // JupyterLab's codemirror package is also big,
    // but not so trival to shim
    // we only need CodeMirrorEditor.defaultConfig to be defined, as far as I can tell
    // shim(/@jupyterlab\/codemirror\/lib\/editor/),
    shim(/@jupyterlab\/codeeditor\/lib\/jsoneditor/),
    shim(/@jupyterlab\/coreutils\/lib\/(time|settingregistry|.*menu.*)/),
    shim(/@jupyterlab\/services\/lib\/(contents|terminal)\/.*/),
    shim(/@jupyterlab\/statusbar\/.*/),
    shim(/@jupyterlab\/theme-light-extension\/style\/(icons|images)\/.*/),
    shim(/@jupyterlab\/theme-light-extension\/style\/(urls).css/),

    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "../webpack.stats.html",
    }),
  ],
  optimization: {},
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                  shippedProposals: true,
                  targets: {
                    browsers: [
                      "chrome 60",
                      "edge 15",
                      "firefox 45",
                      "safari 10",
                    ],
                  },
                },
              ],
            ],
          },
        },
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.html$/, loader: "file-loader" },
      // jquery-ui loads some images
      { test: /\.(jpg|png|gif)$/, loader: "file-loader" },
      // required to load font-awesome
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream",
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      },
    ],
  },
};
