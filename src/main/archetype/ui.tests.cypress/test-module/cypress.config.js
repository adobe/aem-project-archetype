/*
 *  Copyright 2023 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const { defineConfig } = require("cypress");
const reportsPath = process.env.REPORTS_PATH || 'cypress/results'
const authorURL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502'
const authorName = process.env.AEM_AUTHOR_USERNAME || 'admin'
const authorPass = process.env.AEM_AUTHOR_PASSWORD || 'admin'
const publishURL = process.env.AEM_PUBLISH_URL || 'http://localhost:4503'
const publishName = process.env.AEM_PUBLISH_USERNAME || 'admin'
const publishPass = process.env.AEM_PUBLISH_PASSWORD || 'admin'

let config = {
  env: {
    AEM_AUTHOR_URL: authorURL,
    AEM_AUTHOR_USERNAME: authorName,
    AEM_AUTHOR_PASSWORD: authorPass,
    AEM_PUBLISH_URL: publishURL,
    AEM_PUBLISH_USERNAME: publishName,
    AEM_PUBLISH_PASSWORD: publishPass,
    REPORTS_PATH: reportsPath,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-terminal-report/src/installLogsPrinter')(on, {
        printLogsToConsole: "always",
      });
    },
    baseUrl: authorURL,
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter.config.js',
    },
  },
  videosFolder: reportsPath + "/videos",
  screenshotsFolder: reportsPath + "/screenshots",
}

module.exports = defineConfig(config);
