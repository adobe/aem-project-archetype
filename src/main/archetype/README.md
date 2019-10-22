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

## Frontend Build

### Features

* Full TypeScript, ES6 and ES5 support (with applicable Webpack wrappers).
* TypeScript and JavaScript linting (using a TSLint ruleset – to be refined).
* ES5 output, for legacy browser support.
* Globbing
    * No need to add imports anywhere.
    * All JS and CSS files can now be added to each component (best practice is under /clientlib/js or /clientlib/(s)css)
    * No .content.xml or js.txt/css.txt files needed as everything is run through Webpack
    * The globber pulls in all JS files under the /component/ folder. Webpack allows CSS/SCSS files to be chained in via JS files. They are pulled in through the two entry points, sites.js and vendors.js.
    * The only files consumed by AEM are the output files site.js and site.css, the resources folder in /clientlib-site as well as dependencies.js and dependencies.css in /clientlib-dependencies
* Chunks
    * Main (site js/css)
    * Vendors (dependencies js/css)
* Full Sass/Scss support (Sass is compiled to CSS via Webpack).

### Installation

1. Install [NodeJS](https://nodejs.org/en/download/) (v10+), globally. This will also install `npm`.
2. Navigate to `ui.frontend` in your project and run `npm install`. (You must have run the archetype with `-DoptionIncludeFrontendModule=y` to populate the ui.frontend folder) 

### Usage

The following npm scripts drive the frontend workflow:

* `npm run dev` - full build with JS optimization disabled (tree shaking, etc) and source maps enabled and CSS optimization disabled.
* `npm run prod` - full build with JS optimization enabled (tree shaking, etc), source maps disabled and CSS optimization enabled.

### Output

#### General

The ui.frontend module compiles the code under the `ui.frontend/src` folder and outputs the compiled CSS and JS, and any resources beneath a folder named `ui.frontend/dist`.

* **Site** - `site.js`, `site.css` and a `resources/` folder for layout dependent images and fonts are created in a `dist/clientlib-site` folder.
* **Dependencies** - `dependencies.js` and `dependencies.css` are created in a `dist/clientlib-dependencies` folder.

#### JavaScript

* **Optimization** - for production builds, all JS that is not being used or
called is removed.

#### CSS

* **Autoprefixing** - all CSS is run through a prefixer and any properties that require prefixing will automatically have those added in the CSS.
* **Optimization** - at post, all CSS is run through an optimizer (cssnano) which normalizes it according to the following default rules:
    * Reduces CSS calc expression wherever possible, ensuring both browser compatibility and compression.
    * Converts between equivalent length, time and angle values. Note that by default, length values are not converted.
    * Removes comments in and around rules, selectors & declarations.
    * Removes duplicated rules, at-rules and declarations. Note that this only works for exact duplicates.
    * Removes empty rules, media queries and rules with empty selectors, as they do not affect the output.
    * Merges adjacent rules by selectors and overlapping property/value pairs.
    * Ensures that only a single `@charset` is present in the CSS file and moves it to the top of the document.
    * Replaces the CSS initial keyword with the actual value, when the resulting output is smaller.
    * Compresses inline SVG definitions with SVGO.
* **Cleaning** - explicit clean task for wiping out the generated CSS, JS and Map files on demand.
* **Source Mapping** - development build only.

#### Notes

* Utilizes dev-only and prod-only webpack config files that share a common config file. This way the development and production settings can be tweaked independently.

#### Client Library Generation

The second part of the ui.frontend module build process leverages the [aem-clientlib-generator](https://www.npmjs.com/package/aem-clientlib-generator) plugin to move the compiled CSS, JS and any resources into the `ui.apps` module. The aem-clientlib-generator configuration is defined in `clientlib.config.js`. The following client libraries are generated:

* **clientlib-site** - `ui.apps/src/main/content/jcr_root/apps/<app>/clientlibs/clientlib-site`
* **clientlib-dependencies** - `ui.apps/src/main/content/jcr_root/apps/<app>/clientlibs/clientlib-dependencies`

#### Page Inclusion

`clientlib-site` and `clientlib-dependencies` categories are included on pages via the Page Policy configuration as part of the default template. To view the policy, edit the **Content Page Template**  > **Page Information** > **Page Policy**. 

The final inclusion of client libraries on the sites page is as follows:

```html

<HTML>
    <head>
        <link rel="stylesheet" href="clientlib-base.css" type="text/css">
        <script type="text/javascript" src="clientlib-dependencies.js"></script>
        <link rel="stylesheet" href="clientlib-dependencies.css" type="text/css">
        <link rel="stylesheet" href="clientlib-site.css" type="text/css">
    </head>
    <body>
        ....
        <script type="text/javascript" src="clientlib-site.js"></script>
        <script type="text/javascript" src="clientlib-base.js"></script>
    </body>
</HTML>
```

The above inclusion can of course be modified by updating the Page Policy and/or modifying the categories and embed properties of respective clientlibraries.

