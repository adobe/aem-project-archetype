import com.moowork.gradle.node.yarn.YarnTask

plugins {
    id("base")
    id("com.github.node-gradle.node")
}

description = "${appTitle} - UI Frontend"

tasks {
    register<YarnTask>("webpack") {
        description = "Builds UI frontend clientlib using Webpack"
        dependsOn("yarn")

        val mode = project.findProperty("webpack.mode")?.toString() ?: "prod"

        setYarnCommand(mode)

        inputs.property("mode", mode)
        inputs.file("package.json")
        inputs.dir("src")
        outputs.dir("dist")
    }

    register<Zip>("zip") {
        dependsOn("webpack")
        from("dist")
    }

    clean {
        doLast {
            delete("dist")
        }
    }

    build {
        dependsOn("zip")
    }
}