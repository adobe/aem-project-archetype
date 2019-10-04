import java.util.regex.Pattern
import groovy.transform.Field

@Field def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
@Field def uiAppsPackage = new File(rootDir, "ui.apps")
@Field def uiContentPackage = new File(rootDir, "ui.content")
def rootPom = new File(rootDir, "pom.xml")

@Field def isSingleCountryWebsite = request.getProperties().get("isSingleCountryWebsite")
@Field def contentFolderName = request.getProperties().get("contentFolderName")
@Field def language_country = request.getProperties().get("language_country")
def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def optionIncludeFrontendModule = request.getProperties().get("optionIncludeFrontendModule")
def optionAemVersion = request.getProperties().get("optionAemVersion")
def confFolderName = request.getProperties().get("confFolderName")

if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}

if (optionAemVersion == "6.3.3") {
    assert new File(uiContentPackage, "src/main/content/jcr_root/conf/" + confFolderName  + "/settings/wcm/segments").deleteDir()
}

if (optionIncludeFrontendModule == "n") {
    assert new File(rootDir, "ui.frontend").deleteDir()
    removeModule(rootPom, "ui.frontend")
}

buildContentSkeleton()

/**
 * Create content skeleton based upon isSingleCountry
 * & languageCountry input from user
 */
def buildContentSkeleton() {

    println "Creating content skeleton..."
    def contentDetails = language_country.split('_')

    if (isSingleCountryWebsite == "y") {
        def languageMastersDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/language-masters")
        languageMastersDir.deleteDir()

    } else {
        def languageDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/language-masters/en")
        languageDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/language-masters/${contentDetails[0]}"))

    }

    def countryDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/us")
    countryDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/${contentDetails[1]}"))

    def languageInCountryDir = new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/${contentDetails[1]}/en")
    languageInCountryDir.renameTo(new File(uiContentPackage, "src/main/content/jcr_root/content/${contentFolderName}/${contentDetails[1]}/${contentDetails[0]}"))
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