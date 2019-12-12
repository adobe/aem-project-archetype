#set($hash = '#')${hash} Frontend Build: Angular App

This project was bootstrapped with the [Angular CLI](https://github.com/angular/angular-cli).

This application is built to consume the AEM model of a site. It will automatically generate the layout using the helper components from the [`@adobe/cq-angular-editable-components`](https://www.npmjs.com/package/@adobe/cq-angular-editable-components) package.

${hash}${hash} Scripts

In the project directory, you can run the following commands:

${hash}${hash}${hash} `npm start`

Runs the app in development mode by proxying the JSON model from a local AEM instance running at http://localhost:4502. This assumes that the entire project has been deployed to AEM at least once (`mvn clean install -PautoInstallPackage` **in the project root**).

After running `npm start` **in the `ui.frontend` directory**, your app will be automatically opened in your browser (at path http://localhost:4200/content/${contentFolderName}/${language_country.split('_').get(1)}/${language_country.split('_').get(0)}/home.html). If you make edits, the page will reload.

If you are getting errors related to CORS, you might want to configure AEM as follows:

1. Navigate to the Configuration Manager (http://localhost:4502/system/console/configMgr)
2. Open the configuration for "Adobe Granite Cross-Origin Resource Sharing Policy"
3. Create a new configuration with the following additional values:
   - Allowed Origins: http://localhost:4200
   - Supported Headers: Authorization
   - Allowed Methods: OPTIONS

${hash}${hash}${hash} `npm test`

Launches the Karma test runner. See the section about [running tests](https://angular.io/guide/testing) for more information.

${hash}${hash}${hash} `npm run test:debug`

Launches the Karma test runner in interactive watch mode.

${hash}${hash}${hash} `npm run build`

Builds the app for production to the `build` folder. It bundles Angular in production mode and optimizes the build for the best performance. See the section about [deployment](https://angular.io/guide/deployment) for more information.

Furthermore, an AEM ClientLib is generated from the app using the [`aem-clientlib-generator`](https://github.com/wcm-io-frontend/aem-clientlib-generator) package.

${hash}${hash} Browser Support

By default, this project uses [Browserslist](https://github.com/browserslist/browserslist)'s `defaults` option to identify target browsers. Additionally, it includes polyfills for modern language features to support older browsers (e.g. Internet Explorer 11). If supporting such browsers isn't a requirement, the polyfill dependencies and imports can be removed.
