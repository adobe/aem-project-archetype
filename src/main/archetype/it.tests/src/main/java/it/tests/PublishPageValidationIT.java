/*
 *  Copyright 2020 Adobe Systems Incorporated
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
import com.adobe.cq.testing.junit.assertion.CQAssert;
import com.adobe.cq.testing.junit.rules.CQAuthorClassRule;
import com.adobe.cq.testing.junit.rules.CQAuthorPublishClassRule;
import com.adobe.cq.testing.junit.rules.CQRule;
import com.adobe.cq.testing.junit.rules.Page;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.sling.testing.clients.ClientException;
import org.apache.sling.testing.clients.SlingHttpResponse;
import org.eclipse.jetty.client.HttpResponse;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.Ignore;
import org.slf4j.LoggerFactory;

import static java.util.concurrent.TimeUnit.MINUTES;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;

/**
 * Validates pages on publish and makes sure that the page renders completely and also
 * validates all linked resources (images, clientlibs etc).
 * 
 */
public class PublishPageValidationIT {


    // the page to test
    private static final String HOMEPAGE = "/";

    // list files which do return a zerobyte response body
    private static final List<String> ZEROBYTEFILES = Arrays.asList();



    private static final org.slf4j.Logger LOG = LoggerFactory.getLogger(PublishPageValidationIT.class);

    @ClassRule
    public static final CQAuthorPublishClassRule cqBaseClassRule = new CQAuthorPublishClassRule(true);

    @Rule
    public CQRule cqBaseRule = new CQRule(cqBaseClassRule.publishRule);

    private static HtmlUnitClient adminPublish;

    @BeforeClass
    public static void beforeClass() throws ClientException {

        adminPublish = cqBaseClassRule.publishRule.getAdminClient(CQClient.class).adaptTo(HtmlUnitClient.class);
    }

    @AfterClass
    public static void afterClass() {
        // As of 2022/10/13, AEM declares 'org.apache.commons.io.IOUtils.closeQuietly' as deprecated,
        // even though the function has been un-deprecated again in version 2.9.0 of 'commons-io'
        // (https://issues.apache.org/jira/browse/IO-504); thus a try-catch is used instead.
        try {
            adminPublish.close();
        } catch (IOException ignored) {}
    }



    @Test
    @Ignore
    public void validateHomepage() throws ClientException, IOException, URISyntaxException {
        String path = HOMEPAGE;
        verifyPage(adminPublish, path);
        verifyLinkedResources(adminPublish,path);

    }


    private static void verifyPage (HtmlUnitClient client, String path) throws ClientProtocolException, IOException {
        URI baseURI = client.getUrl();
        LOG.info("Using {} as baseURL", baseURI.toString());
        HttpGet get = new HttpGet(baseURI.toString() + path);
        org.apache.http.HttpResponse validationResponse = client.execute(get);
        assertEquals("Request to [" + get.getURI().toString() + "] does not return expected returncode 200",
                200, validationResponse.getStatusLine().getStatusCode());
    }

    private static void verifyLinkedResources(HtmlUnitClient client, String path) throws ClientException, IOException, URISyntaxException {

        List<URI> references = client.getResourceRefs(path);
        assertTrue(path + " does not contain any references!", references.size() > 0);
        for (URI ref : references ) {
            if (isSameOrigin(client.getUrl(), ref)) {
                LOG.info("verifying linked resource {}", ref.toString());
                SlingHttpResponse response = client.doGet(ref.getPath());
                int statusCode = response.getStatusLine().getStatusCode();
                int responseSize = response.getContent().length();
                assertEquals("Unexpected status returned from [" + ref + "]", 200, statusCode);
                if (! ZEROBYTEFILES.stream().anyMatch(s -> ref.getPath().startsWith(s))) {
                    if (responseSize == 0) {
                        LOG.warn("Empty response body from [" + ref.getPath() + "], please validate if this is correct");
                    }
                }

            } else {
                LOG.info("skipping linked resource from another domain {}", ref.toString());
            }
        }
    }

    /** Checks if two URIs have the same origin.
     *
     * @param uri1 first URI
     * @param uri2 second URI
     * @return true if two URI come from the same host, port and use the same scheme
     */
    private static boolean isSameOrigin(URI uri1, URI uri2) {
        if (!uri1.getScheme().equals(uri2.getScheme())) {
            return false;
        } else return uri1.getAuthority().equals(uri2.getAuthority());
    }


}
