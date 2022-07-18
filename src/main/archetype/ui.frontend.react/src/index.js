import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie9';
import 'custom-event-polyfill';

import { Constants, ModelManager } from '@adobe/aem-spa-page-model-manager';
import { createBrowserHistory } from 'history';
import React from 'react';
#if ( $enableSSR == "y")
import { render, hydrate } from 'react-dom';
#end
#if ( $enableSSR == "n")
import { render } from 'react-dom';
#end
import { Router } from 'react-router-dom';
import App from './App';
import LocalDevModelClient from './LocalDevModelClient';
import './components/import-components';
import './index.css';

const modelManagerOptions = {};
if(process.env.REACT_APP_PROXY_ENABLED) {
    modelManagerOptions.modelClient = new LocalDevModelClient(process.env.REACT_APP_API_HOST);
}

const renderApp = () => {
    ModelManager.initialize(modelManagerOptions).then(pageModel => {
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

#if ( $enableSSR == "y")
const hydrateApp = (initialState) => {

    modelManagerOptions.model = initialState.rootModel;
    ModelManager.initialize(modelManagerOptions).then(pageModel => {
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

#if ( $enableSSR == "y")
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
#if ( $enableSSR == "n")
    renderApp();
#end
});
