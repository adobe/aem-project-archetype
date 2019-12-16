import { MapTo } from '@adobe/cq-angular-editable-components';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Default Edit configuration for the Text component that interact with the Core Text component and sub-types
 *
 * @type EditConfig
 */
const TextEditConfig = {
  emptyLabel: 'Text',
  isEmpty: function(cqModel) {
    return !cqModel || !cqModel.text || cqModel.text.trim().length < 1;
  }
};

@Component({
  selector: 'app-text',
  host: {
    '[id]': 'itemName',
    '[innerHtml]': 'content',
    'data-rte-editelement': 'true'
  },
  styleUrls: ['./text.component.css'],
  templateUrl: './text.component.html'
})
export class TextComponent {
  @Input() richText: boolean;
  @Input() text: string;
  @Input() itemName: string;

  constructor(private sanitizer: DomSanitizer) {}

  get content() {
    return this.richText
      ? this.sanitizer.bypassSecurityTrustHtml(this.text)
      : this.text;
  }
}

MapTo('${appsFolderName}/components/content/text')(
  TextComponent,
  TextEditConfig
);
