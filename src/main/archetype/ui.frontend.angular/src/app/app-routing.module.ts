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

import {
  AemPageDataResolver,
  AemPageRouteReuseStrategy
} from '@adobe/aem-angular-editable-components';
import { NgModule } from '@angular/core';
import {
  RouteReuseStrategy,
  RouterModule,
  Routes,
  UrlMatchResult,
  UrlSegment
} from '@angular/router';
import { PageComponent } from './components/page/page.component';

export function AemPageMatcher(url: UrlSegment[]): UrlMatchResult {
  if (url.length) {
    return {
      consumed: url,
      posParams: {
        path: url[url.length - 1]
      }
    };
  }
}

const routes: Routes = [
  {
    matcher: AemPageMatcher,
    component: PageComponent,
    resolve: {
      path: AemPageDataResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AemPageDataResolver,
    {
      provide: RouteReuseStrategy,
      useClass: AemPageRouteReuseStrategy
    }
  ]
})
export class AppRoutingModule {}
