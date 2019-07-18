import java.util.regex.Pattern

def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def optionIncludeFrontendModule = request.getProperties().get("optionIncludeFrontendModule")

def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
def rootPom = new File(rootDir, "pom.xml")
def uiAppsPackage = new File(rootDir, "ui.apps")

def removeModule(pomFile, module) {
    def pattern = Pattern.compile("\\s*<module>" + Pattern.quote(module) + "</module>", Pattern.MULTILINE)
    def pomContent = pomFile.getText("UTF-8")
    pomContent = pomContent.replaceAll(pattern, "")
    pomFile.newWriter("UTF-8").withWriter { w ->
        w << pomContent
    }
}

if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}

if (optionIncludeFrontendModule == "n") {
    assert new File(rootDir, "ui.frontend").deleteDir()
    removeModule(rootPom, "ui.frontend")
}