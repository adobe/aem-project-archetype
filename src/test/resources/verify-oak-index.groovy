// Verifies that the oak:index packaging introduced for Index Management
// (immutableRootNodeNames, allowIndexDefinitions, noIntermediateSaves) and
// Simplified Index Management (/oak:index/diff.index) is
// present in generated projects targeting AEM as a Cloud Service, and absent for AEM 6.5
// projects. Runs in the "integration-test" phase, right after the default-bound
// archetype:integration-test goal has generated and built the IT projects.
//
// See https://oak-indexing.github.io/oakTools/simplified.html and
// https://docs.adobe.com/content/help/en/experience-manager-cloud-service/operations/indexing.html
// for details.
//
// Known limitation: building the cloud "ui.apps" package emits a FileVault warning from the
// jackrabbit-nodetypes validator ("... is not allowed as child of node with potential default types
// [nt:folder] ... /oak:index/diff.index"). In reality, the node type of /oak:index is always
// nt:unstructured, but the validator falls back to "nt:folder" for that ancestor and then
// rejects diff.index (nt:unstructured) as an invalid child. This is a false positive.
// It is left unsuppressed, because the options available to suppress the warning would
// make it worse: using severityForDefaultNodeTypeViolations global and not only for this path, and
// adding a .content.xml file for the oak:index node would just result in a different warning.

import groovy.json.JsonSlurper
import java.util.zip.ZipFile

def projectsDir = new File(properties['projectsDir'])

// testProject (directory name under src/test/resources/projects) -> [generated artifactId, cloud?]
def projectsToCheck = [
    'cloud'      : ['testing-cloud', true],
    'basic'      : ['testing-basic', false],
    'basic-6.5.0': ['testing-basic', false]
]

def failures = []
def checked = []

projectsToCheck.each { testProject, config ->
    def (artifactId, cloud) = config
    def projectDir = new File(projectsDir, "${testProject}/project/${artifactId}")
    if (!projectDir.exists()) {
        // e.g. the "it-basic" profile restricts archetype.test.projectsDirectory to just the "basic"
        // project, so "cloud" and "basic-6.5.0" are intentionally absent - not built here, nothing to check.
        println "oak:index verification: '${testProject}' was not generated in this run (expected " +
            "when a profile like it-basic limits which IT projects are built) - ${projectDir} does not exist, skipping"
        return
    }
    checked << testProject

    if (cloud) {
        println "oak:index verification: '${testProject}' ui.apps build is expected to emit a benign " +
            "jackrabbit-nodetypes WARNING ('potential default types [nt:folder]') for " +
            "jcr_root/_oak_index/diff.index - this is a known limitation of this verifier/validator " +
            "combination (see the file header comment), not a real defect."
    }

    checkImmutableRootNodeNames(testProject, projectDir, failures)

    def version = readVersion(projectDir)

    def uiAppsZip = findZip(new File(projectDir, 'ui.apps/target'), "${artifactId}.ui.apps-${version}.zip", "[${testProject}] ui.apps", failures)
    def uiAppsStructureZip = findZip(new File(projectDir, 'ui.apps.structure/target'), "${artifactId}.ui.apps.structure-${version}.zip", "[${testProject}] ui.apps.structure", failures)

    if (uiAppsZip == null) {
        failures << "[${testProject}] ui.apps package zip not found"
    } else {
        checkUiApps(testProject, uiAppsZip, cloud, failures)
    }

    if (uiAppsStructureZip == null) {
        failures << "[${testProject}] ui.apps.structure package zip not found"
    } else {
        checkUiAppsStructure(testProject, uiAppsStructureZip, cloud, failures)
    }
}

if (!failures.isEmpty()) {
    throw new RuntimeException('oak:index packaging verification failed:\n - ' + failures.join('\n - '))
}

if (checked.isEmpty()) {
    throw new RuntimeException('oak:index packaging verification did not actually check any project (all were skipped as not built)')
}

println 'oak:index packaging verification passed for: ' + checked.join(', ')

String readVersion(File projectDir) {
    def props = new Properties()
    new File(projectDir, 'archetype.properties').withInputStream { props.load(it) }
    return props.getProperty('version')
}

File findZip(File targetDir, String expectedName, String label, List failures) {
    if (!targetDir.exists()) {
        return null
    }
    def expected = new File(targetDir, expectedName)
    if (expected.exists()) {
        return expected
    }
    def zips = targetDir.listFiles({ dir, name -> name.endsWith('.zip') } as FilenameFilter)
    if (zips == null || zips.length == 0) {
        return null
    }
    if (zips.length == 1) {
        failures << "${label} expected zip '${expectedName}' not found, but exactly one other zip is present (${zips[0].name}) - check the version/artifactId naming"
        return zips[0]
    }
    failures << "${label} expected zip '${expectedName}' not found among multiple candidates: ${zips.collect { it.name }.join(', ')}"
    return null
}

// immutableRootNodeNames is only a build-time filevault-package-maven-plugin validator setting
// (jackrabbit-packagetype), it leaves no trace in the built packages - so it can only be checked
// against the generated root pom.xml. It is applied unconditionally regardless of aemVersion.
void checkImmutableRootNodeNames(String testProject, File projectDir, List failures) {
    def pomFile = new File(projectDir, 'pom.xml')
    if (!pomFile.exists()) {
        failures << "[${testProject}] root pom.xml not found at ${pomFile}"
        return
    }
    def matcher = pomFile.text =~ /<immutableRootNodeNames>([^<]*)<\/immutableRootNodeNames>/
    if (!matcher.find()) {
        failures << "[${testProject}] root pom.xml is missing the <immutableRootNodeNames> validator setting"
    } else if (!matcher.group(1).split(',').collect { it.trim() }.contains('oak:index')) {
        failures << "[${testProject}] root pom.xml <immutableRootNodeNames> does not include 'oak:index' (found: ${matcher.group(1)})"
    }
}

void checkUiApps(String testProject, File zipFile, boolean cloud, List failures) {
    new ZipFile(zipFile).withCloseable { zip ->
        def contentEntry = zip.getEntry('jcr_root/_oak_index/diff.index/.content.xml')
        def diffJsonEntry = zip.getEntry('jcr_root/_oak_index/diff.index/diff.json')

        if (cloud) {
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
            if (diffJsonEntry == null) {
                failures << "[${testProject}] ui.apps package is missing jcr_root/_oak_index/diff.index/diff.json"
            } else {
                def diffJsonText = zip.getInputStream(diffJsonEntry).getText('UTF-8')
                try {
                    new JsonSlurper().parseText(diffJsonText)
                } catch (Exception e) {
                    failures << "[${testProject}] diff.index/diff.json is not valid JSON: ${e.message}"
                }
            }
        } else {
            if (contentEntry != null) {
                failures << "[${testProject}] ui.apps package (non-cloud) must not contain jcr_root/_oak_index/diff.index/.content.xml"
            }
            if (diffJsonEntry != null) {
                failures << "[${testProject}] ui.apps package (non-cloud) must not contain jcr_root/_oak_index/diff.index/diff.json"
            }
        }

        def filterEntry = zip.getEntry('META-INF/vault/filter.xml')
        if (filterEntry == null) {
            failures << "[${testProject}] ui.apps package is missing META-INF/vault/filter.xml"
        } else {
            def filterContent = zip.getInputStream(filterEntry).getText('UTF-8')
            def hasFilter = filterContent.contains('root="/oak:index/diff.index"')
            if (cloud && !hasFilter) {
                failures << "[${testProject}] ui.apps filter.xml does not declare root=\"/oak:index/diff.index\""
            } else if (!cloud && hasFilter) {
                failures << "[${testProject}] ui.apps filter.xml (non-cloud) must not declare root=\"/oak:index/diff.index\""
            }
        }

        checkPackageProperties(testProject, 'ui.apps', zip, cloud, failures)
    }
}

void checkUiAppsStructure(String testProject, File zipFile, boolean cloud, List failures) {
    new ZipFile(zipFile).withCloseable { zip ->
        def filterEntry = zip.getEntry('META-INF/vault/filter.xml')
        if (filterEntry == null) {
            failures << "[${testProject}] ui.apps.structure package is missing META-INF/vault/filter.xml"
        } else {
            def filterContent = zip.getInputStream(filterEntry).getText('UTF-8')
            def hasFilter = filterContent.contains('root="/oak:index"')
            if (cloud && !hasFilter) {
                failures << "[${testProject}] ui.apps.structure filter.xml does not declare root=\"/oak:index\""
            } else if (!cloud && hasFilter) {
                failures << "[${testProject}] ui.apps.structure filter.xml (non-cloud) must not declare root=\"/oak:index\""
            }
        }

        checkPackageProperties(testProject, 'ui.apps.structure', zip, cloud, failures)
    }
}

// allowIndexDefinitions and noIntermediateSaves are filevault-package-maven-plugin options that get
// written into the built package's META-INF/vault/properties.xml - asserting on that file (rather than
// on the archetype's generated pom.xml source) verifies the actual, effective packaging behavior.
// Note: allowIndexDefinitions always has an entry (the plugin defaults it to "false"), so its value -
// not just its presence - must be checked; noIntermediateSaves has no default and is simply absent
// when not configured.
void checkPackageProperties(String testProject, String module, ZipFile zip, boolean cloud, List failures) {
    def propsEntry = zip.getEntry('META-INF/vault/properties.xml')
    if (propsEntry == null) {
        failures << "[${testProject}] ${module} package is missing META-INF/vault/properties.xml"
        return
    }
    def props = new Properties()
    zip.getInputStream(propsEntry).withStream { props.loadFromXML(it) }

    def allowIndexDefinitions = props.getProperty('allowIndexDefinitions')
    def expectedAllowIndexDefinitions = cloud ? 'true' : 'false'
    if (allowIndexDefinitions != expectedAllowIndexDefinitions) {
        failures << "[${testProject}] ${module} properties.xml has allowIndexDefinitions=${allowIndexDefinitions}, expected ${expectedAllowIndexDefinitions}"
    }

    def noIntermediateSaves = props.getProperty('noIntermediateSaves')
    if (cloud) {
        if (noIntermediateSaves != 'true') {
            failures << "[${testProject}] ${module} properties.xml has noIntermediateSaves=${noIntermediateSaves}, expected true"
        }
    } else if (noIntermediateSaves != null) {
        failures << "[${testProject}] ${module} properties.xml (non-cloud) must not set noIntermediateSaves (found: ${noIntermediateSaves})"
    }
}
