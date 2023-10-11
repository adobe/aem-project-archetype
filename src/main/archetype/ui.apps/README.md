# Code Package

The `ui.apps` package contains all the code to be deployed and only deploys to `/apps`.

## Common elements
Common elements of the ui.apps package include, but are not limited to:

* Component definitions and HTL scripts
* JavaScript and CSS (via Client Libraries)
* Overlays of /libs
* Fallback context-aware configurations
* ACLs (permissions)

For a more information about this package please have a look to the [official documentation](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/aem-project-content-package-structure.html?lang=en#code-packages-%2F-osgi-bundles).

## AEM Forms Core Component Themes

The `ui.apps` package includes AEM Forms Core Component themes, packaged under the path `/apps/fd/af/themes`. Below, you'll find a list of these themes and their public sources.

1. Easel - https://github.com/adobe/aem-forms-theme-easel
2. WKND - https://github.com/adobe/aem-forms-theme-wknd
3. FSI - https://github.com/adobe/aem-forms-theme-fsi
4. Healthcare - https://github.com/adobe/aem-forms-theme-healthcare