// custom groovy script executed prior to https://maven.apache.org/archetype/maven-archetype-plugin/jar-mojo.html
import java.security.MessageDigest
import java.util.regex.Pattern
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

def md5(file, isWindowsLineEnding) {
    def hash = MessageDigest.getInstance('MD5')
    file.withReader { reader ->
        while ((line = reader.readLine()) != null) {
            // assume that even the last line ends with a newline character
            line += isWindowsLineEnding ? "\r\n" : "\n"
            def buffer = line.getBytes(StandardCharsets.UTF_8)
            hash.update(buffer, 0, buffer.length)
        }
    }
    hash.digest().encodeHex().toString()
}

def getImmutableDispatcherFileEnforcerRules(baseDir, immutableFiles, indent, initialIndentLevel, messageLink, isWindowsLineEnding) {
    StringWriter rules = new StringWriter()
    IndentPrinter printer = new IndentPrinter(rules, indent, true, true)
    printer.setIndentLevel(initialIndentLevel)
    for (String immutableFile : immutableFiles) {
        printer.println('<requireFileChecksum>')
        printer.incrementIndent();
        printer.println("<file>${immutableFile}</file>")
        def md5 = md5(new File(baseDir, immutableFile), isWindowsLineEnding)
        printer.println("<checksum>${md5}</checksum>")
        printer.println('<type>md5</type>')
        printer.println("<message>There have been changes detected in a file which is supposed to be immutable according to ${messageLink}: ${immutableFile}</message>")
        printer.decrementIndent();
        printer.println('</requireFileChecksum>')
    }
    return rules.toString()
}