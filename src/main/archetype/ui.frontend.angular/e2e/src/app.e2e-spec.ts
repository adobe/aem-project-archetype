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

"use strict"; // necessary for es6 output in node

import { browser, by, element } from "protractor";

/* tslint:disable:quotemark */
describe("Dynamic Component Loader", function() {
  beforeEach(function() {
    browser.get("");
  });

  it("should load ad banner", function() {
    let headline = element(by.xpath("//h4[text()='Featured Hero Profile']"));
    let name = element(by.xpath("//h3[text()='Bombasto']"));
    let bio = element(by.xpath("//p[text()='Brave as they come']"));

    expect(name).toBeDefined();
    expect(headline).toBeDefined();
    expect(bio).toBeDefined();
  });
});
