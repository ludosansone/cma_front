module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'src/assets'),
      publicPath: '/assets'
    }
  }
};
