# Core Module of the AEM Project Archetype

The core maven module (`<src-directory>/<project>/core`) includes all the Java code needed for the implementation. The module will package all of the Java code and deploy to the AEM instance as an OSGi Bundle.

The Maven Bundle Plugin defined in the `<src-directory>/<project>/core/pom.xml` is responsible for compiling the Java code into an OSGi bundle that can be recognized by AEM's OSGi container. Note that this is where the location of Sling Models are defined.

Although it is rare that the core bundle needs to be deployed independently of the ui.apps module in upper level environments, deploying the core bundle directly is useful during local development/testing. The Maven Sling Plugin allows the core bundle to be deployed to AEM directly leveraging the `autoInstallBundle` profile as defined in the [parent POM](/help/developing/archetype/using.md#parent-pom).

```shell
mvn -PautoInstallBundle clean install
```

Once successfully executed, you should be able to see the Bundles Console at `http://<host>:<port>/system/console/bundles`.

## Unit Tests

The unit test in the core module showcases classic unit testing of the code contained in the bundle. To test, execute:

```shell
mvn clean test
```
