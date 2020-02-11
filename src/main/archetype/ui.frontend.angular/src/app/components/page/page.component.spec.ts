import { SpaAngularEditableComponentsModule } from '@adobe/cq-angular-editable-components';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';
import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from '../../app-routing.module';
import { ModelManagerService } from '../model-manager.service';
import { PageComponent } from './page.component';

describe('PageComponentComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SpaAngularEditableComponentsModule, AppRoutingModule],
      providers: [
        ModelManagerService,
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      declarations: [PageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Stub ModelManager
    spyOn(ModelManager, 'getData').and.callFake(() => {
      return Promise.resolve({});
    });

    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
