# Sample AEM project template - Precompiled Scripts

This project was set-up so that the server-side scripts from the [`ui.apps`](./ui.apps) module
are precompiled and bundled. A secondary JAR artifact will be attached by default to your build,
which will also be added to your [`all`](./all) content-package.

## Development workflow

When deployed to a local SDK development instance, a bundled precompiled script will have priority
over a script for the same resource type/selector combination. Therefore, your `/apps` script
changes will not be picked up for rendering. If you prefer the development workflow where you
edit your scripts on your local instance first, then build and deploy your modules using the
generic build instructions, but provide the following option as well:

    -DskipScriptPrecompilation=true

This option will not generate the bundle with your precompiled scripts.

For example:

```bash

    mvn clean install -PautoInstallSinglePackage -DskipScriptPrecompilation=true

```


If you have already deployed the precompiled scripts bundle on your local instance, but would like
to make script changes in `/apps`, you can either 1) stop the bundle or 2) remove it using the Web Console.
