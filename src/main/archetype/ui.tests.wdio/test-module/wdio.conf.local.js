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

/**
 * DO NOT MODIFY
 */
import {PixelMatchPlugin} from './lib/wdio-pixelmatch-service/launcher.js';

import { config as wdio_config } from './wdio.conf.commons.js';
import { CHROME } from './lib/config.js';
import { FIREFOX } from './lib/config.js';
import { selenium } from './lib/config.js';
import { reports_path } from './lib/config.js';

wdio_config.hostname = 'localhost';
wdio_config.services = [
    ['selenium-standalone', {
        logPath: reports_path}
    ],
    [PixelMatchPlugin, {
        viewportSize: { height: 768, width: 1366 },
        pixelmatchDirectory: './assets'
    }]
];

// Define capabilities based on configuration
let capabilities = {};

switch(selenium.browser) {
case CHROME:
    capabilities = {
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            'excludeSwitches': ['enable-automation'],
            'prefs': {
                'credentials_enable_service': false,
                'profile.password_manager_enabled': false
            }
        }
    };
    if (selenium.headless === true) {
        capabilities['goog:chromeOptions'].args = ['headless'];
    }
    break;
case FIREFOX:
    capabilities = {
        maxInstances: 1,
        browserName: 'firefox',
        'moz:firefoxOptions': {
            prefs: {
                // Prevent opening the extension tabs on startup
                'extensions.enabledScopes': 0
            }
        }
    };
    if (selenium.headless === true) {
        capabilities['moz:firefoxOptions'].args = ['-headless'];
    }
    break;
default:
    throw new Error('Unsupported browser defined in configuration!');
}

wdio_config.capabilities = [capabilities];
export const config = wdio_config;
