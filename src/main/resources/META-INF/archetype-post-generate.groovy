import static groovy.io.FileType.*
import java.nio.file.Path
import java.util.regex.Pattern

def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
def uiAppsPackage = new File(rootDir, "ui.apps")
def uiContentPackage = new File(rootDir, "ui.content")
def rootPom = new File(rootDir, "pom.xml")
def frontendModules = ["general", "angular", "react"]

def isSingleCountryWebsite = request.getProperties().get("isSingleCountryWebsite")
def contentFolderName = request.getProperties().get("contentFolderName")
def language_country = request.getProperties().get("language_country")
def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def optionFrontendModule = request.getProperties().get("optionFrontendModule")
def optionAemVersion = request.getProperties().get("optionAemVersion")
def appsFolderName = request.getProperties().get("appsFolderName")
def confFolderName = request.getProperties().get("confFolderName")
def optionDispatcherConfig = request.getProperties().get("optionDispatcherConfig")

def appsFolder = new File("$uiAppsPackage/src/main/content/jcr_root/apps/$appsFolderName")
def confFolder = new File("$uiContentPackage/src/main/content/jcr_root/conf/$confFolderName")
def contentFolder = new File("$uiContentPackage/src/main/content/jcr_root/content/$contentFolderName")

if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}

if (optionAemVersion == "6.3.3") {
    assert new File(uiContentPackage, "src/main/content/jcr_root/conf/" + confFolderName  + "/settings/wcm/segments").deleteDir()
}

buildContentSkeleton(uiContentPackage, uiAppsPackage, isSingleCountryWebsite, contentFolderName, language_country)
cleanUpFrontendModule(frontendModules, optionFrontendModule, rootPom, rootDir, appsFolder, confFolder, contentFolder)

if ( optionDispatcherConfig == "none" || optionDispatcherConfig == "n"  ) {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/" + appsFolderName + "/config.publish").deleteDir()
} else {
    def source;
    if ( optionDispatcherConfig == 'ams') {
        source = new File(rootDir.getPath(), 'dispatcher.ams')
    } else if (optionDispatcherConfig == 'cloud')   {
        source = new File(rootDir.getPath(),'dispatcher.cloud')
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
 * Creates content skeleton based upon isSingleCountry & languageCountry input from user
 */
def buildContentSkeleton(uiContentPackage, uiAppsPackage, isSingleCountryWebsite, contentFolderName, language_country) {
    println "Creating content skeleton..."
    def contentDetails = language_country.split('_')

    if (isSingleCountryWebsite == "y") {
        def languageMastersDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/language-masters")
        languageMastersDir.deleteDir()
        def languageMastersXFMDir = new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${contentFolderName}/language-masters")
        languageMastersXFMDir.deleteDir()
        def msmAppsDir = new File(uiAppsPackage, "src/main/content/jcr_root/apps/msm")
        msmAppsDir.deleteDir()
    } else {
        def languageDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/language-masters/en")
        languageDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/language-masters/${contentDetails[0]}"))
        def languageXFMDir = new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${contentFolderName}/language" + "-masters/en")
        languageXFMDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${contentFolderName}/language-masters/${contentDetails[0]}"))
    }

    def countryDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/us")
    def countryXFMDir = new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${contentFolderName}/us")
    countryDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/${contentDetails[1]}"))
    countryXFMDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${contentFolderName}/${contentDetails[1]}"))
    def languageInCountryDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/${contentDetails[1]}/en")
    def languageInCountryXFMDir = new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${contentFolderName}/${contentDetails[1]}/en")
    languageInCountryDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/${contentDetails[1]}/${contentDetails[0]}"))
    languageInCountryXFMDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/experience-fragments/${contentFolderName}/${contentDetails[1]}/${contentDetails[0]}"))
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
