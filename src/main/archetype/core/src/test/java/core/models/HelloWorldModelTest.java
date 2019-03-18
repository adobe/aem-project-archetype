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
package ${package}.core.models;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import com.day.cq.wcm.api.Page;

import io.wcm.testing.mock.aem.junit.AemContext;

/**
 * Simple JUnit test verifying the HelloWorldModel
 */
public class HelloWorldModelTest {

    @Rule
    public final AemContext context = new AemContext();

    private HelloWorldModel hello;

    private Page page;
    private Resource resource;

    @Before
    public void setup() throws Exception {

        // prepare a page with a test resource
        page = context.create().page("/content/mypage");
        resource = context.create().resource(page, "hello",
            "sling:resourceType", "${appsFolderName}/components/content/helloworld");

        // create sling model
        hello = resource.adaptTo(HelloWorldModel.class);
    }

    @Test
    public void testGetMessage() throws Exception {
        // some very basic junit tests
        String msg = hello.getMessage();
        assertNotNull(msg);
        assertTrue(StringUtils.contains(msg, resource.getResourceType()));
        assertTrue(StringUtils.contains(msg, page.getPath()));
    }

}
