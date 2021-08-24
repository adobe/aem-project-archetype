import {ModelClient} from '@adobe/aem-spa-page-model-manager';

/**
 * Used to make react-server possible (localhost development).
 */
export default class LocalDevModelClient extends ModelClient{

    fetch(modelPath) {

        if (!modelPath) {
            const err = `Fetching model rejected for path: ${modelPath}`;

            return Promise.reject(new Error(err));
        }

        // Either the API host has been provided or we make an absolute request relative to the current host
        const apihostPrefix = this._apiHost || '';
        const url = `${apihostPrefix}${modelPath}`;

        return fetch(url, {
            credentials: 'same-origin',
            headers: {
                'Authorization': process.env.REACT_APP_AEM_AUTHORIZATION_HEADER
            }
        }).then((response) => {
            if ((response.status >= 200) && (response.status < 300)) {
                return response.json() ;
            }

            return Promise.reject(response);
        }).catch((error) => {
            return Promise.reject(error);
        });

    }

}