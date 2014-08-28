# AEM project archetype

To use a released version of this archetype:

    mvn archetype:generate \
     -DarchetypeGroupId=com.adobe.granite.archetypes \
     -DarchetypeArtifactId=aem-project-archetype \
     -DarchetypeVersion=7

Where 7 is the archetype version number that you want to use.

The following properties are supported to generate the sample projects:

--------------------------------------------------
groupId            | Maven GroupId
-------------------|------------------------------
groupId            | Base Maven groupId
artifactId         | Base Maven ArtifactId
version            | Version
package            | Java Source Package
appsFolderName     | /app folder name
artifactName       | Maven Project Name
componentGroupName | AEM component group name
contentFolderName  | /content folder name
cssId              | prefix used in generated css
packageGroup       | Content Package Group name
siteName           | AEM site name
--------------------------------------------------
