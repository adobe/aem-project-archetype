/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2019 Adobe Incorporated
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

import extractModelId from "./extract-model-id";

describe("Utils ->", () => {
  const CONTENT_PATH = "/content/test/cq/jcr:content/path";
  const CONTENT_PATH_CONVERTED = "_content_test_cq_jcr_content_path";

  describe("extractModelId ->", () => {
    it("should convert not fail", () => {
      expect(extractModelId()).toBeUndefined();
    });

    it("should convert the given path into an id", () => {
      expect(extractModelId(CONTENT_PATH)).toBe(CONTENT_PATH_CONVERTED);
    });
  });
});
