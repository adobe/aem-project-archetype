# AEM project archetype

[![CircleCI](https://circleci.com/gh/adobe/aem-project-archetype.svg?style=svg)](https://circleci.com/gh/adobe/aem-project-archetype)

This archetype creates a minimal Adobe Experience Manager (AEM) project as a starting point for your own projects.

## Documentation

* [Archetype Overview](https://www.adobe.com/go/aem_archetype) – the documentation.
* Following tutorials are based off this archetype:
  - [WKND Site](https://docs.adobe.com/content/help/en/experience-manager-learn/getting-started-wknd-tutorial-develop/overview.html) – to learn how to start a fresh new website.
  - [WKND Single Page App](https://helpx.adobe.com/experience-manager/kt/sites/using/getting-started-spa-wknd-tutorial-develop.html) – to build a React or Angular webapp that is fully authorable in AEM.

## Usage

To generate a project, adjust the following command line to your needs:

* Set `aemVersion=cloud` for [AEM as a Cloud Service](https://docs.adobe.com/content/help/en/experience-manager-cloud-service/landing/home.html);  
 Set `aemVersion=6.5.0` for [Adobe Managed Services](https://github.com/adobe/aem-project-archetype/tree/master/src/main/archetype/dispatcher.ams), or on-premise.
* Adjust `appTitle="My Site"` to define the website title and components groups.
* Adjust `appId="mysite"` to define the Maven artifactId, the component, config and content folder names, as well as client library names.
* Adjust `groupId="com.mysite"` to define the Maven groupId and the Java Source Package.
* Lookup the list of available properties to see if there's more you want to adjust.

```
mvn -B archetype:generate \
 -D archetypeGroupId=com.adobe.granite.archetypes \
 -D archetypeArtifactId=aem-project-archetype \
 -D archetypeVersion=23 \
 -D aemVersion=cloud \
 -D appTitle="My Site" \
 -D appId="mysite" \
 -D groupId="com.mysite" \
 -D frontendModule=general \
 -D includeExamples=n
```

### Available Properties

Name                    | Default        | Description
------------------------|----------------|--------------------
appTitle                |                | Application title, will be used for website title and components groups (e.g. `"My Site"`).
appId                   |                | Technical name, will be used for component, config and content folder names, as well as client library names (e.g. `"mysite"`).
artifactId              | *`${appId}`*   | Base Maven artifact ID (e.g. `"mysite"`).
groupId                 |                | Base Maven group ID (e.g. `"com.mysite"`).
package                 | *`${groupId}`* | Java Source Package (e.g. `"com.mysite"`).
version                 | `1.0-SNAPSHOT` | Project version (e.g. `1.0-SNAPSHOT`).
aemVersion              | `6.5.0`        | Target AEM version (can be `cloud` for [AEM as a Cloud Service](https://docs.adobe.com/content/help/en/experience-manager-cloud-service/landing/home.html); or `6.5.0`, `6.4.4`, or `6.3.3` for [Adobe Managed Services](https://github.com/adobe/aem-project-archetype/tree/master/src/main/archetype/dispatcher.ams) or on-premise).
sdkVersion              | `latest`       | When `aemVersion=cloud` a specific [SDK](https://docs.adobe.com/content/help/en/experience-manager-cloud-service/implementing/developing/aem-as-a-cloud-service-sdk.html) version can be specified (e.g. `2020.02.2265.20200217T222518Z-200130`).
includeDispatcherConfig | `y`            | Includes a dispatcher configuration either for cloud or for AMS/on-premise, depending of the value of `aemVersion` (can be `y` or `n`).
frontendModule          | `none`         | Includes a Webpack frontend build module that generates the client libraries (can be `general` or `none` for regular sites; can be `angular` or `react` for a Single Page App that implements the [SPA Editor](https://docs.adobe.com/content/help/en/experience-manager-65/developing/headless/spas/spa-overview.html)).
languageCountry         | `en_us`        | Language and country code to create the content structure from (e.g. `en_us`).
singleCountry           | `y`            | Includes a language-master content structure (can be `y`, or `n`).
includeExamples         | `y`            | Includes a [Component Library](https://www.aemcomponents.dev/) example site (can be `y`, or `n`).
includeErrorHandler     | `n`            | Includes a custom 404 response page that will be global to the entire instance (can be `y` or `n`).

### Notes

If the archetype is executed in interactive mode the first time properties with default values can't be changed (see
[ARCHETYPE-308](https://issues.apache.org/jira/browse/ARCHETYPE-308) for more details). The value can be changed when the property
confirmation at the end is denied and the questionnaire gets repeated, or by passing the parameter in the command line (e.g.
`-DincludeExamples=n`).

When running on Windows and generating the dispatcher configuration, you should be running in an elevated command prompt or the Windows Subsystem for Linux (see [#329](https://github.com/adobe/aem-project-archetype/issues/329)).

## Provided Maven profiles
The generated maven project support different deployment profiles when running the Maven install goal `mvn install` within the reactor.

Id                        | Description
--------------------------|------------------------------
autoInstallBundle         | Install core bundle with the maven-sling-plugin to the felix console
autoInstallPackage        | Install the ui.content and ui.apps content package with the content-package-maven-plugin to the package manager to default author instance on localhost, port 4502. Hostname and port can be changed with the aem.host and aem.port user defined properties.
autoInstallPackagePublish | Install the ui.content and ui.apps content package with the content-package-maven-plugin to the package manager to default publish instance on localhost, port 4503. Hostname and port can be changed with the aem.host and aem.port user defined properties.
autoInstallSinglePackage  | Install the `all` content package with the content-package-maven-plugin to the package manager to default author instance on localhost, port 4502. Hostname and port can be changed with the aem.host and aem.port user defined properties.
autoInstallSinglePackagePublish | Install the `all` content package with the content-package-maven-plugin to the package manager to default publish instance on localhost, port 4503. Hostname and port can be changed with the aem.host and aem.port user defined properties.

The profile `integrationTests` is also available for the verify goal, to run the provided integration tests on the AEM instance.

## Requirements

The latest version of the archetype has the following requirements:

* [Adobe Experience Manager as a Cloud Service](https://docs.adobe.com/content/help/en/experience-manager-cloud-service/landing/home.html) or Adobe Experience Manager 6.3.3.0 or higher (6.4.2 or higher when generating a project with an Angular/React frontend).
* Apache Maven (3.3.9 or newer).
* Adobe Public Maven Repository in maven settings, see [Knowledge Base](https://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html) article for details.

For a list of supported AEM versions of previous archetype versions, see [historical supported AEM versions](VERSIONS.md).
