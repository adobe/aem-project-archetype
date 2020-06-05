/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package ${package}.it.tests;

import com.adobe.cq.testing.client.CQClient;
import com.adobe.cq.testing.junit.rules.CQAuthorPublishClassRule;
import com.adobe.cq.testing.junit.rules.CQRule;
import com.adobe.cq.testing.junit.rules.Page;
import org.apache.sling.testing.clients.ClientException;
import org.apache.sling.testing.clients.SlingHttpResponse;
import org.junit.*;


/**
 * Test that some paths exist out-of-the-box on the author service. This test
 * showcases some <a
 * href="https://github.com/adobe/aem-testing-clients/wiki/Best-practices">best
 * practices</a> of the <a
 * href="https://github.com/adobe/aem-testing-clients">AEM Testing Clients</a>.
 */
public class GetPageIT {

    // The CQAuthorClassRule represents an author service. The rule will read
    // the hostname and port of the author service from the system properties
    // passed to the tests.@ClassRule

    @ClassRule
    public static final CQAuthorPublishClassRule cqBaseClassRule = new CQAuthorPublishClassRule();

    // CQRule decorates your test and adds additional functionality on top of
    // it, like session stickyness, test filtering and identification of the
    // test on the remote service.

    @Rule
    public CQRule cqBaseRule = new CQRule(cqBaseClassRule.authorRule, cqBaseClassRule.publishRule);

    static CQClient adminAuthor;

    static CQClient adminPublish;

    // Thanks to the CQAuthorClassRule, we can create two CQClient instances
    // bound to the admin user on both the author and publish service.

    @BeforeClass
    public static void beforeClass() throws ClientException {
        adminAuthor = cqBaseClassRule.authorRule.getAdminClient(CQClient.class);
        adminPublish = cqBaseClassRule.publishRule.getAdminClient(CQClient.class);
    }

    /**
     * Verifies that the homepage exists on author
     */
    @Test
    public void testHomePageAuthor() throws ClientException {
        adminAuthor.doGet("/", 200);
    }

    /**
     * Verifies that the sites console exists on author
     */
    @Test
    public void testSitesAuthor() throws ClientException {
        adminAuthor.doGet("/sites.html", 200);
    }

    /**
     * Verifies that the assets console exists on author
     */
    @Test
    public void testAssetsAuthor() throws ClientException {
        adminAuthor.doGet("/assets.html", 200);
    }

    /**
     * Verifies that the projects console exists on author
     */
    @Test
    public void testProjectsAuthor() throws ClientException {
        adminAuthor.doGet("/projects.html", 200);
    }

}
