# it.tests module

There are three levels of testing contained in the project:

* [Unit Tests](../core/README.md#unit-tests)
* Integration Tests
* [UI Tests](../ui.tests/README.md)

This article describes the integration tests available as part of the it.tests module.

## Running integration tests

The server-side integration tests allow unit-like tests to be run in the AEM-environment, i.e. on the AEM server. To test, execute:

```
mvn clean verify -Plocal
```
