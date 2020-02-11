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

const path = require('path');
const getEntrypoints = require('./utils/entrypoints');

const BUILD_DIR = path.join(__dirname, 'build');
const CLIENTLIB_DIR = path.join(
  __dirname,
  '..',
  'ui.apps',
  'src',
  'main',
  'content',
  'jcr_root',
  'apps',
  '${appId}',
  'clientlibs'
);
const ASSET_MANIFEST_PATH = path.join(BUILD_DIR, 'asset-manifest.json');

const entrypoints = getEntrypoints(ASSET_MANIFEST_PATH);

// Config for `aem-clientlib-generator`
module.exports = {
  context: BUILD_DIR,
  clientLibRoot: CLIENTLIB_DIR,
  libs: {
    name: 'clientlib-react',
    allowProxy: true,
    categories: ['${appId}.react'],
    serializationFormat: 'xml',
    cssProcessor: ['default:none', 'min:none'],
    jsProcessor: ['default:none', 'min:none'],
    assets: {
      // Copy entrypoint scripts and stylesheets into the respective ClientLib
      // directories (in the order they are in the entrypoints arrays). They
      // will be bundled by AEM and requested from the HTML. The remaining
      // chunks (placed in `resources`) will be loaded dynamically
      js: entrypoints.filter(fileName => fileName.endsWith('.js')),
      css: entrypoints.filter(fileName => fileName.endsWith('.css')),

      // Copy all other files into the `resources` ClientLib directory
      resources: {
        cwd: '.',
        files: ['**/*.*'],
        flatten: false,
        ignore: entrypoints
      }
    }
  }
};
