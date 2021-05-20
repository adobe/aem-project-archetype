import React from "react";
import ReactDOMServer from 'react-dom/server';
import App from "../App";
import { StaticRouter } from "react-router-dom";
import { Constants, EditorContext } from '@adobe/aem-react-editable-components';
import { ModelManager } from '@adobe/aem-spa-page-model-manager';
import '../components/import-components';

function renderModelToHTMLString(model, pagePath, requestUrl, requestPath, pageModelRootPath, isInEditor) {
    const html = ReactDOMServer.renderToString(
        <StaticRouter location={ requestUrl } context={{}}>
            <EditorContext.Provider value={isInEditor}>
                <App cqChildren={model[Constants.CHILDREN_PROP]} cqItems={model[Constants.ITEMS_PROP]} cqItemsOrder={model[Constants.ITEMS_ORDER_PROP]} cqPath={pageModelRootPath} locationPathname={requestPath}/>
            </EditorContext.Provider>
        </StaticRouter>
    );

    // We are using ' for the string to we need to make sure we are encoding all other '
    let state = {
        rootModel : model,
        rootModelUrl: ModelManager.rootPath,
        pagePath
    };
    let stateStr = JSON.stringify(state);

    return `${html}
     <script type="application/json" id="__INITIAL_STATE__">
         ${stateStr}
     </script>`;
}
async function processSPA(args) {
    const APP_ROOT_PATH = '/content/${appId}/${country}/${language}';
    const wcmMode = args.wcmmode;
    const isInEditor = wcmMode && wcmMode === 'EDIT' || wcmMode === 'PREVIEW';
    const pageModelRootPath = args.pageRoot || APP_ROOT_PATH;
    let modelData = args.data;
    let pagePath = args.pagePath.replace('.html', '');

    await ModelManager.initialize({path: pageModelRootPath, model: modelData});
    const response = await renderModelToHTMLString(modelData, pagePath, args.pagePath, args.pagePath, pageModelRootPath, isInEditor);
    return response;
}

export default processSPA;
