
UI Testing module (Selenium) for your AEM application
===


${hash}${hash} Structure

* `test-module/` The test project (add your tests there)

**Do not modify following files**
* `pom.xml` Builds and executes the test Docker image
* `Dockerfile` Builds test Docker image compatible with AEMaaCS
* `wait-for-grid.sh` Bash script helper to check Selenium readiness in the Docker image
* `docker-compose-wdio-*.yaml` Docker compose files to demo the Docker image with Selenium Docker images
* `assembly-ui-test-docker-context.xml` Packages test project for AEMaaCS


${hash}${hash} Requirements

* Maven
* Latest version of Chrome and/or Firefox browser installed locally in default location
* An AEM author instance running at http://localhost:4502
* Sample application deployed on your AEM author instance (see [../README.md](../README.md))


${hash}${hash} Run Tests

```
mvn verify -Pui-tests-local-execution
```

${hash}${hash}${hash}${hash} Remarks
* After execution, reports and logs are available in `target/reports` folder

${hash}${hash}${hash} Parameters

| Parameter | Required | Default| Description |
| --- | --- | --- | --- |
| `AEM_AUTHOR_URL`        | false     | `http://localhost:4502` | URL of the author instance |
| `AEM_AUTHOR_USERNAME`   | false     | `admin`                 | Username used to access the author instance |
| `AEM_AUTHOR_PASSWORD`   | false     | `admin`                 | Password used to access the author instance |
| `AEM_PUBLISH_URL`       | false     | -                       | URL of the publish instance |
| `AEM_PUBLISH_USERNAME`  | false     | `admin`                 | Username used to access the publish instance |
| `AEM_PUBLISH_PASSWORD`  | false     | `admin`                 | Password used to access the publish instance |
| `SELENIUM_BROWSER`      | false     | `chrome`                | Browser used in the tests (`chrome` **_or_** `firefox`) |
| `HEADLESS_BROWSER`      | false     | `false`                 | Set [headless mode](https://en.wikipedia.org/wiki/Headless_browser) of the browser |

${hash}${hash}${hash}${hash} Example

Run tests on <span style="color:green">local</span> <span style="color:orange">headless</span> <span style="color:purple">firefox</span>, targeting a <span style="color:blue">custom AEM author instance</span>:

<PRE>
mvn test \
    <span style="color:green">-Plocal-execution</span> \
    <span style="color:orange">-DHEADLESS_BROWSER=true</span> \
    <span style="color:purple">-DSELENIUM_BROWSER=firefox</span> \
    <span style="color:blue">-DAEM_AUTHOR_URL=http://my-aem-author-instance.com</span> \
    <span style="color:blue">-DAEM_AUTHOR_USERNAME=testuser</span> \
    <span style="color:blue">-DAEM_AUTHOR_PASSWORD=aVVe5om3</span>
</PRE>


${hash}${hash} Docker execution

This project also provides Maven profiles to build and execute the tests using Docker

${hash}${hash}${hash} Requirements

* Maven
* Docker and `docker-compose`
* An AEM author instance running at http://localhost:4502

${hash}${hash}${hash} Build test image

```
mvn clean install -Pui-tests-docker-build
```

will build Docker image `${groupId}-${artifactId}/ui.tests` locally

${hash}${hash}${hash} Run Tests

**Remarks**
* Following commands will start a Docker service with both the cloud tests and a Selenium server (using official Docker images)
* Parameters described above also apply for Docker use case

${hash}${hash}${hash}${hash} Target a local AEM author instance

Example, your instance is available at http://localhost:4502):

```
mvn verify -Pui-tests-docker-execution -DAEM_AUTHOR_URL=http://host.docker.internal:4502
```

> `host.docker.internal` is a Docker convention, do not change it!

${hash}${hash}${hash}${hash} Target a remote AEM author instance

Example, you have an [AEM as a Cloud Service](https://docs.adobe.com/content/help/en/experience-manager-cloud-service/overview/introduction.html) deployment with author instance available at https://author.my-deployment.com:


```
mvn verify -Pui-tests-docker-execution -DAEM_AUTHOR_URL=https://author.my-deployment.com
```

> **&#x26A0; Default tests provided in this module require sample content (module `ui.content`) to be installed in your AEMaaCS deployment!**
