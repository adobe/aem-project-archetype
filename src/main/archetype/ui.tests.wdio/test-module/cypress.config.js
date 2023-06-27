const { defineConfig } = require("cypress");

const reportsPath = process.env.REPORTS_PATH || 'cypress/results'
const authorURL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502'
const authorName = process.env.AEM_AUTHOR_USERNAME || 'admin'
const authorPass = process.env.AEM_AUTHOR_PASSWORD || 'admin'
const publishURL = process.env.AEM_AUTHOR_URL || 'http://localhost:4503'
const publishName = process.env.AEM_AUTHOR_USERNAME || 'admin'
const publishPass = process.env.AEM_AUTHOR_PASSWORD || 'admin'

let config = {
  env: {
    AEM_AUTHOR_USERNAME: authorName,
    AEM_AUTHOR_PASSWORD: authorPass
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: authorURL,
    reporter: "junit",
    reporterOptions: {
      mochaFile: reportsPath + "/output.xml",
    },
  },
  videosFolder: reportsPath + "/videos",
  screenshotsFolder: reportsPath + "/screenshots",
}

module.exports = defineConfig(config);
