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

import { Constants } from '@adobe/cq-angular-editable-components';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModelManagerService } from '../model-manager.service';

@Component({
  selector: 'app-main',
  styleUrls: ['./page.component.css'],
  templateUrl: './page.component.html'
})
export class PageComponent {
  items;
  itemsOrder;
  path;

  constructor(
    private route: ActivatedRoute,
    private modelManagerService: ModelManagerService
  ) {
    this.modelManagerService
      .getData({ path: this.route.snapshot.data.path })
      .then(data => {
        this.path = data[Constants.PATH_PROP];
        this.items = data[Constants.ITEMS_PROP];
        this.itemsOrder = data[Constants.ITEMS_ORDER_PROP];
      });
  }
}
