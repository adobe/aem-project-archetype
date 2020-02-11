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
