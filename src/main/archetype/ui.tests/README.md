UI Test Project compatible with AEMaaCS
=======================================

[TODO]

## Structure

* `test-module/` The test project (add your tests there)

**Do not modify following files**
* `pom.xml` Builds and executes the test Docker image
* `Dockerfile` Builds test Docker image compatible with AEMaaCS
* `wait-for-grid.sh` Bash script helper to check Selenium readiness in the Docker image
* `docker-compose-wdio-*.yaml` Docker compose files to demo the Docker image with Selenium Docker images
* `assembly-ui-test-docker-context.xml` Packages test project for AEMaaCS


## Requirements

* Docker
* Maven

## Build

```
mvn clean install -Pbuild-cloud-tests
```

will build Docker image `com.adobe.cq.testing/ui.tests` locally

## Run Tests

* Requires an AEM instance (AEMaaCS or cloud ready quickstart) 

```
mvn test -Prun-cloud-tests -DAEM_AUTHOR_URL=http://host.docker.internal:4502
```

will start a Docker service with both the cloud tests and a Selenium server (using official Docker images)

### Parameters

| Parameter | Required | Default| Description |
| --- | --- | --- | --- |
| `AEM_AUTHOR_URL`        | **true**  | -         | URL of the author instance |
| `AEM_AUTHOR_USERNAME`   | false     | `admin`   | Username used to access the author instance |
| `AEM_AUTHOR_PASSWORD`   | false     | `admin`   | Password used to access the author instance |
| `AEM_PUBLISH_URL`       | false     | -         | URL of the publish instance |
| `AEM_PUBLISH_USERNAME`  | false     | `admin`   | Username used to access the publish instance |
| `AEM_PUBLISH_PASSWORD`  | false     | `admin`   | Password used to access the publish instance |
| `SELENIUM_BROWSER`      | false     | `chrome`  | Browser used in the tests (`chrome` **_or_** `firefox`) |

#### Example

Run tests on Firefox, targeting a custom AEM instance:

```
mvn test \
    -Prun-cloud-tests \
    -DAEM_AUTHOR_URL=http://my-aem-author-instance.com \
    -DAEM_AUTHOR_PASSWORD=aVVe5om3 \
    -DSELENIUM_BROWSER=firefox
```
