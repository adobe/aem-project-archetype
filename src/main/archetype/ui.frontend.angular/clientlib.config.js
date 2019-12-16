const path = require('path');
const {
  cssEntrypoints,
  entrypoints,
  jsEntrypoints
} = require('./utils/entrypoints');

const BUILD_DIR = path.join(__dirname, 'dist');
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

// Config for `aem-clientlib-generator`
module.exports = {
  context: BUILD_DIR,
  clientLibRoot: CLIENTLIB_DIR,
  libs: {
    name: 'clientlib-angular',
    allowProxy: true,
    categories: ['${cssId}.angular'],
    serializationFormat: 'xml',
    cssProcessor: ['default:none', 'min:none'],
    jsProcessor: ['default:none', 'min:none'],
    assets: {
      // Copy entrypoint scripts and stylesheets into the respective ClientLib
      // directories (in the order they are in the entrypoints arrays)
      js: jsEntrypoints,
      css: cssEntrypoints,

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
