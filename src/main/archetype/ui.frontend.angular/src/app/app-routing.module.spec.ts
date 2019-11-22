/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
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

import { UrlSegment } from "@angular/router";
import { AemPageMatcher, AppRoutingModule } from "./app-routing.module";

describe("AemPageMatcher", () => {
  it("should return undefined if no match is found", () => {
    var match = AemPageMatcher([] as UrlSegment[]);

    expect(match).toBeUndefined();
  });

  it("should return matcher if path starts with app path root", () => {
    var a = new UrlSegment("content", {});
    var b = new UrlSegment("we-retail-journal", {});
    var c = new UrlSegment("angular", {});
    var d = new UrlSegment("foo.html", {});
    var url = [a, b, c, d];

    expect(AemPageMatcher(url)).toEqual({
      consumed: url,
      posParams: {
        path: d
      }
    });
  });
});

describe("AppRoutingModule", () => {
  let appRoutingModule: AppRoutingModule;

  beforeEach(() => {
    appRoutingModule = new AppRoutingModule();
  });

  it("should create an instance", () => {
    expect(appRoutingModule).toBeTruthy();
  });
});
