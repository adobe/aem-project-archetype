# AEM project archetype

[![Build Status](https://travis-ci.org/Adobe-Marketing-Cloud/aem-project-archetype.svg?branch=master)](https://travis-ci.org/Adobe-Marketing-Cloud/aem-project-archetype)

![](https://raw.githubusercontent.com/wiki/adobe-marketing-cloud/aem-project-archetype/screenshots/archetype.png)

This archetype creates a minimal Adobe Experience Manager project as starting point for your own projects. The properties that must be provided when using this archetype allow to name as desired all parts of this project.

This project has a number features that are intended to offer a convenient starting point for new projects:

* 2 Pages
  * English and French pages with filler text
* 2 Templates
  * For homepage and content pages
  * Homepages are only allowed on top level, and content pages below
* Page component
  * Built with Sightly templates and simple server-side JavaScript logic
  * The CSS class on the body element changes based on page template
  * Internationalized footer text as example
* Structure Components
  * Topnav: simple custom Sightly component
  * Logo: based on foundation
* Content Components
  * helloworld: example of custom Sightly component with SlingModels for the logic
  * colctrl, textimage, text, image, title: use the Sightly foundation components
* Configurations
  * Device emulators displayed in the authoring interface
  * Allow direct drag & drop of assets from the content finder into parsys (6.1 TouchUI)
  * Dictionnary structure for internationalizing hardcoded strings
* Client libraries
  * Responsive layout with colctr that break for narrow pages
  * CSS class names follow BEM naming conventions
  * Component-specific styles stored within each component
  * Master ClientLib under /etc/designs merges all client libraries into one file
* Bundle with some examples
  * Models: Models for more complex business logic of components
  * Servlets: Rendering the output of specific requests
  * Filters: Applied to the requests before dispatching to the servlet or script
  * Schedulers: Cron-job like tasks
* Tests
  * Unit tests
  * Integration tests
  * Client-side Hobbes tests within developer mode

## Usage

To use a released version of this archetype:

Either use the [AEM Eclipse extension](https://docs.adobe.com/docs/en/dev-tools/aem-eclipse.html) and follow the New Project wizard (choosing AEM Sample Multi-Module Project)...

Or use your mvn skills:

    mvn org.apache.maven.plugins:maven-archetype-plugin:2.4:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=10 \
     -DarchetypeCatalog=https://repo.adobe.com/nexus/content/groups/public/

Where 10 is the archetype version number that you want to use.

### Available properties

groupId            | Maven GroupId
-------------------|------------------------------
groupId            | Base Maven groupId
artifactId         | Base Maven ArtifactId
version            | Version
package            | Java Source Package
appsFolderName     | /apps folder name
artifactName       | Maven Project Name
componentGroupName | AEM component group name
contentFolderName  | /content folder name
cssId              | prefix used in generated css
packageGroup       | Content Package Group name
siteName           | AEM site name

### Requirements

The latest version of the archetype has the following requirements

* Adobe Experience Manager 6.2 or higher
* Apache Maven (3.3.9 or newer)

See below for support for older versions of AEM.

Archetype Version | AEM Version
------------------|-------------
7                 | 6.0 or newer
8                 | 6.0 or newer
9                 | 6.0 or newer
10                | 6.0 or newer
11                | 6.2 or newer

## Building

To compile and use an edge, local version of this archetype:

    mvn clean install


Then change to the directory in which you want to create the project and run:

    mvn archetype:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=11-SNAPSHOT
