# AEM project archetype

[![CircleCI](https://circleci.com/gh/adobe/aem-project-archetype.svg?style=svg)](https://circleci.com/gh/adobe/aem-project-archetype)

This archetype creates a minimal Adobe Experience Manager project as a starting point for your own projects.

## Documentation

* [Archetype Overview](https://docs.adobe.com/content/help/en/experience-manager-core-components/using/developing/archetype/overview.html)
* [Getting Started with AEM Sites - WKND Tutorial](https://docs.adobe.com/content/help/en/experience-manager-learn/getting-started-wknd-tutorial-develop/overview.html) is a good example as it is based on this 
archetype
* [WDND Events Tutorial](https://helpx.adobe.com/experience-manager/kt/sites/using/getting-started-spa-wknd-tutorial-develop.html) Is a 
good resource to get familiar with the React and Angular frontend module 

## Usage

To use the latest released version of this archetype execute the following maven command:

    mvn archetype:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=22

Where 22 is the archetype version number that you want to use (see archetype versions below).

## Provided Maven profiles
The generated maven project support different deployment profiles when running the Maven install goal `mvn install` within the reactor.

Id                        | Description
--------------------------|------------------------------
autoInstallBundle         | Install core bundle with the maven-sling-plugin to the felix console
autoInstallPackage        | Install the ui.content and ui.apps content package with the content-package-maven-plugin to the package manager to default author instance on localhost, port 4502. Hostname and port can be changed with the aem.host and aem.port user defined properties.
autoInstallPackagePublish | Install the ui.content and ui.apps content package with the content-package-maven-plugin to the package manager to default publish instance on localhost, port 4503. Hostname and port can be changed with the aem.host and aem.port user defined properties.
autoInstallSinglePackage | Install the `all` content package with the content-package-maven-plugin to the package manager to default author instance on localhost, port 4502. Hostname and port can be changed with the aem.host and aem.port user defined properties.
autoInstallSinglePackagePublish | Install the `all` content package with the content-package-maven-plugin to the package manager to default publish instance on localhost, port 4503. Hostname and port can be changed with the aem.host and aem.port user defined properties.

The profile `integrationTests` is also available for the verify goal, to run the provided integration tests on the AEM instance.

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
language_country            |   en_us | language / country code to create the content structure from (e.g. en_us)
optionIncludeExamples       |    y    | Include a Component Library example site
optionIncludeErrorHandler   |    n    | Include a custom 404 response page
optionFrontendModule        |   none  | Include a dedicated frontend module (one of `none`, `general`, `angular`, `react`)
isSingleCountryWebsite      |    y    | Create language-master structure in example content
optionDispatcherConfig      |   none  | Generate a dispatcher configuration module

Note: If the archetype is executed in interactive mode the first time properties with default values can't be changed (see
[ARCHETYPE-308](https://issues.apache.org/jira/browse/ARCHETYPE-308) for more details). The value can be changed when the property
confirmation at the end is denied and the questionnaire gets repeated, or by passing the parameter in the command line (e.g.
`-DoptionIncludeExamples=n`).

### Requirements

The latest version of the archetype has the following requirements:

* Adobe Experience Manager 6.3.3.0 or higher (6.4.2 or higher when generating a project with an Angular/React frontend)
* Apache Maven (3.3.9 or newer)
* Adobe Public Maven Repository in maven settings, see [Knowledge Base](https://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html) article for details.

For a list of supported AEM versions of previous archetype versions, see [historical supported AEM versions](VERSIONS.md).