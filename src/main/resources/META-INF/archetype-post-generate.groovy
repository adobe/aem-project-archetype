def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")

def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
def uiAppsPackage = new File(rootDir, "ui.apps")
def uiFrontend = new File(rootDir, "ui.frontend")

if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}
if (optionSkipFrontend == "y") {
    assert new File(uiFrontend).deleteDir()
}