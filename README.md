# AEM project archetype

[![Build Status](https://travis-ci.org/Adobe-Marketing-Cloud/aem-project-archetype.svg?branch=master)](https://travis-ci.org/Adobe-Marketing-Cloud/aem-project-archetype)

![](https://raw.githubusercontent.com/wiki/adobe-marketing-cloud/aem-project-archetype/screenshots/archetype.png)

This archetype creates a minimal Adobe Experience Manager project as a starting point for your own projects. The properties that must be provided when using this archetype allow to name as desired all parts of this project.

See the [Getting Started with AEM Sites - WKND Tutorial](https://helpx.adobe.com/experience-manager/kt/sites/using/getting-started-wknd-tutorial-develop.html) on the Adobe Help Center website for an example of how to use it.

This project has a number features that are intended to offer a convenient starting point for new projects:

* 2 Pages
  * English and French pages with example content

* One content template based on the editable template feature
  * Example content policy

* Page component
  * Based on the [page AEM Core WCM Component](https://github.com/Adobe-Marketing-Cloud/aem-core-wcm-components/tree/master/content/src/content/jcr_root/apps/core/wcm/components/page/v1/page)
  * customfooterlibs.html and customheaderlibs.html snippet to load additional JS and CSS clientlibs according to the {cssId} property
* Content Components
  * Example: helloworld example of custom HTL component with SlingModels for the logic
  * breadcrumb, image, list, sharing, text, title, tab and carousel use the latest released version of the [AEM Core WCM Components]
  (https://github.com/Adobe-Marketing-Cloud/aem-core-wcm-components) with the recommended proxy pattern 
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
     -DarchetypeVersion=16

Where 16 is the archetype version number that you want to use (see archetype versions below).

### Available properties

Name               | Description
-------------------|------------------------------
groupId            | Base Maven groupId
artifactId         | Base Maven ArtifactId
version            | Version
package            | Java Source Package
appsFolderName     | /apps folder name
artifactName       | Maven Project Name
componentGroupName | AEM component group name
contentFolderName  | /content folder name
confFolderName     | /conf folder name
cssId              | prefix used in generated css
packageGroup       | Content Package Group name
siteName           | AEM site name

### Requirements

The latest version of the archetype has the following requirements

* Adobe Experience Manager 6.3 SP2 or higher
* Apache Maven (3.3.9 or newer)
* Adobe Public Maven Repository in maven settings, see [Knowledge Base](https://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html) article for details.

See below for support for older versions of AEM.

Archetype Version | AEM Version
------------------|-------------
7                 | 6.0 or newer
8                 | 6.0 or newer
9                 | 6.0 or newer
10                | 6.0 or newer
11                | 6.2 or newer
12                | 6.3 or newer
13                | 6.4, 6.3 + SP2
14                | 6.4, 6.3 + SP2
15                | 6.4, 6.3 + SP2
16                | 6.4, 6.3 + SP2

## Building

To compile and use an edge, local version of this archetype:

    mvn clean install


Then change to the directory in which you want to create the project and run:

    mvn archetype:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=17-SNAPSHOT
     
     
Side note: The profile "adobe-public" must be activated when using profiles like "autoInstallPackage" mentioned above.
