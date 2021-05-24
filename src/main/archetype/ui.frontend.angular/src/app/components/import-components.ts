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
import {LazyMapTo} from '@adobe/aem-angular-editable-components';

import './container/container.component';
import './responsive-grid/responsive-grid.component';


import {
    TitleV2IsEmptyFn,
    BreadCrumbV2IsEmptyFn,
    NavigationV1IsEmptyFn,
    ImageV2IsEmptyFn,
    TeaserV1IsEmptyFn,
    DownloadV1IsEmptyFn,
    ListV2IsEmptyFn,
} from '@adobe/aem-core-components-angular-base/core';

/**
 * Loading the following components with LazyMapTo - so they are loaded only when we need them!
 */

const NavigationV1Component = () => import('@adobe/aem-core-components-angular-base/layout/navigation/v1').then(
    Module => Module.NavigationV1Component
);
LazyMapTo('${appId}/components/navigation')(NavigationV1Component, {isEmpty: NavigationV1IsEmptyFn});


const TeaserV1Component = () => import('@adobe/aem-core-components-angular-base/authoring/teaser/v1').then(
    Module => Module.TeaserV1Component
);
LazyMapTo('${appId}/components/teaser')(TeaserV1Component, {isEmpty: TeaserV1IsEmptyFn});


const TitleV2Component = () => import('@adobe/aem-core-components-angular-base/authoring/title/v2').then(
    Module => Module.TitleV2Component
);
LazyMapTo('${appId}/components/title')(TitleV2Component, {isEmpty: TitleV2IsEmptyFn});


const SeparatorV1Component = () => import('@adobe/aem-core-components-angular-base/authoring/separator/v1').then(
    Module => Module.SeparatorV1Component
);
LazyMapTo('${appId}/components/separator')(SeparatorV1Component);


const DownloadV1Component = () => import('@adobe/aem-core-components-angular-base/authoring/download/v1').then(
    Module => Module.DownloadV1Component
);
LazyMapTo('${appId}/components/download')(DownloadV1Component, {isEmpty: DownloadV1IsEmptyFn});


const LanguageNavigationV1Component = () => import('@adobe/aem-core-components-angular-base/layout/language-navigation/v1').then(
    Module => Module.LanguageNavigationV1Component
);
LazyMapTo('${appId}/components/languagenavigation')(LanguageNavigationV1Component);


const ListV2Component = () => import('@adobe/aem-core-components-angular-base/authoring/list/v2').then(
    Module => Module.ListV2Component
);
LazyMapTo('${appId}/components/list')(ListV2Component, {isEmpty: ListV2IsEmptyFn});


const BreadCrumbV2Component = () => import('@adobe/aem-core-components-angular-base/layout/breadcrumb/v2').then(
    Module => Module.BreadCrumbV2Component
);
LazyMapTo('${appId}/components/breadcrumb')(BreadCrumbV2Component, {isEmpty: BreadCrumbV2IsEmptyFn});


const ButtonV1Component = () => import('@adobe/aem-core-components-angular-base/authoring/button/v1').then(
    Module => Module.ButtonV1Component
);
LazyMapTo('${appId}/components/button')(ButtonV1Component);


const ImageV2Component = () => import('@adobe/aem-core-components-angular-base/authoring/image/v2').then(
    Module => Module.ImageV2Component
);
LazyMapTo('${appId}/components/image')(ImageV2Component, {isEmpty: ImageV2IsEmptyFn});


const CarouselV1Component = () => import('@adobe/aem-core-components-angular-spa/containers/carousel/v1').then(
    Module => Module.CarouselV1Component
);
LazyMapTo('${appId}/components/carousel')(CarouselV1Component);


const AccordionV1Component = () => import('@adobe/aem-core-components-angular-spa/containers/accordion/v1').then(
    Module => Module.AccordionV1Component
);
LazyMapTo('${appId}/components/accordion')(AccordionV1Component);


const TabsV1Component = () => import('@adobe/aem-core-components-angular-spa/containers/tabs/v1').then(
    Module => Module.TabsV1Component
);
LazyMapTo('${appId}/components/tabs')(TabsV1Component);