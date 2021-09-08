/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
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

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
} else {
  // In development mode, redirect from "/" to app root
  if (location.pathname === '/' && environment.appRoot) {
    location.href = environment.appRoot;
  }
}

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


platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
