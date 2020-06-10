plugins {
    id("com.cognifide.aem.bundle")
    id("maven-publish")
}
description = "${appTitle} - Core"

dependencies {
    testImplementation("uk.org.lidalia:slf4j-test:1.1.0")
    testImplementation("org.mockito:mockito-core:2.25.1")
    testImplementation("org.mockito:mockito-junit-jupiter:2.25.1")
    testImplementation("junit-addons:junit-addons:1.4")
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
        }
    }
}