// Verifies that the oak:index packaging introduced for GRANITE-72134 (immutableRootNodeNames,
// allowIndexDefinitions, the /oak:index filters and the diff.index example) actually ends up in the
// built content packages of the archetype integration test projects. Runs in the "verify" phase, i.e.
// after the archetype-plugin's "integration-test" goal has generated and built the IT projects.
import java.util.zip.ZipFile

def projectsDir = new File(properties['projectsDir'])

// testProject (directory name under src/test/resources/projects) -> generated artifactId
def projectsToCheck = [
    'cloud'      : 'testing-cloud',
    'basic-6.5.0': 'testing-basic'
]

def failures = []

projectsToCheck.each { testProject, artifactId ->
    def projectDir = new File(projectsDir, "${testProject}/project/${artifactId}")
    if (!projectDir.exists()) {
        // e.g. the "it-basic" profile only builds the "basic" project - nothing to check here then.
        println "Skipping oak:index verification for '${testProject}' - project was not built (${projectDir} not found)"
        return
    }

    def uiAppsZip = findZip(new File(projectDir, 'ui.apps/target'))
    def uiAppsStructureZip = findZip(new File(projectDir, 'ui.apps.structure/target'))

    if (uiAppsZip == null) {
        failures << "[${testProject}] ui.apps package zip not found"
    } else {
        checkUiApps(testProject, uiAppsZip, failures)
    }

    if (uiAppsStructureZip == null) {
        failures << "[${testProject}] ui.apps.structure package zip not found"
    } else {
        checkUiAppsStructure(testProject, uiAppsStructureZip, failures)
    }
}

if (!failures.isEmpty()) {
    throw new RuntimeException('oak:index packaging verification failed:\n - ' + failures.join('\n - '))
}

println 'oak:index packaging verification passed for: ' + projectsToCheck.keySet().join(', ')

File findZip(File targetDir) {
    if (!targetDir.exists()) {
        return null
    }
    def zips = targetDir.listFiles({ dir, name -> name.endsWith('.zip') } as FilenameFilter)
    return zips ? zips[0] : null
}

void checkUiApps(String testProject, File zipFile, List failures) {
    new ZipFile(zipFile).withCloseable { zip ->
        def contentEntry = zip.getEntry('jcr_root/_oak_index/diff.index/.content.xml')
        if (contentEntry == null) {
            failures << "[${testProject}] ui.apps package is missing jcr_root/_oak_index/diff.index/.content.xml"
        } else {
            def content = zip.getInputStream(contentEntry).getText('UTF-8')
            ['type="lucene"', 'includedPaths="/same"', 'queryPaths="/same"', 'async="async"'].each { expected ->
                if (!content.contains(expected)) {
                    failures << "[${testProject}] diff.index/.content.xml is missing expected attribute: ${expected}"
                }
            }
        }

        if (zip.getEntry('jcr_root/_oak_index/diff.index/diff.json') == null) {
            failures << "[${testProject}] ui.apps package is missing jcr_root/_oak_index/diff.index/diff.json"
        }

        def filterEntry = zip.getEntry('META-INF/vault/filter.xml')
        if (filterEntry == null) {
            failures << "[${testProject}] ui.apps package is missing META-INF/vault/filter.xml"
        } else {
            def filterContent = zip.getInputStream(filterEntry).getText('UTF-8')
            if (!filterContent.contains('root="/oak:index/diff.index"')) {
                failures << "[${testProject}] ui.apps filter.xml does not declare root=\"/oak:index/diff.index\""
            }
        }
    }
}

void checkUiAppsStructure(String testProject, File zipFile, List failures) {
    new ZipFile(zipFile).withCloseable { zip ->
        def filterEntry = zip.getEntry('META-INF/vault/filter.xml')
        if (filterEntry == null) {
            failures << "[${testProject}] ui.apps.structure package is missing META-INF/vault/filter.xml"
        } else {
            def filterContent = zip.getInputStream(filterEntry).getText('UTF-8')
            if (!filterContent.contains('root="/oak:index"')) {
                failures << "[${testProject}] ui.apps.structure filter.xml does not declare root=\"/oak:index\""
            }
        }
    }
}
