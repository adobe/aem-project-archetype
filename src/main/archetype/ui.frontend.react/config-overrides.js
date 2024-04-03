const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Enable the use of .babelrc
    config.module.rules.push({
      test: /\.m?js$/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: true,
          plugins: [
          "@babel/plugin-proposal-optional-chaining",
          "@babel/plugin-proposal-nullish-coalescing-operator"],
        },
      },
    });

    return config;
  }
);