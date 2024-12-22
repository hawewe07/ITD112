// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.ignoreWarnings = [/Failed to parse source map/];
        return webpackConfig;
      },
    },
  };
  