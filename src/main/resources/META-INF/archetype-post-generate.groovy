import org.apache.commons.io.FileUtils

def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def optionRunmodeConfigs = request.getProperties().get("optionRunmodeConfigs")
def optionDomainName = request.getProperties().get("optionDomainName")
def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
def uiAppsPackage = new File(rootDir, "ui.apps")

if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}

/**
 * Write a String to a file with the given name in the given directory
 */
def writeToFile(File dir, String fileName, String content) {
    FileUtils.write(new File(dir, fileName), content, "UTF-8")
}


def envNames = request.getProperties().get("envNames").split(',') as String[]
if (optionRunmodeConfigs == 'y') {

def fileContent = """\
# Configuration created by Apache Sling JCR Installer
externalizer.domains=["local\\ http://localhost:4502","author\\ https://author-${optionDomainName}","publish\\ https://${optionDomainName}"]
externalizer.contextpath=""
externalizer.host=""
externalizer.encodedpath=B"false"
"""
println "Creating runmode config folders..."
    for (int i = 0; i < envNames.length; i++) {
           def authorDir = new File(uiAppsPackage, "src/main/content/jcr_root/apps/${appsFolderName}/config.author.${envNames[i]}")
            authorDir.mkdir()
            writeToFile(authorDir, "com.day.cq.commons.impl.ExternalizerImpl.config", fileContent)
            def pubDir = new File(uiAppsPackage, "src/main/content/jcr_root/apps/${appsFolderName}/config.publish.${envNames[i]}")
            pubDir.mkdir()
            writeToFile(pubDir, "com.day.cq.commons.impl.ExternalizerImpl.config", fileContent)
    }
}
