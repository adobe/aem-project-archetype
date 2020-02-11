import { inject, TestBed } from '@angular/core/testing';
import { ModelManagerService } from './model-manager.service';

describe('LayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelManagerService]
    });
  });

  it('should be created', inject(
    [ModelManagerService],
    (service: ModelManagerService) => {
      expect(service).toBeTruthy();
    }
  ));
});
