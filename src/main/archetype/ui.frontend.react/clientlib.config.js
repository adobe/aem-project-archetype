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
  '${appsFolderName}',
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
    categories: ['${cssId}.react'],
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
