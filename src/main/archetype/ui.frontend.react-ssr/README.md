${hash} Frontend Serverless Build (Adobe IO Runtime)

${hash}${hash} Features

* AdobeIO Runtime (Serverless) rendering of the SPA editor (Currently react only)
* Local + Remote development
* Uses AIO CLI

${hash}${hash} Installation

1. Install [NodeJS](https://nodejs.org/en/download/) (v10+), globally. This will also install `npm`.
2. Navigate to `ui.frontend.ssr.ioruntime` in your project and run `npm install`. (You must have run the archetype with `-DfrontendModule=react` and `-DenableAdobeIoRuntime=y`  to populate the ui.frontend.ssr.ioruntime folder)
3. If running locally the following images must be installed:
    * docker pull openwhisk/action-nodejs-v10:latest
    * docker pull adobeapiplatform/adobe-action-nodejs-v10:3.0.21 

${hash}${hash} Usage

The following npm scripts are available for deployment under `ui.frontend.ssr.ioruntime`:

* `npm run run-local` - Deploys the serverless code to a local docker container with AIO CLI. Requires docker running. Enables you to debug with visual studio code.
* `npm run deploy:runtime` - Deploys the serverless code to your IO runtime namespace. Requires the environment variables AIO_RUNTIME_NAMESPACE and AIO_RUNTIME_AUTH to be set. 

${hash}${hash}${hash}${hash} Notes

To summarize, the way this works:

${hash}${hash}${hash}${hash}${hash} 1: the servlet (in the body.html) will call the serverless endpoint on a page request, sending over the page data using sling model exporters as JSON
${hash}${hash}${hash}${hash}${hash} 2: the serverless code consumes the JSON and returns pre-rendered HTML over
${hash}${hash}${hash}${hash}${hash} 3: the servlet puts this inside the HTML
${hash}${hash}${hash}${hash}${hash} 4: the react app detects the pre-rendered HTML and hydrates the app instead of rendering it:

${hash}${hash}${hash}${hash}${hash} The Runtime action depends on the code produced by ui.frontend.react. This dependency is automatically copied over as part of the maven build via a post-build webhook. When developing/testing, you will need to trigger this process before deploying the action for the changes to take effect.

${hash}${hash}${hash}${hash} Details:

The server-side rendering gets kicked off by the following SLY statement in your body.html of the page:
```html
<!-- this starts the SSR rendering chain !-->
<div id="spa-root" data-sly-resource="${symbol_dollar}{resource @ resourceType='cq/remote/content/renderer/request/handler'}"></div>

```

This will trigger the out of the box remote renderer.
The renderer is configured by the following configuration:

com.adobe.cq.remote.content.renderer.impl.factory.ConfigurationFactoryImpl~${appId}.cfg

```json
{
    "getContentPathPattern": "/content/${appId}/(.*)|/conf/${appId}/(.*)/settings/wcm/templates/(.*)",
    "getRemoteHTMLRendererUrl" : "http://localhost:3233/api/v1/web/guest/react-server-1.1.2/ssr",
    "getRequestTimeout": 10000,
    "getAdditionalRequestHeaders": [
    
    ]
}
```

In here you put the correct endpoint. By default for demonstration purposes the endpoint is configured to your localhost.
So to get a demo quickly just run the `npm run run-local` script after a full installation. 
Refresh the page and you should see the pre-rendered HTML in the page source.


For production purposes the URL should point to an actual IO runtime instance.
Under "getAdditionalRequestHeaders" of this configuration you can put an authentication header that is needed for IO Runtime, or any other static headers that are desired.

Production:

```json
{
    "getContentPathPattern": "/content/${appId}/(.*)|/conf/${appId}/(.*)/settings/wcm/templates/(.*)",
    "getRemoteHTMLRendererUrl" : "https://adobeioruntime.net/api/v1/web/<your-namespace-here>/react-server-1.1.2/ssr",
    "getRequestTimeout": 10000,
    "getAdditionalRequestHeaders": [
        "Auth: Basic <your key here>"
    ]
}
```

Finally, the initialization script of the app is different:

```js
const initialStateScriptTag = document.getElementById('__INITIAL_STATE__');
if(!!initialStateScriptTag){

    try{
        const initialState = JSON.parse(initialStateScriptTag.innerHTML);
        initialStateScriptTag.remove();
        hydrateApp(initialState);
        
        console.info('hydrated react DOM');
    }catch(err) {
        console.error('failed to parse initial state json! re-rendering output.', err);
        renderApp();
    }
}
```
This will just attach the event handlers to the already existing DOM instead of re-rendering it, for even more performance.

And that is it! You got your server-side rendering stack running on serverless!
For more customization / bells and whistles there are other examples that require you to eject your react-app or to write the servlet yourself:

[React core components - Examples - Typescript, code-splitting, lazy-loading, experience fragments example](https://github.com/adobe/aem-react-core-wcm-components/tree/master/examples/react-spacomponents-example-project)

But this is a great base to get started with minimal code and complexity.
