const path = require("path");

module.exports = {
  mode: "development", // または 'production'
  entry: "./src/index.js", // エントリーポイント
  experiments: {
    asyncWebAssembly: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"), // 出力先のディレクトリ
    filename: "bundle.js", // 出力ファイル名
  },
};
