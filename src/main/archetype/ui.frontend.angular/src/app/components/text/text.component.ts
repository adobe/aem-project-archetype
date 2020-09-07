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

import { MapTo } from '@adobe/aem-angular-editable-components';
import { Component, Input, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Default Edit configuration for the Text component that interact with the Core Text component and sub-types
 */
const TextEditConfig = {
  emptyLabel: 'Text',
  isEmpty: cqModel =>
    !cqModel || !cqModel.text || cqModel.text.trim().length < 1
};

@Component({
  selector: 'app-text',
  styleUrls: ['./text.component.css'],
  templateUrl: './text.component.html'
})
export class TextComponent {
  @Input() richText: boolean;
  @Input() text: string;
  @Input() itemName: string;

  @HostBinding('innerHtml') get content() {
    return this.richText
      ? this.sanitizer.bypassSecurityTrustHtml(this.text)
      : this.text;
  }
  @HostBinding('attr.data-rte-editelement') editAttribute = true;

  constructor(private sanitizer: DomSanitizer) {}
}

MapTo('${appId}/components/text')(
  TextComponent,
  TextEditConfig
);
