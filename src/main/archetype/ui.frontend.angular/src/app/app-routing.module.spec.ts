import { UrlSegment } from '@angular/router';
import { AemPageMatcher, AppRoutingModule } from './app-routing.module';

describe('AemPageMatcher', () => {
  it('should return undefined if no match is found', () => {
    const match = AemPageMatcher([] as UrlSegment[]);

    expect(match).toBeUndefined();
  });

  it('should return matcher if path starts with app path root', () => {
    const a = new UrlSegment('content', {});
    const b = new UrlSegment('we-retail-journal', {});
    const c = new UrlSegment('angular', {});
    const d = new UrlSegment('foo.html', {});
    const url = [a, b, c, d];

    expect(AemPageMatcher(url)).toEqual({
      consumed: url,
      posParams: {
        path: d
      }
    });
  });
});

describe('AppRoutingModule', () => {
  let appRoutingModule: AppRoutingModule;

  beforeEach(() => {
    appRoutingModule = new AppRoutingModule();
  });

  it('should create an instance', () => {
    expect(appRoutingModule).toBeTruthy();
  });
});
