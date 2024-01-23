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

/*
 * WDIO Testrunner Configuration - See https://webdriver.io/docs/configurationfile.html
 */
import {aem, reports_path} from './lib/config.js';
// eslint-disable-next-line no-unused-vars
import {ReportAggregator, HtmlReporter}    from 'wdio-html-nice-reporter';
// eslint-disable-next-line no-unused-vars
import video from 'wdio-video-reporter';
import path from 'path';
import log4js from 'log4js';
import { commands } from './lib/wdio.commands.js';

// eslint-disable-next-line no-unused-vars
let reportAggregator = ReportAggregator;

export const config = {
    runner: 'local',

    // Tests
    specs: [
        './specs/**/*.js',
    ],

    logLevel: 'debug',

    bail: 0,

    // Enforce complete spec file retry when a test fail
    specFileRetries: 1,
    specFileRetriesDeferred: false,

    baseUrl: aem.author.base_url,

    sync: true,

    waitforTimeout: 60000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 3,

    framework: 'mocha',

    // Location of the WDIO/Selenium logs
    outputDir: reports_path,

    // Reporters
    reporters: [
        'spec',
        ['junit', {
            outputDir: path.join('./reports', 'junit'),
            outputFileFormat: function(options) {
                return `results-${options.cid}.${options.capabilities.browserName}.xml`;
            }
        }],
        ['html-nice', {
            debug: false,
            outputDir: path.join('./reports', 'html-reports'),
            filename: 'report.html',
            reportTitle: 'UI Testing Basic Tests',
            linkScreenshots: true,
            showInBrowser: false,
            useOnAfterCommandForScreenshot: false,
            LOG: log4js.getLogger('default')
        }],
        ['video', {
            saveAllVideos: false,
            videoSlowdownMultiplier: 5,
            videoRenderTimeout: 2,
            outputDir: path.join('./reports', '/videos'),
        }],
    ],

    // Mocha parameters
    mochaOpts: {
        ui: 'bdd',
        timeout: 240000
    },
    // Gets executed before test execution begins
    before: function() {
        // Init custom WDIO commands (ex. AEMLogin)
        Object.keys(commands).forEach(key => {
            browser.addCommand(key, commands[key]);
        });
    },

    // WDIO Hook executed after each test
    afterTest: function() {},

    // Gets executed after each WDIO command
    beforeCommand: async function (commandName) {
        // For WDIO commands which can lead into page navigation
        if (['url', 'refresh', 'click', 'call'].includes(commandName)) {
            // Handle AEM Survey dialog
            if(await $('#omg_surveyContainer').isExisting()) {
                console.log('Detected presence of the AEM Survey Dialog! Refreshing the page to get rid of it.');
                await browser.refresh();
            }
        }
    },
    onPrepare: function (config, capabilities) {
        reportAggregator = new ReportAggregator({
            outputDir: path.join('./reports', 'html-reports'),
            filename: 'master-report.html',
            reportTitle: 'Master Report',
            browserName: capabilities.browserName,
            collapseTests: true,
            LOG: log4js.getLogger('default')
        });
        reportAggregator.clean();
    },
    // eslint-disable-next-line no-unused-vars
    onComplete: async function (exitCode, config, capabilities, results) {
        await reportAggregator.createReport();
    },
};
