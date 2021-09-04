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

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import ${package}.core.testcontext.AppAemContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Simple JUnit test verifying the HelloWorldModel
 */
@ExtendWith(AemContextExtension.class)
class HelloWorldModelTest {

    private final AemContext context = AppAemContext.newAemContext();

    private HelloWorldModel hello;

    private Page page;
    private Resource resource;

    @BeforeEach
    public void setup() throws Exception {

        // prepare a page with a test resource
        page = context.create().page("/content/mypage");
        resource = context.create().resource(page, "hello",
            "sling:resourceType", "${appId}/components/helloworld");

        // create sling model
        hello = resource.adaptTo(HelloWorldModel.class);
    }

    @Test
    void testGetMessage() throws Exception {
        // some very basic junit tests
        String msg = hello.getMessage();
        assertNotNull(msg);
        assertTrue(StringUtils.contains(msg, resource.getResourceType()));
        assertTrue(StringUtils.contains(msg, page.getPath()));
    }

}
