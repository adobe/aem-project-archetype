/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2019 Adobe Systems Incorporated
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

const path = require("path");

const BUILD_DIR = path.join(__dirname, "dist", "browser");
const CLIENTLIB_DIR = path.join(
  __dirname,
  "..",
  "ui.apps",
  "src",
  "main",
  "content",
  "jcr_root",
  "apps",
  "${appsFolderName}",
  "clientlibs"
);

// Globs for entrypoint files (in the order they need to be required)
const jsEntrypoints = [
  "**/runtime*.js",
  "**/polyfills*.js",
  "**/styles*.js",
  "**/vendor*.js",
  "**/main*.js"
];
const cssEntrypoints = ["**/*.css"];

// Config for `aem-clientlib-generator`
module.exports = {
  context: BUILD_DIR,
  clientLibRoot: CLIENTLIB_DIR,
  libs: {
    name: "clientlib-base",
    allowProxy: true,
    categories: ["${cssId}.base"],
    serializationFormat: "xml",
    cssProcessor: ["default:none", "min:none"],
    jsProcessor: ["default:none", "min:none"],
    assets: {
      // Copy entrypoint scripts and stylesheets into the respective ClientLib directories (in the order they are in the
      // entrypoints arrays)
      js: jsEntrypoints,
      css: cssEntrypoints,

      // Copy all other files into the `resources` ClientLib directory
      resources: {
        cwd: ".",
        files: ["**/*.*"],
        flatten: false,
        ignore: [...jsEntrypoints, ...cssEntrypoints]
      }
    }
  }
};
