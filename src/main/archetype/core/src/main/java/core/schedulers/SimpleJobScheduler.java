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
package ${package}.core.schedulers;

import org.apache.sling.event.jobs.JobManager;
import org.apache.sling.event.jobs.ScheduledJobInfo;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * A simple demo for scheduling a Sling Job programmatically.
 * This component does NOT use the Runnable interface.
 */
@Designate(ocd=SimpleJobScheduler.Config.class)
@Component(immediate = true)
public class SimpleJobScheduler {

    @ObjectClassDefinition(name="A scheduled task setup",
                           description = "Simple demo for cron-job like task with properties")
    public static @interface Config {
    
        @AttributeDefinition(name = "Enabled",
                             description = "Enable scheduled job")
        boolean enabled() default false;

        @AttributeDefinition(name = "Cron-job expression",
                             description = "Cron-job expression. Default: run every day at midnight (0 0 0 * * ?). " + 
                                           "Note: quartz cron format is used.")
        String scheduler_expression() default "0 0 0 * * ?";

        @AttributeDefinition(name = "A parameter",
                             description = "Can be configured in /system/console/configMgr")
        String myParameter() default "";
    }

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private static final String JOB_TOPIC = "com/mysite/job/sample";

    @Reference
    private JobManager jobManager;

    @Activate
    protected void activate(final Config config) {
        // Remove any existing scheduled jobs for this topic to avoid duplicates
        unscheduleJobs();

        if (config.enabled()) {
            logger.debug("SimpleJobScheduler is setting up the Sling Job schedule");

            Map<String, Object> jobProperties = new HashMap<>();
            jobProperties.put("myParameter", config.myParameter());
            
            // Programmatically add the job to the schedule
            jobManager.createJob(JOB_TOPIC)
                      .properties(jobProperties)
                      .schedule()
                      .cron(config.scheduler_expression())
                      .add();
        } else {
            logger.debug("SimpleJobScheduler is disabled, not scheduling the Sling Job");
        }
    }

    @Deactivate
    protected void deactivate() {
        unscheduleJobs();
    }

    private void unscheduleJobs() {
        Collection<ScheduledJobInfo> scheduledJobs = jobManager.getScheduledJobs(JOB_TOPIC, 10, null);
        if (scheduledJobs != null) {
            for (ScheduledJobInfo jobInfo : scheduledJobs) {
                jobInfo.unschedule();
            }
        }
    }
}
