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
    dispatcherPom.text = dispatcherPom.text.replaceAll('IMMUTABLE_RULES', getImmutableDispatcherFileEnforcerRules(target, immutableFiles, '    ', 10, messageLink))
    assert new File(target, 'immutable.files').delete()
}

def readFile(file, encoding) throws IOException {
    byte[] encoded = Files.readAllBytes(file.toPath())
    return new String(encoded, encoding)
}

def readFileWithNormalizedLineSeparator(file, encoding) {
    String fileContent = readFile(file, encoding)
    fileContent = fileContent.replaceAll("\\r\\n", "\n")
    return fileContent.getBytes(encoding)
}

def md5(file) {
    def hash = MessageDigest.getInstance('MD5')
    def content = readFileWithNormalizedLineSeparator(file, StandardCharsets.UTF_8)
    hash.update(content, 0, content.length)
    return hash.digest().encodeHex().toString()
}

def getImmutableDispatcherFileEnforcerRules(baseDir, immutableFiles, indent, initialIndentLevel, messageLink) {
    StringWriter rules = new StringWriter()
    IndentPrinter printer = new IndentPrinter(rules, indent, true, true)
    printer.setIndentLevel(initialIndentLevel)
    for (String immutableFile : immutableFiles) {
        printer.println('<requireTextFileChecksum>')
        printer.incrementIndent();
        printer.println("<file>${immutableFile}</file>")
        def md5 = md5(new File(baseDir, immutableFile))
        printer.println("<checksum>${md5}</checksum>")
        printer.println('<type>md5</type>')
        printer.println("<message>There have been changes detected in a file which is supposed to be immutable according to ${messageLink}: ${immutableFile}</message>")
        printer.decrementIndent();
        printer.println('</requireTextFileChecksum>')
    }
    return rules.toString()
}