const path = require('path');

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

const libsBaseConfig = {
  allowProxy: true,
  serializationFormat: 'xml',
  cssProcessor: ['default:none', 'min:none'],
  jsProcessor: ['default:none', 'min:none']
};

// Config for `aem-clientlib-generator`
module.exports = {
  context: BUILD_DIR,
  clientLibRoot: CLIENTLIB_DIR,
  libs: [
    {
      ...libsBaseConfig,
      name: 'clientlib-dependencies',
      categories: ['${cssId}.dependencies'],
      assets: {
        // Copy entrypoint scripts and stylesheets into the respective ClientLib
        // directories
        js: {
          cwd: 'clientlib-dependencies',
          files: ['**/*.js'],
          flatten: false
        },
        css: {
          cwd: 'clientlib-dependencies',
          files: ['**/*.css'],
          flatten: false
        }
      }
    },
    {
      ...libsBaseConfig,
      name: 'clientlib-site',
      categories: ['${cssId}.site'],
      dependencies: ['${cssId}.dependencies'],
      assets: {
        // Copy entrypoint scripts and stylesheets into the respective ClientLib
        // directories
        js: {
          cwd: 'clientlib-site',
          files: ['**/*.js'],
          flatten: false
        },
        css: {
          cwd: 'clientlib-site',
          files: ['**/*.css'],
          flatten: false
        },

        // Copy all other files into the `resources` ClientLib directory
        resources: {
          cwd: 'clientlib-site',
          files: ['**/*.*'],
          flatten: false,
          ignore: ['**/*.js', '**/*.css']
        }
      }
    }
  ]
};
