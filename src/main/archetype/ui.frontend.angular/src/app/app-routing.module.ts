import {
  AemPageDataResolver,
  AemPageRouteReuseStrategy
} from '@adobe/cq-angular-editable-components';
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
