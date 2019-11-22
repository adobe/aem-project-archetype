/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Run using Puppeteer to avoid CI issues: https://github.com/karma-runner/karma-chrome-launcher/issues/154
process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = config => {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular", "sinon"],
    plugins: [
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-chrome-launcher"),
      require("karma-coverage-istanbul-reporter"),
      require("karma-jasmine-html-reporter"),
      require("karma-jasmine"),
      require("karma-sinon")
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "../target/coverage/"),
      reports: ["text", "lcov"],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: "dev"
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeHeadless"],
    singleRun: false
  });
};
