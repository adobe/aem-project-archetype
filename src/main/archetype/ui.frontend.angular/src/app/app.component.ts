import { Constants } from '@adobe/cq-angular-editable-components';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';
import { Component } from '@angular/core';

@Component({
  selector: '#spa-root',
  host: {
    class: 'app'
  },
  templateUrl: './app.component.html'
})
export class AppComponent {
  items: any;
  itemsOrder: any;
  path: any;

  constructor() {
    ModelManager.initialize().then(this.updateData);
  }

  private updateData = pageModel => {
    this.path = pageModel[Constants.PATH_PROP];
    this.items = pageModel[Constants.ITEMS_PROP];
    this.itemsOrder = pageModel[Constants.ITEMS_ORDER_PROP];
  };
}
