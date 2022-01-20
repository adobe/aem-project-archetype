#set($hash = '#')${hash} Frontend Build: Angular App

This project was bootstrapped with the [Angular CLI](https://github.com/angular/angular-cli).

This application is built to consume the AEM model of a site. It will automatically generate the layout using the helper components from the [`@adobe/cq-angular-editable-components`](https://www.npmjs.com/package/@adobe/cq-angular-editable-components) package.

${hash}${hash} Scripts

In the project directory, you can run the following commands:

${hash}${hash}${hash} `npm start`

Runs the app in development mode by proxying the JSON model from a local AEM instance running at http://localhost:4502. This assumes that the entire project has been deployed to AEM at least once (`mvn clean install -PautoInstallPackage` **in the project root**).

After running `npm start` **in the `ui.frontend` directory**, your app will be automatically opened in your browser (at path http://localhost:4200/content/${appId}/${country}/${language}/home.html). If you make edits, the page will reload.

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



#if ( $enableSSR == "y" )

${hash} Frontend SSR Build (Express)

${hash}${hash} Features

* Server Side rendering of the SPA editor 
* Local + Remote development

${hash}${hash} Usage

The following npm scripts are available:

* `npm run build-server` - Build express code (debuggable with sourcemaps)
* `npm run start-ssr-express` - Runs the express code (debuggable with sourcemaps)

${hash}${hash}${hash}${hash} Notes

To summarize, the way this works:

${hash}${hash}${hash}${hash}${hash} 1: the servlet (in the body.html) will call the serverless endpoint on a page request, sending over the page data using sling model exporters as JSON
${hash}${hash}${hash}${hash}${hash} 2: the express code consumes the JSON and returns pre-rendered HTML over
${hash}${hash}${hash}${hash}${hash} 3: the servlet puts this inside the HTML
${hash}${hash}${hash}${hash}${hash} 4: the angular app detects the pre-rendered HTML and hydrates the app instead of rendering it:

${hash}${hash}${hash}${hash} Details:

The server-side rendering gets kicked off by the following SLY statement in your body.html of the page:
```html
<!-- this starts the SSR rendering chain !-->
<div id="spa-root" data-sly-resource="${symbol_dollar}{resource @ resourceType='cq/remote/content/renderer/request/handler'}"></div>

```

This will trigger the out of the box remote renderer.
The renderer is configured by the following configuration:

com.adobe.cq.remote.content.renderer.impl.factory.ConfigurationFactoryImpl~mysite.cfg

```json
{
    "getContentPathPattern": "/content/mysite/(.*)|/conf/mysite/(.*)/settings/wcm/templates/(.*)",
    "getRemoteHTMLRendererUrl" : "http://localhost:3233/",
    "getRequestTimeout": 10000,
    "getAdditionalRequestHeaders": [
    
    ]
}
```

In here you put the correct endpoint. By default for demonstration purposes the endpoint is configured to your localhost.
For production purposes the URL should point to an actual express instance.
Under "getAdditionalRequestHeaders" of this configuration you can put an authentication header that is needed for express, or any other static headers that are desired.

Production:

```json
{
    "getContentPathPattern": "/content/mysite/(.*)|/conf/mysite/(.*)/settings/wcm/templates/(.*)",
    "getRemoteHTMLRendererUrl" : "https://your-express-host.com",
    "getRequestTimeout": 10000,
    "getAdditionalRequestHeaders": [
        "Auth: Basic <your key here>"
    ]
}
```

Finally, the initialization script of the app is different:

main.ts:
```js
const initialStateScriptTag = document.getElementById('__AEM_STATE__');
if(!!initialStateScriptTag) {
  try {
    const initialState = JSON.parse(initialStateScriptTag.innerHTML);
    // @ts-ignore
    window.initialModel = initialState.rootModel;
    initialStateScriptTag.remove();
  }catch(err){
    console.warn('failed to hydrate app', err);
  }
}
```

app.component.ts:
```js
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


if(isPlatformBrowser(_platformId)){ //performs check that we are on the browser and not the server.

   // @ts-ignore
   if(window.initialModel){
     // @ts-ignore
     ModelManager.initialize({model:window.initialModel});
   }else{
     ModelManager.initialize();
   }
   
 }
```

app.module.ts:
```js
BrowserModule.withServerTransition({
     appId: '${appId}'
 }),
```

This will just attach the event handlers to the already existing DOM instead of re-rendering it, for even more performance.

And that is it! You got your server-side rendering stack running on express!

#end
