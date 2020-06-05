# Sample AEM project template - Commerce usage

This project template includes dependencies to [CIF Core Components](https://github.com/adobe/aem-core-cif-components) and  best practices for creating your own AEM commerce project.

The CIF Core Components connect to a Magento (or alternative commerce system) via GraphQL. This connection has to be configured in the `com.adobe.cq.commerce.graphql.client.impl.GraphqlClientImpl-default.config` config. A reference is included in the project template. Consult [documentation](https://github.com/adobe/aem-core-cif-components/wiki/configuration) for detailed configuation steps.

The project depends on the CIF Authoring tooling. The CIF Connector is not included in the generated project and must be installed separately. See [CIF Connector](https://github.com/adobe/commerce-cif-connector) project for instructions.

Sample code demonstrating how [CIF core components can be customized](https://github.com/adobe/aem-core-cif-components/wiki/Customizing-CIF-Core-Components) and extended is included in the `core` bundle module. The Sling modules package contains an example `MyProductTeaser` model.
