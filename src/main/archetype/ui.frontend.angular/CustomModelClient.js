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
import { ModelClient } from '@adobe/aem-spa-page-model-manager';


export class CustomModelClient extends ModelClient {


    constructor(api, ModelManager) {
        super(api);
        this.ModelManager = ModelManager;

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

        if(modelPath.indexOf('/api/v1/web/guest/') > -1){
            let index = modelPath.indexOf('ssr/') + 4;
            let fixPath = '/' + modelPath.substr(index, modelPath.length - index);
            return this.ModelManager.getData(fixPath);
        }

        let err = 'Model ' + modelPath + ' not provided in initial model payload to the render function.';
        return Promise.reject(new Error(err));
    }
}
