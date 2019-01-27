module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? `` : '/', // by default
  configureWebpack: config => {
    // if (process.env.NODE_ENV === 'production') {
    //   config.output.publicPath = ;
    // }
    //config.target = 'electron-renderer';
  }
};
