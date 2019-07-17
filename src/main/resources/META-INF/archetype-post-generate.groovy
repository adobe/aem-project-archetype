def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def optionIncludeFrontendProject = request.getProperties().get("optionIncludeFrontendProject")

def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
def uiAppsPackage = new File(rootDir, "ui.apps")

if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}
if (optionIncludeFrontendProject == "n") {
    assert new File(rootDir, "ui.frontend").deleteDir()
}