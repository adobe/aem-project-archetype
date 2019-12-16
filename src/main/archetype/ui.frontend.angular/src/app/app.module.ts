import { SpaAngularEditableComponentsModule } from '@adobe/cq-angular-editable-components';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import './components/import-components';
import { ModelManagerService } from './components/model-manager.service';
import { PageComponent } from './components/page/page.component';
import { TextComponent } from './components/text/text.component';

@NgModule({
  imports: [
    BrowserModule,
    SpaAngularEditableComponentsModule,
    AppRoutingModule
  ],
  providers: [ModelManagerService, { provide: APP_BASE_HREF, useValue: '/' }],
  declarations: [AppComponent, TextComponent, PageComponent],
  entryComponents: [TextComponent, PageComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
