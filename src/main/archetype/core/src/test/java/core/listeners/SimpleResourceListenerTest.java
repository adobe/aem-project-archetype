/*
 *  Copyright 2018 Adobe Systems Incorporated
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
package ${package}.core.listeners;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Arrays;
import java.util.List;

import org.apache.sling.api.resource.observation.ResourceChange;
import org.apache.sling.api.resource.observation.ResourceChange.ChangeType;
import org.junit.jupiter.api.Test;

import uk.org.lidalia.slf4jext.Level;
import uk.org.lidalia.slf4jtest.LoggingEvent;
import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;

class SimpleResourceListenerTest {

    private SimpleResourceListener fixture = new SimpleResourceListener();

    private TestLogger logger = TestLoggerFactory.getTestLogger(fixture.getClass());

    @Test
    void handleEvent() {
        
        ResourceChange change = new ResourceChange(ChangeType.ADDED,"/content/test", false);
        
        fixture.onChange(Arrays.asList(change));

        List<LoggingEvent> events = logger.getLoggingEvents();
        assertEquals(1, events.size());
        LoggingEvent event = events.get(0);

        assertAll(
                () -> assertEquals(Level.DEBUG, event.getLevel()),
                () -> assertEquals(3, event.getArguments().size()),
                () -> assertEquals(ChangeType.ADDED, event.getArguments().get(0)),
                () -> assertEquals("/content/test", event.getArguments().get(1)),
                () -> assertEquals(Boolean.FALSE,event.getArguments().get(2))
        );
    }
}