<%--
    Copyright 2015 Adobe Systems Incorporated
  
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
  
        http://www.apache.org/licenses/LICENSE-2.0
  
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    This script is loaded from head.html in /libs/foundation/components/page

--%><%@include file="/libs/foundation/global.jsp" %>

<%-- Include the client libraries located at /etc/designs/${appsFolderName}/clientlib-all --%>
<cq:includeClientLib css="${cssId}.all"/>

<%-- Include Adobe Dynamic Tag Management header embeds --%>
<cq:include script="/libs/cq/cloudserviceconfigs/components/servicelibs/servicelibs.jsp"/>

<%-- Following include is needed for the mobile emulators to work on 6.0 in Classic UI --%>
<cq:include script="/libs/wcm/mobile/components/simulator/simulator.jsp"/>