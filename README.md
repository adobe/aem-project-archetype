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
  * Built with Sightly template and simple server-side JavaScript logic
  * CSS class on the body element changes based on page template
  * Footer text is internationalized
* Structure Components
  * Topnav: custom Sightly component
  * Logo: based on foundation
* Content Components
  * helloworld: example of custom Sightly component with SlingModels for the logic
  * colctrl, textimage, text, image, title: use the Sightly foundation components
* Configurations
  * Device emulators displayed in the authoring interface
  * Allow direct drag & drop of assets from the content finder into parsys (6.1 only)
  * Dictionnary structure for internationalizing hardcoded strings
* Client libraries
  * Responsive layout with colctr that break for narrow pages
  * CSS class names follow BEM naming conventions
  * Granular CSS with component-specific rules store within each component
  * Master ClientLib under /etc/designs that merges all client libraries into one file
* Bundle with some examples
  * Models: Models for the more complex model logic of the components
  * Servlets: Rendering the output of specific requests
  * Filters: Applied to the requests before dispatching to the servlet or script
  * Schedulers: Cron-job like tasks
* Tests
  * Unit tests
  * Integration tests
  * Client-side Hobbes tests within developer mode

## Usage

To use a released version of this archetype:

    mvn archetype:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=8

Where 8 is the archetype version number that you want to use.

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

* Adobe Experience Manager 6 or higher
* Apache Maven (3.x should do)

## Building

To compile and use an edge, local version of this archetype:

    mvn clean install
    
    mvn archetype:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=9-SNAPSHOT
