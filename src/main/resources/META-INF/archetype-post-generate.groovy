import org.apache.commons.io.FileUtils
import java.util.regex.*
import groovy.transform.Field

@Field def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
@Field def uiAppsPackage = new File(rootDir, "ui.apps")
@Field def domainName = System.console().readLine 'Please enter domain name for url mapping [example.com]:'

def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def optionRunmodeConfigs = request.getProperties().get("createRunmodeConfigs")

/**
 * Delete/Do not generate error handling files/folder
 */
if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}

/**
 * Generate runmode config files/folder
 */
if (optionRunmodeConfigs == 'y') {
    createRunModeConfigs()
}

createUrlMapping()

/**
 * Write a String to a file with the given name in the given directory
 */
def writeToFile(File dir, String fileName, String content) {
    FileUtils.write(new File(dir, fileName), content, "UTF-8")
}

/**
 * Create runmode configs during archetype execution based
 * on input from user. Also generate default externalizer configs  
 */
def createRunModeConfigs() {

    def externalizerFileContent = """\
	# Configuration created by Apache Sling JCR Installer
    externalizer.domains = ["local\\ http://localhost:4502", "author\\ https://author-${domainName}", "publish\\ https://${domainName}"]
    externalizer.contextpath = ""
    externalizer.host = ""
    externalizer.encodedpath = B"false"
    """

    def envNames = System.console().readLine 'Please enter environment names for runmode configs (comma-delimited list)? [localdev,dev,qa,stage,prod]:'
	if(envNames ==~ /(([a-z])+\,*)*/ && envNames.length()!=0){
		envNames = envNames.split(/,/) as String[]
			println "Creating runmode config folders..."
			    for (int i = 0; i < envNames.length; i++) {
			           def authorDir = new File(uiAppsPackage, "src/main/content/jcr_root/apps/${appsFolderName}/config.author.${envNames[i]}")
			            authorDir.mkdir()
			            def pubDir = new File(uiAppsPackage, "src/main/content/jcr_root/apps/${appsFolderName}/config.publish.${envNames[i]}")
			            pubDir.mkdir()
			            	if(domainName!=""){
			            		writeToFile(authorDir, "com.day.cq.commons.impl.ExternalizerImpl.config", externalizerFileContent)
			            		writeToFile(pubDir, "com.day.cq.commons.impl.ExternalizerImpl.config", externalizerFileContent)
			            	}
			    }
	}else{
		println 'please match expression (([a-z])+\\,*)*'
		createRunModeConfigs()
	}
}

/**
 * Create etc mapping during archetype execution based
 * on domain name input from user.  
 */
def createUrlMapping() {
    def etcMappingContent = """<?xml version="1.0" encoding="UTF-8"?>
		<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"
	    jcr:primaryType="sling:Mapping"
	    sling:internalRedirect="/content/${contentFolderName}/us/en"
	    sling:match="^[^/]+/[^/]+/en"/>
		"""
    if (domainName != "") {
        println "Creating etc mapping..."
        def etcDir = new File(uiAppsPackage, "src/main/content/jcr_root/etc/map.publish/${domainName}")
        etcDir.mkdir()
        writeToFile(etcDir, ".content.xml", etcMappingContent)
    } else {
        assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/${appsFolderName}/config.publish/org.apache.sling.jcr.resource.internal.JcrResourceResolverFactoryImpl.config").delete()
        assert new File(uiAppsPackage, "src/main/content/jcr_root/etc/map.publish").deleteDir()
        File filterXML = new File(uiAppsPackage, "/src/main/content/META-INF/vault/filter.xml")
        def content = "<filter root=\"/etc/map.publish\" />"
        def fileText = filterXML.text
        fileText = fileText.replaceAll(content, "")
        filterXML.write(fileText);
        println "Update filter.xml..."
    }
}