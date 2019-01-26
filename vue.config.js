module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production'
      ? `${process.cwd()}/dist/`
      : publicPath, // '/' by default
  configureWebpack: config => {
    // if (process.env.NODE_ENV === 'production') {
    //   config.output.publicPath = ;
    // }
    config.target = 'electron-renderer';
  }
};
