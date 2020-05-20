@Grab(group="org.codehaus.groovy", module="groovy-all", version="2.4.8")
import static groovy.io.FileType.*
import groovy.util.XmlSlurper
import java.nio.file.Path
import java.util.regex.Pattern

def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
def uiAppsPackage = new File(rootDir, "ui.apps")
def uiContentPackage = new File(rootDir, "ui.content")
def rootPom = new File(rootDir, "pom.xml")
def frontendModules = ["general", "angular", "react"]

def singleCountry = request.getProperties().get("singleCountry")
def appId = request.getProperties().get("appId")
def languageCountry = request.getProperties().get("languageCountry")
def includeErrorHandler = request.getProperties().get("includeErrorHandler")
def frontendModule = request.getProperties().get("frontendModule")
def aemVersion = request.getProperties().get("aemVersion")
def sdkVersion = request.getProperties().get("sdkVersion")
def includeDispatcherConfig = request.getProperties().get("includeDispatcherConfig")

def appsFolder = new File("$uiAppsPackage/src/main/content/jcr_root/apps/$appId")
def confFolder = new File("$uiContentPackage/src/main/content/jcr_root/conf/$appId")
def contentFolder = new File("$uiContentPackage/src/main/content/jcr_root/content/$appId")

if (includeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}

if (aemVersion == "6.3.3") {
    assert new File(uiContentPackage, "src/main/content/jcr_root/conf/" + appId  + "/settings/wcm/segments").deleteDir()
}

if (aemVersion == "cloud") {
    if (sdkVersion == "latest") {
        println "No SDK version specified, trying to fetch latest"
        sdkVersion = getLatestSDK(request.getArchetypeVersion())
    }
    println "Using AEM as a Cloud Service SDK version: " + sdkVersion
    rootPom.text = rootPom.text.replaceAll('SDK_VERSION', sdkVersion.toString())
}

buildContentSkeleton(uiContentPackage, uiAppsPackage, singleCountry, appId, languageCountry)
cleanUpFrontendModule(frontendModules, frontendModule, rootPom, rootDir, appsFolder, confFolder, contentFolder)

if ( includeDispatcherConfig == "n"  ) {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/" + appId + "/config.publish").deleteDir()
} else {
    def source;
    if (aemVersion == 'cloud')   {
        source = new File(rootDir.getPath(),'dispatcher.cloud')
    } else {
        source = new File(rootDir.getPath(), 'dispatcher.ams')
    }
    assert source.renameTo(new File(rootDir.getPath(),'dispatcher'))
    new File(rootDir, 'dispatcher').traverse(type: DIRECTORIES, nameFilter: ~/enabled.+$/) { it ->
        it.traverse(type: FILES) { enabledFile ->
            File availableFile = new File(enabledFile.getPath().replace('enabled', 'available'))
            if (!availableFile.exists()) {
                return;
            }
            Path target = java.nio.file.Paths.get(availableFile.getPath())
            Path link = java.nio.file.Paths.get(enabledFile.getPath())
            enabledFile.delete()
            Path relativeSrc = link.getParent().relativize(target)
            java.nio.file.Files.createSymbolicLink(link, relativeSrc)
        }
    }
}
assert new File(rootDir, 'dispatcher.ams').deleteDir()
removeModule(rootPom, 'dispatcher.ams')
assert new File(rootDir, 'dispatcher.cloud').deleteDir()
removeModule(rootPom, 'dispatcher.cloud')


/**
 * Creates content skeleton based upon singleCountry & languageCountry input from user
 */
def buildContentSkeleton(uiContentPackage, uiAppsPackage, singleCountry, appId, languageCountry) {
    println "Creating content skeleton..."
    def contentDetails = languageCountry.split('_')

    if (singleCountry == "y") {
        def languageMastersDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${appId}/language-masters")
        languageMastersDir.deleteDir()
        def languageMastersXFMDir = new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${appId}/language-masters")
        languageMastersXFMDir.deleteDir()
        def msmAppsDir = new File(uiAppsPackage, "src/main/content/jcr_root/apps/msm")
        msmAppsDir.deleteDir()
    } else {
        def languageDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${appId}/language-masters/en")
        languageDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/${appId}/language-masters/${contentDetails[0]}"))
        def languageXFMDir = new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${appId}/language" + "-masters/en")
        languageXFMDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${appId}/language-masters/${contentDetails[0]}"))
    }

    def countryDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${appId}/us")
    def countryXFMDir = new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${appId}/us")
    countryDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/${appId}/${contentDetails[1]}"))
    countryXFMDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${appId}/${contentDetails[1]}"))
    def languageInCountryDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${appId}/${contentDetails[1]}/en")
    def languageInCountryXFMDir = new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${appId}/${contentDetails[1]}/en")
    languageInCountryDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/${appId}/${contentDetails[1]}/${contentDetails[0]}"))
    languageInCountryXFMDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${appId}/${contentDetails[1]}/${contentDetails[0]}"))
}

/**
 * Renames and deletes frontend related files as necessary
 */
def cleanUpFrontendModule(frontendModules, optionFrontendModule, rootPom, rootDir, appsFolder, confFolder, contentFolder) {
    // Delete unwanted frontend modules
    frontendModules.each { def frontendModule ->
        // Clean up POM file
        removeModule(rootPom, 'ui.frontend.' + frontendModule)

        // Delete corresponding "ui.frontend.*" directory
        if (optionFrontendModule != frontendModule) {
            assert new File(rootDir, "ui.frontend.$frontendModule").deleteDir()
        }
    }

    // Rename selected frontend module (e.g. "ui.frontend.angular" -> "ui.frontend")
    if (optionFrontendModule != "none") {
        assert new File(rootDir, "ui.frontend.$optionFrontendModule").renameTo(new File(rootDir, "ui.frontend"))
    }

    // Not generating SPA: Delete SPA-specific files
    if (optionFrontendModule != "angular" && optionFrontendModule != "react") {
        // Delete app component
        assert new File("$appsFolder/components/structure/spa").deleteDir()

        // Delete EditConfigs
        assert new File("$appsFolder/components/text/_cq_editConfig.xml").delete()

        // Delete SPA templates
        assert new File("$confFolder/settings/wcm/templates/spa-app-template").deleteDir()
        assert new File("$confFolder/settings/wcm/templates/spa-page-template").deleteDir()

        // Delete SPA content
        assert new File("$contentFolder/us/en/home").deleteDir()
    }
}

/**
 * Removes a module section from the given pom file
 * @param pomFile pom file where the module section should be removed from
 * @param module name of the module which should be removed
 */
def removeModule(pomFile, module) {
    def pattern = Pattern.compile("\\s*<module>" + Pattern.quote(module) + "</module>", Pattern.MULTILINE)
    def pomContent = pomFile.getText("UTF-8")
    pomContent = pomContent.replaceAll(pattern, "")
    pomFile.newWriter("UTF-8").withWriter { w ->
        w << pomContent
    }
}

def getLatestSDK(archetypeVersion) {
    def metadata = new XmlSlurper().parse("https://repo1.maven.org/maven2/com/adobe/aem/aem-sdk-api/maven-metadata.xml")
    def sdkVersion = metadata.versioning.latest
    if (sdkVersion == null || sdkVersion == "") {
        sdkVersion = System.console().readLine("Cannot get latest SDK version, please provide it manually: ")
    }
    return sdkVersion
}
