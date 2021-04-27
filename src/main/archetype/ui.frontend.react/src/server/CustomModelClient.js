/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
import fetch from "node-fetch";
import { ModelClient } from '@adobe/aem-spa-page-model-manager';

/**
 * Custom ModelClient meant to demonstrate how to customize the request sent to the remote server
 */
export class CustomModelClient extends ModelClient {

    constructor(auth, apiHost) {
        super(apiHost);
        this.FETCH_CONFIG = {}
        if(auth) {
            this.FETCH_CONFIG = {
                headers: {
                    Authorization: auth
                }
            };
        }
    }

    /**
     * Fetches a model using the given a resource path
     *
     * @param {string} modelPath - Path to the model
     * @return {*}
     */
    fetch(modelPath) {

        if (!modelPath) {
            let err = 'Fetching model rejected for path: ' + modelPath;
            return Promise.reject(new Error(err));
        }

        // Either the API host has been provided or we make an absolute request relative to the current host
        let url = '' + this._apiHost + modelPath;

        return fetch(url, this.FETCH_CONFIG).then(function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                let error = new Error('while fetching the model for url: ' + url, response.statusText || response.status);
                error.response = response;

                return Promise.reject(error);
            }
        });
    }
}
