import org.apache.commons.io.FileUtils
import java.util.regex.*
import groovy.transform.Field

@Field def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
@Field def uiAppsPackage = new File(rootDir, "ui.apps")
@Field def uiContentPackage = new File(rootDir, "ui.content")


def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def language_country = request.getProperties().get("language_country")
def isSingleCountryWebsite = request.getProperties().get("isSingleCountryWebsite")


if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
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
