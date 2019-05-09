def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def optionIncludeUrlMapping = request.getProperties().get("optionIncludeUrlMapping")

def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
def uiAppsPackage = new File(rootDir, "ui.apps")

if (optionIncludeErrorHandler == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/sling").deleteDir()
}

if (optionIncludeUrlMapping == "n") {
    assert new File(uiAppsPackage, "src/main/content/jcr_root/apps/${appsFolderName}/config.publish").deleteDir()
    assert new File(uiAppsPackage, "src/main/content/jcr_root/etc/map.publish").deleteDir()
}