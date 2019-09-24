import static groovy.io.FileType.*
import java.nio.file.Path
import java.util.regex.Pattern

def optionIncludeErrorHandler = request.getProperties().get("optionIncludeErrorHandler")
def optionIncludeFrontendModule = request.getProperties().get("optionIncludeFrontendModule")
def optionAemVersion = request.getProperties().get("optionAemVersion")
def confFolderName = request.getProperties().get("confFolderName")
def optionDispatcherConfig = request.getProperties().get("optionDispatcherConfig")

def rootDir = new File(request.getOutputDirectory() + "/" + request.getArtifactId())
def rootPom = new File(rootDir, "pom.xml")
def uiAppsPackage = new File(rootDir, "ui.apps")
def uiContentPackage = new File(rootDir, "ui.content")

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

if (optionAemVersion == "6.3.3") {
    assert new File(uiContentPackage, "src/main/content/jcr_root/conf/" + confFolderName  + "/settings/wcm/segments").deleteDir()
}

if (optionIncludeFrontendModule == "n") {
    assert new File(rootDir, "ui.frontend").deleteDir()
    removeModule(rootPom, "ui.frontend")
}

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

