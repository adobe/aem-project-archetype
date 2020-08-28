// custom groovy script executed prior to https://maven.apache.org/archetype/maven-archetype-plugin/jar-mojo.html
import static groovy.io.FileType.*
import groovy.util.XmlSlurper
import java.nio.file.Path
import java.security.MessageDigest
import java.util.regex.Pattern

def rootDir = properties['rootDir']
insertImmutableDispatcherFileEnforcerRules(rootDir, 'dispatcher.ams', 'https://helpx.adobe.com/experience-manager/kb/ams-dispatcher-manual/immutable-files.html')
insertImmutableDispatcherFileEnforcerRules(rootDir, 'dispatcher.cloud', 'https://docs.adobe.com/content/help/en/experience-manager-cloud-service/implementing/content-delivery/disp-overview.html#file-structure')

def insertImmutableDispatcherFileEnforcerRules(rootDir, module, messageLink) {
    def target = new File(rootDir, module)
    def dispatcherPom = new File(target, 'pom.xml')
    dispatcherPom.text = dispatcherPom.text.replaceAll('IMMUTABLE_RULES', getImmutableDispatcherFileEnforcerRules(target, '  ', 8, messageLink))
}

def md5(file) {
    def hash = MessageDigest.getInstance('MD5')
    file.eachByte( 8192 ) { buffer, num ->
        hash.update(buffer, 0, num)
    }
    hash.digest().encodeHex().toString()
}

def getImmutableDispatcherFileEnforcerRules(baseDir, indent, initialIndentLevel, messageLink) {
    // read file names from 
    String[] immutableFiles = new File(baseDir, 'immutable.files')
    assert new File(baseDir, 'immutable.files').delete()
    StringWriter rules = new StringWriter()
    IndentPrinter printer = new IndentPrinter(rules, indent, true, true)
    printer.setIndentLevel(initialIndentLevel)
    for (String immutableFile : immutableFiles) {
        printer.println('<requireFileChecksum>')
        printer.incrementIndent();
        printer.println("<file>${immutableFile}</file>")
        def md5 = md5(new File(baseDir, immutableFile))
        printer.println("<checksum>${md5}</checksum>")
        printer.println('<type>md5</type>')
        printer.println("<message>There have been changes detected in a file which is supposed to be immutable according to ${messageLink}: ${immutableFile}</message>")
        printer.decrementIndent();
        printer.println('</requireFileChecksum>')
    }
    return rules.toString()
}