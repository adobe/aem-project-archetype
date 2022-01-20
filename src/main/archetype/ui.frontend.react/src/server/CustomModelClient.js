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


/**
 * Custom ModelClient for the server that will throw an error on the fetch.
 * Alternative is to use node-fetch to retrieve the model JSON but in this case we will always send over the payload.
 */
export class CustomModelClient extends ModelClient {

    constructor() {
        super();
    }

    fetch(modelPath) {
        let err = 'Model ' + modelPath + ' not provided in initial model payload to the render function.';
        return Promise.reject(new Error(err));
    }
}

