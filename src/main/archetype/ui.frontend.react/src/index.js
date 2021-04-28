import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie9';
import 'custom-event-polyfill';

import { Constants, ModelManager } from '@adobe/aem-spa-page-model-manager';
import { createBrowserHistory } from 'history';
import React from 'react';
#if ( $enableAdobeIoRuntime == "y")
import { render, hydrate } from 'react-dom';
#end
#if ( $enableAdobeIoRuntime == "n")
import { render } from 'react-dom';
#end
import { Router } from 'react-router-dom';
import App from './App';
import './components/import-components';
import './index.css';

const renderApp = () => {
    ModelManager.initialize().then(pageModel => {
        const history = createBrowserHistory();
        render(
            <Router history={history}>
                <App
                    history={history}
                    cqChildren={pageModel[Constants.CHILDREN_PROP]}
                    cqItems={pageModel[Constants.ITEMS_PROP]}
                    cqItemsOrder={pageModel[Constants.ITEMS_ORDER_PROP]}
                    cqPath={pageModel[Constants.PATH_PROP]}
                    locationPathname={window.location.pathname}
                />
            </Router>,
            document.getElementById('spa-root')
        );
    });
};

#if ( $enableAdobeIoRuntime == "y")
const hydrateApp = (initialState) => {
    ModelManager.initialize({
        model: initialState.rootModel
    }).then(pageModel => {
        const history = createBrowserHistory();
        hydrate(
            <Router history={history}>
                <App
                    history={history}
                    cqChildren={pageModel[Constants.CHILDREN_PROP]}
                    cqItems={pageModel[Constants.ITEMS_PROP]}
                    cqItemsOrder={pageModel[Constants.ITEMS_ORDER_PROP]}
                    cqPath={pageModel[Constants.PATH_PROP]}
                    locationPathname={window.location.pathname}
                />
            </Router>,
            document.getElementById('spa-root')
        );
    });
}
#end

document.addEventListener('DOMContentLoaded', () => {

#if ( $enableAdobeIoRuntime == "y")
    const initialStateScriptTag = document.getElementById('__INITIAL_STATE__');
    if(!!initialStateScriptTag){
        try{
            const initialState = JSON.parse(initialStateScriptTag.innerHTML);
            initialStateScriptTag.remove();
            hydrateApp(initialState);

            console.info('hydrated react DOM');
        }catch(err){
            console.error('failed to parse initial state json! re-rendering output.', err);
            renderApp();
        }
    }else{
        renderApp();
    }
#end
#if ( $enableAdobeIoRuntime == "n")
    renderApp();
#end
});
