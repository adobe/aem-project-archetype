plugins {
    id("com.cognifide.aem.package")
    id("com.cognifide.aem.package.sync")
}

description = "${appTitle} - UI Apps"

aem {
    tasks {
        packageCompose {
            dependsOn(":ui.frontend:webpack")
            installBundleProject(":core")
        }
    }
}