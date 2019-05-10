# Sample AEM project template

This is a project template for AEM-based applications. It is intended as a best-practice set of examples as well as a potential starting point to develop your own functionality.

## Modules

The main parts of the template are:

* core: Java bundle containing all core functionality like OSGi services, listeners or schedulers, as well as component-related Java code such as servlets or request filters.
* ui.apps: contains the /apps (and /etc) parts of the project, ie JS&CSS clientlibs, components, templates, runmode specific configs as well as Hobbes-tests
* ui.content: contains sample content using the components from the ui.apps
* ui.tests: Java bundle containing JUnit tests that are executed server-side. This bundle is not to be deployed onto production.
* ui.launcher: contains glue code that deploys the ui.tests bundle (and dependent bundles) to the server and triggers the remote JUnit execution

## How to build

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

If you have a running AEM instance you can build and package the whole project and deploy into AEM with

    mvn clean install -PautoInstallPackage

Or to deploy it to a publish instance, run

    mvn clean install -PautoInstallPackagePublish

Or alternatively

    mvn clean install -PautoInstallPackage -Daem.port=4503

Or to deploy only the bundle to the author, run

    mvn clean install -PautoInstallBundle

## Testing

There are three levels of testing contained in the project:

* unit test in core: this show-cases classic unit testing of the code contained in the bundle. To test, execute:

    mvn clean test

* server-side integration tests: this allows to run unit-like tests in the AEM-environment, ie on the AEM server. To test, execute:

    mvn clean verify -PintegrationTests

* client-side Hobbes.js tests: JavaScript-based browser-side tests that verify browser-side behavior. To test:

    in the browser, open the page in 'Developer mode', open the left panel and switch to the 'Tests' tab and find the generated 'MyName Tests' and run them.

## Maven settings

The project comes with the auto-public repository configured. To setup the repository in your Maven settings, refer to:

    http://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html

## Frontend Build Features

* Full Typescript, ES6, ES5 and jQuery Support (with applicable Webpack wrappers)
* TS and JS linting (following TSLint ruleset – to be refined)
* ES5 output (for legacy browser support)
* Globbing:
    * No need to add imports anywhere
    * All JS and CSS files can now be added to each component (best practice is under /clientlib/js or clientlib/(s)css
    * No .content.xml or js.txt/css.txt files needed as everything is run through Webpack
    * The globber pulls in all JS files under the /component/ folder. Webpack allows CSS/SCSS files to be chained in via JS files. So, They are pulled in through the two entry points, sites.js and vendors.js.
    * The only file consumed by AEM is the output files site.js and site.css in /clientlibsite as well as dependencies.js and dependencies.css in /clientlib-dependencies
* Chunks
    * Main (site js/css)
    * Vendors (dependencies js/css)

### Output:

#### General

* Site.js/Site.css to the /clientlib-site/ folder
* Dependencies.js/Dependencies.css to the /clientlib-dependencies/ folder

#### JS

* JS Optimization - When run through the production mode all JS that is not being used or
called is removed.

#### CSS:

* Full Sass/Scss support (Sass is compiled to CSS via Webpack)
* Autoprefixing – All CSS is run through a prefixer and any properties that require prefixing will automatically have those added in the CSS.
Minified (both dev and prod)
* CSS Optimization (via cssnano) – At post, all CSS is run through an optimizer, which normalizes all CSS based on the following default rules:
    * Reduces CSS calc expression wherever possible, ensuring both browser compatibility and compression
    * Converts between equivalent length, time & angle values. Note that by default, length values are not converted.
    * Removes comments in and around rules, selectors & declarations.
    * Removes duplicated rules, at-rules and declarations. Note that this only works for exact duplicates.
    * Removes empty rules, media queries & rules with empty selectors, as they do not affect the output.
    * Merges adjacent rules by selectors & overlapping property/value pairs.
    * Ensures that only a single @charset is present in the CSS file and moves it to the top of the document. This prevents multiple, invalid declarations occurring through naïve CSS concatenation.
    * Replaces the CSS initial keyword with the actual value, when the resulting output is smaller
    * Compresses inline SVG definitions with SVGO.
* Explicit clean task for wiping out the generated CSS, JS and Map files on demand
* Source Mapping (development mode only)
* Separate NPM script to compile only Sass

## Installation

1. Install [NodeJS](https://nodejs.org/en/download/) (v10+) and install it (globally).
2. This will also install NPM.
3. Navigate to `ui.apps` in your new project and run: `npm install`

## Usage

There are four NPM scripts that drive the FE workflow:

* `npm run dev`
* `npm run prod`
* `npm run tsc`
* `npm run sass`

### Scripts

`npm run dev` - Runs the full build with:

* no JS optimization (tree shaking, etc)
* Source maps are available

`npm run prod` - Runs the full build with:

* JS optimization enabled
* Source maps disabled
* CSS minified

`npm run tsc` - Runs only the TS/JS linter to identify errrors/warnings (note: the ruleset is still being
updated).

* Requires you to have TSLint installed globally (via NodeJS). Remember to use the global flag when
installing: `npm i tslint -g`

`npm run sass` - Runs only the Sass compilation (same configuration as the main build.)

## Other Notes

* Utilizes a dev-only and prod-only webpack config file. This way you can tweak all prod and dev config settings independently.
