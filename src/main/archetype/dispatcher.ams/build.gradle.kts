plugins {
    id("base")
}

description = "${appTitle} - Dispatcher"

tasks {
    register<Zip>("zip") {
        from("src")
    }
    build {
        dependsOn("zip")
    }
}