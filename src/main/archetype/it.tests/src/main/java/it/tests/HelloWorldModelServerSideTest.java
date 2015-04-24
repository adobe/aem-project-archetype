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

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.apache.sling.junit.annotations.SlingAnnotationsTestRunner;
import org.apache.sling.junit.annotations.TestReference;
import org.apache.sling.settings.SlingSettingsService;
import org.junit.Test;
import org.junit.runner.RunWith;
import ${package}.core.HelloWorldModel;

/** 
 *  Test case which uses OSGi services injection
 *  to get hold of the HelloWorldModelServerSideTest which 
 *  it wants to test server-side. 
 */
@RunWith(SlingAnnotationsTestRunner.class)
public class HelloWorldModelServerSideTest {

    @TestReference
    private HelloWorldModel hello;

    @TestReference
    private SlingSettingsService settings;

    @Test
    public void testHelloWorldModelServerSide() throws Exception {
        assertNotNull(
                "Expecting HelloWorldModel to be injected by Sling test runner",
                hello);

        assertNotNull("Expecting the slingsettings to be injected by Sling test runner", settings);

        assertTrue("Expecting the HelloWorldModel to return the slingId as part of the message", 
                hello.getMessage().contains(settings.getSlingId()));
    }
}
