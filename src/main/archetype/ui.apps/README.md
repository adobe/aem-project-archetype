# ui.apps module

The ui.apps maven module (`<src-directory>/<project>/ui.apps`) includes all of the rendering code needed for the site beneath `/apps`. This includes CSS/JS that will be stored in an AEM format called [clientlibs.](../ui.frontend.general/README.md#clientlibs) This also includes HTL scripts for rendering dynamic HTML. You can think of the ui.apps module as a map to the structure in the JCR but in a format that can be stored on a file system and committed to source control.

The Apache Jackrabbit FileVault Package plugin is used to compile the contents of the ui.apps module into an AEM package that can be deployed to AEM. The global configurations for the plugin are defined in the parent pom.xml.

## Common elements
Common elements of the ui.apps package include, but are not limited to:

* Component definitions and HTL scripts
* JavaScript and CSS (via Client Libraries)
* Overlays of /libs
* Fallback context-aware configurations
* ACLs (permissions)

For a more information about this package please have a look to the [official documentation](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/aem-project-content-package-structure.html?lang=en#code-packages-%2F-osgi-bundles).

## ui.apps/pom.xml

Notice that core.wcm.components.all and core.wcm.components.examples packages are included as a sub-package. This will deploy the Core Components package along with the WKND code each time.

The core.wcm.components.all and core.wcm.components.examples are included as dependencies in the dependency list. However as a best practice, versions for dependencies are omitted here and managed in the [parent pom file.](https://experienceleague.adobe.com/docs/experience-manager-core-components/using/developing/archetype/using.html)

## Inherited configurations and properties

[The parent POM](https://experienceleague.adobe.com/docs/experience-manager-core-components/using/developing/archetype/using.html#parent-pom) (`<src>/<project>/pom.xml`) includes `<plugin>` sections which define various configurations for the plugins used in the project. This includes a configuration for the `filterSource` for the Jackrabbit FileVault Package Plugin. The `filterSource` points to the location of the `filter.xml` file that is used to define the jcr paths that are included in the package.

In addition to the Jackrabbit FileVault Package Plugin is a definition of the Content Package Plugin which is used to then push the package into AEM. Note that variables for `aem.host`, `aem.port`, `vault.user`, and `vault.password` are used that correspond to the global properties defined in the same parent POM.

## AEM Forms Core Component Themes

The `ui.apps` package includes AEM Forms Core Component themes, packaged under the path `/apps/fd/af/themes`. Below, you'll find a list of these themes and their public sources.

1. Easel - https://github.com/adobe/aem-forms-theme-easel
2. WKND - https://github.com/adobe/aem-forms-theme-wknd
3. FSI - https://github.com/adobe/aem-forms-theme-fsi
4. Healthcare - https://github.com/adobe/aem-forms-theme-healthcare

## filter.xml

The `filter.xml` file for the ui.apps module is found at `<src>/<project>/ui.apps/src/main/content/META-INF/vault/filter.xml` and contains the paths that will be included and installed with the ui.apps package.
