import org.apache.commons.io.FileUtils
import java.util.regex.*
import groovy.transform.Field

@Field def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
@Field def uiAppsPackage = new File(rootDir, "ui.apps")


def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def optionRunmodeConfigs = request.getProperties().get("createRunmodeConfigs")
def optionURlMapping = request.getProperties().get("createURlMapping")

/**
 * Delete/Do not generate error handling files/folder
 */
if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}

/**
 * Delete/Do not generate url mapping files/folder
 */
if (optionURlMapping == "n") {
   assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/${appsFolderName}/config.publish").deleteDir()
}

/**
 * Generate runmode config files/folder
 */
if (optionRunmodeConfigs == 'y') {
    createRunModeConfigs()
}

/**
 * Create runmode configs during archetype execution for dev,qa,stage and prod envs  
 */
def createRunModeConfigs() {
    def envNames = "dev,qa,stage,prod"
		envNames = envNames.split(/,/) as String[]
			println "Creating runmode config folders..."
			    for (int i = 0; i < envNames.length; i++) {
			           def authorDir = new File(uiAppsPackage, "src/main/content/jcr_root/apps/${appsFolderName}/config.author.${envNames[i]}")
			            authorDir.mkdir()
			            def pubDir = new File(uiAppsPackage, "src/main/content/jcr_root/apps/${appsFolderName}/config.publish.${envNames[i]}")
			            pubDir.mkdir()
			    }
}