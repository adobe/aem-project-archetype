# ui.permissions module

This module generates custom ACLs for the project.

If the archetype is executed in interactive mode the first time 'deployCustomACLs=n' is the default setting. The value can be changed when the property confirmation at the end is denied and the questionnaire gets repeated.


## Given Names for the custom groups created

ID                        | Given Name 
--------------------------|--------
custom-administrators     |  ${siteName} Administrators    
custom-asset-admin        |  ${siteName} Asset Admin
custom-content-admin      |  ${siteName} Content Admin
custom-content-approver   |  ${siteName} Content Approver
custom-content-author     |  ${siteName} Content Author



## cURL command to add custom group as members of admin groups

e.g: Adding custom-administrators as member of administrators.
==> curl -u <username>:<password> -FaddMembers=custom-administrators http://localhost:4502/home/groups/a/administrators.rw.html