# ${appTitle}
#if ( $aemVersion == "cloud")

This is an AEM as a Cloud Service project using the Java stack.

It is built locally using Maven#if ( $frontendModule != "decoupled" ) and can be tested against a local Quickstart#if ( $includeDispatcherConfig != "n" ), and the Dispatcher configuration is validated locally using the Dispatcher Tools#end#end.

Production deployments are done through Adobe Cloud Manager using Full Stack Pipelines#if ( $frontendModule == "decoupled" ) and Frontend Pipelines for decoupled frontend code#end.

The Java version used in Cloud Manager pipelines is defined in the `.cloudmanager/java-version` file. Assume the same is used for local builds.

#else

This is an AEM project targeting Adobe Managed Services or on-prem using the Java stack.

It is built locally using Maven and can be tested against a local Quickstart. 

#end
#if ( $includeCif == "y" || $includeForms == "y" || $includeFormsenrollment == "y" || $includeFormscommunications == "y" || $includeFormsheadless == "y" || $precompiledScripts == "y" )
${hash}${hash} Add-ons and extensions

#if ( $includeCif == "y" )
- **Commerce Integration Framework (CIF)**: The commerce backend endpoint is configured in `ui.config` OSGi configurations. CIF Core Components are included for building commerce experiences (product pages, catalog, search, cart, checkout). See README-CIF.md for more details.
#end
#if ( $includeForms == "y" || $includeFormsenrollment == "y" || $includeFormscommunications == "y" )
#if ( $aemVersion == "cloud" )
- **AEM Forms**: Forms Core Components are provided OOTB in AEM as a Cloud Service. The project contains Adaptive Forms components, templates, themes, and configurations for building form experiences.
#else
- **AEM Forms**: The project contains Adaptive Forms components, templates, themes, and configurations for building form experiences.
#end
#end
#if ( $includeFormsheadless == "y" )
- **Headless Adaptive Forms**: The `ui.frontend.react.forms.af` module provides a React-based rendering layer for forms consumed via the form model JSON. Forms can be rendered in external applications while leveraging AEM Forms capabilities for form logic and data handling.
#end
#if ( $precompiledScripts == "y" )
- **Precompiled Scripts**: HTL scripts from `ui.apps` are precompiled into a bundle during the build and attached as a secondary bundle artifact for improved performance. See README-precompiled-scripts.md for more details.
#end

#end
${hash}${hash} Modules

- `core`: OSGi bundle. Contains the Java code for backend services, models, and business logic#if ( $includeCif == "y" ), including commerce-specific models and servlets#end. Uses OSGi for dependency injection, Sling models for exposing content to Sling scripts and JUnit for unit testing.
#if ( $includeDispatcherConfig != "n" )
#if ( $aemVersion == "cloud" )
- `dispatcher`: Contains the cloud-optimized Dispatcher configuration, including caching and security settings. Uses immutable files that are validated by the Dispatcher SDK. 
#else
- `dispatcher`: Contains Dispatcher configuration suitable for Adobe Managed Services or on-prem deployments, including caching and security settings. 
#end
#end
- `ui.apps`: FileVault content package. Contains the application code, including components, templates, client libraries, and content structure. Uses HTL as the scripting engine.
- `ui.apps.structure`: FileVault content package. Empty module that defines the structure of the repository content.
- `ui.config`: FileVault content package. Contains OSGi configurations for the application.
- `ui.content`: FileVault content package. Contains the mutable content for the application, such as the initial site structure, templates, sample assets.
#if ( $frontendModule == "general" )
- `ui.frontend`: Frontend module built with Webpack. Compiles TypeScript/JavaScript and Sass/SCSS. During the build it's copied to the `ui.apps` module as client libraries. Uses Node.js, npm, and webpack.
#end
#if ( $frontendModule == "react" )
- `ui.frontend`: React-based SPA module built with Create React App. Uses `@adobe/aem-react-editable-components` for SPA Editor integration. During the build it's copied to the `ui.apps` module as client libraries. Run `npm start` to develop locally with a proxy to AEM (port 3000)#if ( $enableSSR == "y" ). Includes server-side rendering capabilities using Adobe I/O Runtime#end. Uses Node.js, npm, and webpack.
#end
#if ( $frontendModule == "angular" )
- `ui.frontend`: Angular-based SPA module built with Angular CLI. Uses `@adobe/aem-angular-editable-components` for SPA Editor integration. During the build it's copied to the `ui.apps` module as client libraries. Run `npm start` to develop locally with a proxy to AEM (port 4200)#if ( $enableSSR == "y" ). Includes server-side rendering capabilities using Adobe I/O Runtime#end. Uses Node.js, npm, and webpack.
#end
#if ( $frontendModule == "decoupled" )
#if ( $aemVersion == "cloud" )
- `ui.frontend`: Decoupled frontend module (headless). Consumes AEM content via JSON model APIs. Deployed via the AEM as a Cloud Service Frontend Pipeline separately from backend code. No client libraries are generated in `ui.apps`.
#else
- `ui.frontend`: Decoupled frontend module (headless). Consumes AEM content via JSON model APIs. No client libraries are generated in `ui.apps`.
#end
#end
#if ( $includeFormsheadless == "y" )
- `ui.frontend.react.forms.af`: React-based headless Adaptive Forms rendering module. Consumes form models and renders forms in a headless manner. Uses Node.js, npm, and webpack.
#end
#if ( $aemVersion == "cloud" )
- `it.tests`: Integration tests module. Uses the AEM Testing clients to run tests against running AEM instances. Executed by Cloud Manager during the _Custom Functional Testing_ step of a full stack pipeline.
- `ui.tests`: UI tests module. Uses Cypress to run end-to-end tests against running AEM instances. Executed by Cloud Manager during the _Custom UI Testing_ step of a full stack pipeline.
#else
- `it.tests`: Integration tests module. Uses the AEM Testing clients to run tests against running AEM instances. 
- `ui.tests`: UI tests module. Uses Cypress to run end-to-end tests against running AEM instances. 
#end
- `all`: FileVault content package. Includes all other FileVault packages for easy deployment.

${hash}${hash} Build

The project uses Maven as the build tool. The following commands are commonly used:

- full build: `mvn clean install`
#if ( $aemVersion == "cloud" )
- build and deploy to local AEM SDK: `mvn clean install -PautoInstallSinglePackage`
#else
- build and deploy to a local Quickstart: `mvn clean install -PautoInstallSinglePackage`
#end
- build and deploy a single FileVault content package: `mvn clean install -pl <module> -PautoInstallPackage`
- build and deploy a single OSGi bundle: `mvn clean install -pl <module> -PautoInstallBundle`
#if ( $frontendModule == "react" || $frontendModule == "angular" || $frontendModule == "general" )
- build frontend only: `cd ui.frontend && npm run build`
- develop frontend locally#if ( $frontendModule == "react" || $frontendModule == "angular" ) (requires AEM running)#end: `cd ui.frontend && npm start`
#end
#if ( $includeDispatcherConfig != "n" )
#if ( $aemVersion == "cloud" )
- validate Dispatcher configuration: `cd dispatcher && ./bin/validate.sh src`
#end
#end

${hash}${hash} Important resources

Note: there are significant architectural differences between AEM as a Cloud Service and Adobe Managed Services/on-prem deployments. Make sure to refer to the appropriate documentation for this project.

## Resource data: ["title", "cloud_url", "noncloud_url"] or ["title", "shared_url"] - null means no resource for that platform
#set($resourceData = [
  ["Architecture of Adobe Experience Manager as a Cloud Service", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/overview/architecture", null],
  ["AEM Project Structure", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/aem-project-content-package-structure", null],
  ["AEM Technical Foundations", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/aem-technologies", null],
  ["AEM as a Cloud Service Development Guidelines", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/development-guidelines", null],
  ["Java API Best Practices", "https://experienceleague.adobe.com/en/docs/experience-manager-learn/foundation/development/understand-java-api-best-practices", null],
  ["The AEM as a Cloud Service SDK", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/aem-as-a-cloud-service-sdk", null],
  ["Using Sling Adapters", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/full-stack/sling-adapters", null],
  ["Using the Sling Resource Merger in AEM as a Cloud Service", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/full-stack/sling-resource-merger", null],
  ["Getting Started with HTL", "https://experienceleague.adobe.com/en/docs/experience-manager-htl/content/getting-started"],
  ["Overlays in AEM as a Cloud Service", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/full-stack/overlays", null],
  ["Templates", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/full-stack/components-templates/templates", null],
  ["Core Components Introduction", "https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/introduction"],
  ["Components Reference Guide", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/full-stack/components-templates/reference", null],
  ["Manage digital assets with the Adobe Experience Manager Assets HTTP API", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/admin/mac-api-assets", null],
  ["Deprecated and Removed Features and APIs", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/release-notes/deprecated-removed-features", null],
  ["Best Practices for Sling Service User Mapping and Service User Definition", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/security/best-practices-for-sling-service-user-mapping-and-service-user-definition", null],
  ["Using Client-Side Libraries on AEM as a Cloud Service", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/full-stack/clientlibs", null],
  ["Getting Started with the Universal Editor in AEM", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/getting-started", null],
  ["An overview of working with Content Fragments", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/content-fragments/overview", null],
  ["Experience Fragments", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/authoring/fragments/experience-fragments", null],
  ["AEM APIs for Structured Content Delivery and Management", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/headless/apis-headless-and-content-fragments", null],
  ["Developing and Extending Workflows", "https://experienceleague.adobe.com/en/docs/experience-manager-65/content/implementing/developing/extending-aem/extending-workflows/workflows"],
  ["Replication", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/operations/replication", null],
  ["Content Search and Indexing", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/operations/indexing", null],
  ["CDN in AEM as a Cloud Service", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/content-delivery/cdn", null],
  ["Deploying to AEM as a Cloud Service", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/deploying/overview", null],
  ["API Reference Materials", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/reference-materials", null],
  ["WCM.io AEM Mocks", "https://wcm.io/testing/aem-mock/"],
  ["Sling Mocks", "https://sling.apache.org/documentation/development/sling-mock.html"]
])

#if ( $includeDispatcherConfig != "n" )
#set($dummy = $resourceData.add(["Validating and Debugging using Dispatcher Tools", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/content-delivery/validation-debug", null]))
#end

#if ( $frontendModule == "react" || $frontendModule == "angular" || $frontendModule == "decoupled" )
#set($dummy = $resourceData.add(["SPA Editor Overview", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/hybrid/introduction", null]))
#set($dummy = $resourceData.add(["Developing SPAs for AEM", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/hybrid/developing", null]))
#end

#if ( $frontendModule == "react" )
#set($dummy = $resourceData.add(["AEM React Editable Components", "https://www.npmjs.com/package/@adobe/aem-react-editable-components"]))
#end

#if ( $frontendModule == "angular" )
#set($dummy = $resourceData.add(["Create your first Angular SPA in AEM", "https://experienceleague.adobe.com/en/docs/experience-manager-learn/getting-started-with-aem-headless/spa-editor/angular/overview", null]))
#set($dummy = $resourceData.add(["AEM Angular Editable Components", "https://www.npmjs.com/package/@adobe/aem-angular-editable-components"]))
#end

#if ( $frontendModule == "decoupled" )
#set($dummy = $resourceData.add(["Enabling Front-End Pipeline", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/site-creation/enable-front-end-pipeline", null]))
#end

#if ( $includeCif == "y" )
#set($dummy = $resourceData.add(["Getting started with AEM Commerce as a Cloud Service", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/content-and-commerce/storefront/getting-started", null]))
#set($dummy = $resourceData.add(["CIF Core Components", "https://github.com/adobe/aem-core-cif-components"]))
#end

#if ( $includeForms == "y" || $includeFormsenrollment == "y" || $includeFormscommunications == "y" || $includeFormsheadless == "y" )
#set($dummy = $resourceData.add(["AEM Forms as a Cloud Service", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/forms-overview/home", null]))
#set($dummy = $resourceData.add(["Forms Core Components", "https://github.com/adobe/aem-core-forms-components"]))
#set($dummy = $resourceData.add(["Form builder: Create forms with core components", "https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/adaptive-forms-authoring/authoring-adaptive-forms-core-components/create-an-adaptive-form-on-forms-cs/creating-adaptive-form-core-components", null]))
#end

#if ( $includeFormsheadless == "y" )
#set($dummy = $resourceData.add(["Headless Adaptive Forms", "https://experienceleague.adobe.com/en/docs/experience-manager-headless-adaptive-forms/using/overview", null]))
#end

#if ( $precompiledScripts == "y" )
#set($dummy = $resourceData.add(["Precompiled Bundled Scripts", "https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/developing/archetype/precompiled-bundled-scripts", null]))
#end

#foreach($item in $resourceData)
  ## Determine which URL to use based on array size
  #if($item.size() == 2)
    ## Single URL - applies to both cloud and non-cloud
    #set($url = $item.get(1))
  #elseif(${aemVersion} == "cloud")
    ## Cloud version - use second position
    #set($url = $item.get(1))
  #else
    ## Non-cloud version - use third position
    #set($url = $item.get(2))
  #end
  
  #if($url)
- [$item.get(0)]($url)
  #end
#end

