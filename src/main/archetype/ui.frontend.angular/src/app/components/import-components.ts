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
import {MapTo} from '@adobe/aem-angular-editable-components';

import './container/container.component';
import './responsive-grid/responsive-grid.component';

import {TabsV1Component} from '@adobe/aem-core-components-angular-spa/containers/tabs/v1';

import {TitleV2Component, TitleV2IsEmptyFn} from '@adobe/aem-core-components-angular-base/authoring/title/v2';
import {BreadCrumbV2Component, BreadCrumbV2IsEmptyFn} from '@adobe/aem-core-components-angular-base/layout/breadcrumb/v2';
import {NavigationV1Component, NavigationV1IsEmptyFn} from '@adobe/aem-core-components-angular-base/layout/navigation/v1';
import {ButtonV1Component, ButtonV1IsEmptyFn} from '@adobe/aem-core-components-angular-base/authoring/button/v1';
import {ImageV2Component, ImageV2IsEmptyFn} from '@adobe/aem-core-components-angular-base/authoring/image/v2';

import {TeaserV1Component, TeaserV1IsEmptyFn} from '@adobe/aem-core-components-angular-base/authoring/teaser/v1';
import {DownloadV1Component, DownloadV1IsEmptyFn} from '@adobe/aem-core-components-angular-base/authoring/download/v1';

import {ListV2Component, ListV2IsEmptyFn} from '@adobe/aem-core-components-angular-base/authoring/list/v2';
import {SeparatorV1Component} from '@adobe/aem-core-components-angular-base/authoring/separator/v1';
import {AccordionV1Component} from '@adobe/aem-core-components-angular-spa/containers/accordion/v1';
import {CarouselV1Component} from '@adobe/aem-core-components-angular-spa/containers/carousel/v1';
import {LanguageNavigationV1Component} from '@adobe/aem-core-components-angular-base/layout/language-navigation/v1';


MapTo('${appId}/components/navigation')(NavigationV1Component, {isEmpty: NavigationV1IsEmptyFn});
MapTo('${appId}/components/teaser')(TeaserV1Component, {isEmpty: TeaserV1IsEmptyFn});
MapTo('${appId}/components/title')(TitleV2Component, {isEmpty: TitleV2IsEmptyFn});
MapTo('${appId}/components/separator')(SeparatorV1Component);


MapTo('${appId}/components/download')(DownloadV1Component,{isEmpty: DownloadV1IsEmptyFn});
MapTo('${appId}/components/languagenavigation')(LanguageNavigationV1Component);
MapTo('${appId}/components/list')(ListV2Component, {isEmpty: ListV2IsEmptyFn});
MapTo('${appId}/components/breadcrumb')(BreadCrumbV2Component, {isEmpty: BreadCrumbV2IsEmptyFn})
MapTo('${appId}/components/button')(ButtonV1Component, {isEmpty: ButtonV1IsEmptyFn});
MapTo('${appId}/components/image')(ImageV2Component, {isEmpty: ImageV2IsEmptyFn});

MapTo('${appId}/components/carousel')(CarouselV1Component);
MapTo('${appId}/components/accordion')(AccordionV1Component);
MapTo('${appId}/components/tabs')(TabsV1Component);
