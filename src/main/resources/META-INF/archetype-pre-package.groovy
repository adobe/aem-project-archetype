// custom groovy script executed prior to https://maven.apache.org/archetype/maven-archetype-plugin/jar-mojo.html
import java.security.MessageDigest
import java.util.regex.Pattern
import java.nio.file.Files
import java.nio.charset.StandardCharsets

def rootDir = properties['rootDir']
insertImmutableDispatcherFileEnforcerRules(rootDir, 'dispatcher.ams', 'https://helpx.adobe.com/experience-manager/kb/ams-dispatcher-manual/immutable-files.html')
insertImmutableDispatcherFileEnforcerRules(rootDir, 'dispatcher.cloud', 'https://docs.adobe.com/content/help/en/experience-manager-cloud-service/implementing/content-delivery/disp-overview.html#file-structure')

def insertImmutableDispatcherFileEnforcerRules(rootDir, module, messageLink) {
    def target = new File(rootDir, module)
    def dispatcherPom = new File(target, 'pom.xml')
    String[] immutableFiles = new File(target, 'immutable.files')
    dispatcherPom.text = dispatcherPom.text.replaceAll('IMMUTABLE_RULES_NON_WINDOWS', getImmutableDispatcherFileEnforcerRules(target, immutableFiles, '    ', 10, messageLink, false))
    dispatcherPom.text = dispatcherPom.text.replaceAll('IMMUTABLE_RULES_WINDOWS', getImmutableDispatcherFileEnforcerRules(target, immutableFiles, '    ', 10, messageLink, true))
    assert new File(target, 'immutable.files').delete()
}

def readFile(file, encoding) throws IOException {
    byte[] encoded = Files.readAllBytes(file.toPath())
    return new String(encoded, encoding)
}

def readFileWithNormalizedLineSeparator(file, encoding, isForWindows) {
    String fileContent = readFile(file, encoding)
    if (isForWindows) {
        fileContent = fileContent.replaceAll("(?<!\\r)\\n", "\r\n")
    } else {
        fileContent = fileContent.replaceAll("\\r\\n", "\n")
    }
    return fileContent.getBytes(encoding)
}

def md5(file, isForWindows) {
    def hash = MessageDigest.getInstance('MD5')
    def content = readFileWithNormalizedLineSeparator(file, StandardCharsets.UTF_8, isForWindows)
    hash.update(content, 0, content.length)
    return hash.digest().encodeHex().toString()
}

def getImmutableDispatcherFileEnforcerRules(baseDir, immutableFiles, indent, initialIndentLevel, messageLink, isForWindows) {
    StringWriter rules = new StringWriter()
    IndentPrinter printer = new IndentPrinter(rules, indent, true, true)
    printer.setIndentLevel(initialIndentLevel)
    for (String immutableFile : immutableFiles) {
        printer.println('<requireFileChecksum>')
        printer.incrementIndent();
        printer.println("<file>${immutableFile}</file>")
        def md5 = md5(new File(baseDir, immutableFile), isForWindows)
        printer.println("<checksum>${md5}</checksum>")
        printer.println('<type>md5</type>')
        printer.println("<message>There have been changes detected in a file which is supposed to be immutable according to ${messageLink}: ${immutableFile}</message>")
        printer.decrementIndent();
        printer.println('</requireFileChecksum>')
    }
    return rules.toString()
}