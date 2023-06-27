# Cypress Sample Test Module

This module documents the recommended structure for a Cypress test module and adheres to the Cloud Manager UI test module conventions,
ensuring that tests will be executed and reports generated are stored in the proper location.

Some examples of basic tasks like logging in-out of AEM instances, taking screenshots, logging browser requests are included.


## Usage

### local testing

- Install Cypress
  ```shell
  npm install
  ```

- Set environment variables required for test execution
  ```shell
  export AEM_AUTHOR_URL=https://author-p***-e***.adobeaemcloud.com
  export AEM_AUTHOR_USERNAME=admin
  export AEM_AUTHOR_PASSWORD=***
  export AEM_PUBLISH_URL=https://publish-p***-e***.adobeaemcloud.com
  export AEM_PUBLISH_USERNAME=admin
  export AEM_PUBLISH_PASSWORD=***
  export REPORTS_PATH=target/
  ```

- Run tests with one of the following commands
  ```shell
  npm test              # Using default Cypress browser
  npm run test-chrome   # Using Google Chrome browser
  npm run test-firefox  # Using Firefox browser
  ```

- For debugging tests, you may run Cypress with the browser visible and Cypress console
  ```shell
  npx cypress run --headed --no-exit --browser chrome
  ```

### Reports

In order to be able to interpret the results of the tests correctly, a summary in JUnit format needs to be
provided. To achieve this, both the `spec` and `mocha-junit-reporter` reporter are configured:

```javascript
reporter: 'cypress-multi-reporters',
reporterOptions: {
  configFile: 'reporter.config.js',
},
```

```javascript
const reportsPath = process.env.REPORTS_PATH || 'cypress/results'

module.exports = {
  "reporterEnabled": "spec, mocha-junit-reporter",
  "mochaJunitReporterReporterOptions": {
    "mochaFile": `${reportsPath}/output.xml`
  },
}
```

In order for the report to be found `reportPath` must be the value passed in the environment
variable `REPORTS_PATH` as expected by EaaS. See [cypress.config.js](cypress.config.js)

### Screenshots / Videos

Cypress will automatically record videos for all test executions and create screenshots for test failures.

Additional screenshots can be captured during the test execution using following command:

```javascript
cy.screenshot()
```

`$REPORTS_PATH/videos` will contain the videos.

`$REPORTS_PATH/screenshots` will contain the images.
