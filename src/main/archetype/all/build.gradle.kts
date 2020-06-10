plugins {
    id("com.cognifide.aem.package")
    id("maven-publish")
}

description = "${appTitle} - All"

aem {
    tasks {
        packageCompose {
            nestPackageProject(":ui.apps")
            nestPackageProject(":ui.content")
        }
    }
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            artifact(common.publicationArtifact(tasks.packageCompose))
        }
    }
}