# AEM project archetype

[![CircleCI](https://circleci.com/gh/adobe/aem-project-archetype.svg?style=svg)](https://circleci.com/gh/adobe/aem-project-archetype)

![](https://raw.githubusercontent.com/wiki/adobe-marketing-cloud/aem-project-archetype/screenshots/archetype.png)

This archetype creates a minimal Adobe Experience Manager project as a starting point for your own projects. The properties that must be provided when using this archetype allow to name as desired all parts of this project.

See the [Getting Started with AEM Sites - WKND Tutorial](https://docs.adobe.com/content/help/en/experience-manager-learn/getting-started-wknd-tutorial-develop/overview.html) on the Adobe Help Center website for an example of how to use it.

This project has a number features that are intended to offer a convenient starting point for new projects:

* 2 Pages
  * English and French pages with example content

* One content template based on the editable template feature
  * Example content policy

* Page component
  * Based on the [AEM Sites Core Component page](https://github.com/adobe/aem-core-wcm-components/tree/master/content/src/content/jcr_root/apps/core/wcm/components/page/v1/page)
  * customfooterlibs.html and customheaderlibs.html snippet to load additional JS and CSS clientlibs according to the {cssId} property
* Content Components
  * Example: helloworld example of custom HTL component with SlingModels for the logic
  * accordion, breadcrumb, button, carousel, container, content fragment, content fragment list, download, 
  experience fragment, image, language navigation, list, navigation, sharing, tabs, teaser, text and title 
  use the latest released version of the [AEM Sites Core Components](https://github.com/adobe/aem-core-wcm-components) with the recommended proxy pattern 
* Form Components
  * button, container, hidden, options and text based on the AEM Core WCM Components

* Configurations
  * Device emulators displayed in the authoring interface
  * Allow direct drag & drop of assets from the content finder into layout container (6.3 TouchUI)
  * Dictionary structure for internationalizing hardcoded strings
* Client libraries
  * CSS class names follow BEM naming conventions
  * Component-specific styles stored within each component
* Bundle with some examples
  * Models: Models for more complex business logic of components
  * Servlets: Rendering the output of specific requests
  * Filters: Applied to the requests before dispatching to the servlet or script
  * Schedulers: Cron-job like tasks
* Tests
  * Unit tests
  * Integration tests
  * Client-side Hobbes tests within developer mode
  
  
## Provided Maven profiles
The generated maven project support different deployment profiles when running the Maven install goal `mvn install` within the reactor.

Id                        | Description
--------------------------|------------------------------
autoInstallBundle         | Install core bundle with the maven-sling-plugin to the felix console
autoInstallPackage        | Install the ui.content and ui.apps content package with the content-package-maven-plugin to the package manager to default author instance on localhost, port 4502. Hostname and port can be changed with the aem.host and aem.port user defined properties. 
autoInstallPackagePublish | Install the ui.content and ui.apps content package with the content-package-maven-plugin to the package manager to default publish instance on localhost, port 4503. Hostname and port can be changed with the aem.host and aem.port user defined properties.

The profile `integrationTests` is also available for the verify goal, to run the provided integration tests on the AEM instance.  

## Usage

To use a released version of this archetype:

Either use the [AEM Eclipse extension](https://docs.adobe.com/docs/en/dev-tools/aem-eclipse.html) and follow the New Project wizard (choosing AEM Sample Multi-Module Project)...

Or use your mvn skills:

    mvn archetype:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=20

Where 20 is the archetype version number that you want to use (see archetype versions below).

### Available properties

Name                        | Default | Description
----------------------------|---------|--------------------
groupId                     |         | Base Maven groupId
artifactId                  |         | Base Maven ArtifactId
version                     |         | Version
package                     |         | Java Source Package
appsFolderName              |         | /apps folder name
artifactName                |         | Maven Project Name
componentGroupName          |         | AEM component group name
contentFolderName           |         | /content folder name
confFolderName              |         | /conf folder name
cssId                       |         | prefix used in generated css
packageGroup                |         | Content Package Group name
siteName                    |         | AEM site name
optionAemVersion            |  6.5.0  | Target AEM version
optionIncludeExamples       |    y    | Include a Component Library example site
optionIncludeErrorHandler   |    n    | Include a custom 404 response page
optionIncludeFrontendModule |    n    | Include a dedicated frontend module

Note: If the archetype is executed in interactive mode the first time properties with default values can't be changed (see 
[ARCHETYPE-308](https://issues.apache.org/jira/browse/ARCHETYPE-308) for more details). The value can be changed when the property 
confirmation at the end is denied and the questionnaire gets repeated, or by passing the parameter in the command line (e.g. 
`-DoptionIncludeExamples=n`).

### Requirements

The latest version of the archetype has the following requirements:

* Adobe Experience Manager 6.3.3.0 or higher
* Apache Maven (3.3.9 or newer)
* Adobe Public Maven Repository in maven settings, see [Knowledge Base](https://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html) article for details.

For a list of supported AEM versions of previous archetype versions, see [historical supported AEM versions](VERSIONS.md).

## Building

To compile and use an edge, local version of this archetype:

    mvn clean install

Then change to the directory in which you want to create the project and run:

    mvn archetype:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=21-SNAPSHOT

Note: The profile "adobe-public" must be activated when using profiles like "autoInstallPackage" mentioned above.
