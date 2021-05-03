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

import { Constants } from '@adobe/aem-angular-editable-components';
import { ModelManager } from '@adobe/aem-spa-page-model-manager';

#if ( $enableAdobeIoRuntime == "y")
import { Component } from '@angular/core';
#end
#if ( $enableAdobeIoRuntime == "y")
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
#end
@Component({
  selector: '#spa-root', // tslint:disable-line
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  items: any;
  itemsOrder: any;
  path: any;
#if ( $enableAdobeIoRuntime == "n")
  constructor() {
    ModelManager.initialize().then(this.updateData);
  }
#end
#if ( $enableAdobeIoRuntime == "y")
  constructor(@Inject(PLATFORM_ID) private _platformId: Object) {

    if(isPlatformBrowser(_platformId)){

      //@ts-ignore
      if(window.initialModel){
        //@ts-ignore
        ModelManager.initialize({model:window.initialModel});
      }else{
        ModelManager.initialize();
      }

      ModelManager.initialize();

    }
  }
#end
  private updateData = pageModel => {
    this.path = pageModel[Constants.PATH_PROP];
    this.items = pageModel[Constants.ITEMS_PROP];
    this.itemsOrder = pageModel[Constants.ITEMS_ORDER_PROP];
  }
}
