process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = config => {
  config.set({
    plugins: [
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-jasmine'),
      require('karma-sinon')
    ],
    frameworks: ['jasmine', '@angular-devkit/build-angular', 'sinon'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../target/coverage/'),
      reports: ['text', 'lcov'],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml']
  });
};
