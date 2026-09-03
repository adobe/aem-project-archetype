# ui.content module

The ui.content maven module (`<src-directory>/<project>/ui.content`) includes baseline content and configurations beneath `/content` and `/conf`. ui.content gets compiled into an AEM package much like [ui.apps.](../ui.apps/README.md) The major difference is that the nodes stored in ui.content can be modified on the AEM instance directly. This includes pages, DAM assets, and editable templates. The ui.content module can be used to store sample content for a clean instance and/or to create some baseline configurations that are to be managed in source control.

## ui.content/pom.xml

The ui.content module, like the ui.apps module, uses the FileVault Package plugin. However the ui.content pom (`<src>/<project>/ui.content/pom.xml`) includes an extra configuration property called `acHandling`, set to `merge_preserve`. This is included because the ui.content module includes Access Control Lists (ACLs) which are permissions, which determine who can edit the templates. In order for these ACLs to be imported into AEM the `acHandling` property is needed.

## filter.xml

The `filter.xml` file for the ui.content module is found at `<src>/<project>/ui.content/src/main/content/META-INF/vault/filter.xml` and contains the paths that will be included and installed with the ui.content package. Notice that a `mode="merge"` attribute is added to the path. This ensures that the configurations deployed with a code deployment do not automatically override content or configurations that have been authored on the AEM instance directly.

## Maintenance Window Configuration

This module includes a default Maintenance Window definition used for scheduling automated tasks within AEM.

### File Location

`src/main/content/jcr_root/conf/${projectName}/settings/granite/operations/maintenance/default.maintenancewindow.json`


### Purpose

This file defines a weekly maintenance window that runs every **Sunday from 3:00 AM to 4:00 AM UTC**, allowing AEM to execute registered maintenance tasks such as version purging or workflow cleanup.

It is a context-aware configuration and applies to both Author and Publish instances.

You can customize this JSON to define your own maintenance schedules based on your deployment needs.

📘 For more info, refer to [Adobe’s official documentation on Maintenance Tasks](https://experienceleague.adobe.com/docs/experience-manager-65/administering/operations/maintenance-tasks.html).
