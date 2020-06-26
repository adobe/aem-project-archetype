import com.cognifide.gradle.aem.bundle.tasks.bundle
import com.moowork.gradle.node.NodeExtension

plugins {
    id("com.cognifide.aem.common")
}

allprojects {

    group = "${groupId}"

    repositories {
        jcenter()
        maven("https://repo.adobe.com/nexus/content/groups/public")
    }

    tasks.withType<AbstractArchiveTask>().configureEach {
        archiveBaseName.set(provider { "${rootProject.name}-${project.name}" })
        destinationDirectory.set(layout.projectDirectory.dir("target"))
    }

    plugins.withId("java") {
        tasks.withType<JavaCompile>().configureEach {
            with(options) {
                sourceCompatibility = "1.8"
                targetCompatibility = "1.8"
                encoding = "UTF-8"
            }
        }

        tasks.withType<Test>().configureEach {
            useJUnitPlatform()
            testLogging.showStandardStreams = true
        }

        dependencies {
            "testRuntimeOnly"("org.junit.jupiter:junit-jupiter-engine:5.6.0")
            "testImplementation"("org.junit.jupiter:junit-jupiter-api:5.6.0")
        }
    }

    plugins.withId("com.cognifide.aem.bundle") {
        tasks {
            withType<Jar> {
                bundle {
                    bnd("-plugin org.apache.sling.caconfig.bndplugin.ConfigurationClassScannerPlugin")
                }
            }
        }

        dependencies {
            "compileOnly"("org.osgi:org.osgi.annotation.versioning:1.1.0")
            "compileOnly"("org.osgi:org.osgi.annotation.bundle:1.0.0")
            "compileOnly"("org.osgi:org.osgi.service.metatype.annotations:1.4.0")
            "compileOnly"("org.osgi:org.osgi.service.component.annotations:1.4.0")
            "compileOnly"("org.osgi:org.osgi.service.component:1.4.0")
            "compileOnly"("org.osgi:org.osgi.service.cm:1.6.0")
            "compileOnly"("org.osgi:org.osgi.service.event:1.3.1")
            "compileOnly"("org.osgi:org.osgi.service.log:1.4.0")
            "compileOnly"("org.osgi:org.osgi.resource:1.0.0")
            "compileOnly"("org.osgi:org.osgi.framework:1.9.0")
            "compileOnly"("org.apache.sling:org.apache.sling.models.api:1.3.6")
            "compileOnly"("org.apache.sling:org.apache.sling.servlets.annotations:1.2.4")
            "compileOnly"("javax.servlet:javax.servlet-api:3.1.0")
            "compileOnly"("javax.servlet.jsp:jsp-api:2.1")
            "compileOnly"("javax.annotation:javax.annotation-api:1.3.2")
            "compileOnly"("javax.jcr:jcr:2.0")
            "compileOnly"("com.day.cq.wcm:cq-wcm-taglib:5.7.4")
            "compileOnly"("org.slf4j:slf4j-api:1.7.25")
            "compileOnly"("com.adobe.cq:core.wcm.components.core:2.8.0")

            "compileOnly"("com.adobe.aem:uber-jar:6.5.0:apis")

            "testImplementation"("io.wcm:io.wcm.testing.aem-mock.junit5:2.5.2")
        }
    }

    plugins.withId("com.github.node-gradle.node") {
        configure<NodeExtension> {
            version = "12.16.2"
            yarnVersion = "1.22.4"
            download = true
        }
    }
}