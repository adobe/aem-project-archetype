# AEM project archetype

[![Build Status](https://travis-ci.org/Adobe-Marketing-Cloud/aem-project-archetype.svg?branch=master)](https://travis-ci.org/Adobe-Marketing-Cloud/aem-project-archetype)

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

### Building
To compile and use an edge, local version of this archetype:

    mvn clean install
    
    mvn archetype:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=9-SNAPSHOT
