# Code Package

The ui.apps package contains all the code to be deployed and only deploys to /apps. Common elements of the ui.apps package include, but are not limited to:

Component definitions and HTL scripts
/apps/my-app/components
JavaScript and CSS (via Client Libraries)
/apps/my-app/clientlibs
Overlays of /libs
/apps/cq, /apps/dam/, and so on.
Fallback context-aware configurations
/apps/settings
ACLs (permissions)
This module contains the repository structure package which is required by AEM as a Cloud Service deployments. 

For a more information about this package please have a look to the [official documentation](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/aem-project-content-package-structure.html?lang=en#code-packages-%2F-osgi-bundles).