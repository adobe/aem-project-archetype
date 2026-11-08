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
package ${package}.core.schedulers;

import org.apache.sling.event.jobs.JobBuilder;
import org.apache.sling.event.jobs.JobManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(AemContextExtension.class)
class SimpleJobSchedulerTest {

    private SimpleJobScheduler fixture = new SimpleJobScheduler();
    private JobManager jobManager;
    private JobBuilder jobBuilder;
    private JobBuilder.ScheduleBuilder scheduleBuilder;

    @BeforeEach
    void setup() throws Exception {
        jobManager = mock(JobManager.class);
        jobBuilder = mock(JobBuilder.class);
        scheduleBuilder = mock(JobBuilder.ScheduleBuilder.class);

        when(jobManager.getScheduledJobs(anyString(), any(Long.class), any())).thenReturn(Collections.emptyList());
        when(jobManager.createJob(anyString())).thenReturn(jobBuilder);
        when(jobBuilder.properties(any())).thenReturn(jobBuilder);
        when(jobBuilder.schedule()).thenReturn(scheduleBuilder);
        when(scheduleBuilder.cron(anyString())).thenReturn(scheduleBuilder);
        
        // Inject the mocked JobManager
        java.lang.reflect.Field jobManagerField = fixture.getClass().getDeclaredField("jobManager");
        jobManagerField.setAccessible(true);
        jobManagerField.set(fixture, jobManager);
    }

    @Test
    void activate() {
        SimpleJobScheduler.Config config = mock(SimpleJobScheduler.Config.class);
        when(config.enabled()).thenReturn(true);
        when(config.myParameter()).thenReturn("parameter value");
        when(config.scheduler_expression()).thenReturn("0 0 * * * ?");

        fixture.activate(config);

        verify(jobManager).createJob("my/sample/job");
        verify(jobBuilder).properties(any());
        verify(scheduleBuilder).cron("0 0 * * * ?");
        verify(scheduleBuilder).add();
    }
}
