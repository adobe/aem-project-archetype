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
const path = require('path');
const url = require('url');

// Environment Variables sent by EaaS
// Selenium Endpoint
let selenium_base_url = process.env.SELENIUM_BASE_URL || 'http://localhost:4444';
// Browser
let browser = process.env.SELENIUM_BROWSER || 'chrome';
// Results Reports
let reports_path = process.env.REPORTS_PATH || './reports/';
// AEM Author
let aem_author_basel_url = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
let aem_author_username  = process.env.AEM_AUTHOR_USERNAME || 'admin';
let aem_author_password  = process.env.AEM_AUTHOR_PASSWORD || 'admin';
// AEM Publish
let aem_publish_basel_url = process.env.AEM_PUBLISH_URL || 'http://localhost:4503';
let aem_publish_username  = process.env.AEM_PUBLISH_USERNAME || 'admin';
let aem_publish_password  = process.env.AEM_PUBLISH_PASSWORD || 'admin';

module.exports = {
    selenium: {
        base_url: selenium_base_url,
        hostname: url.parse(selenium_base_url).hostname,
        port: parseInt(url.parse(selenium_base_url).port),
        browser: browser,
    },
    aem: {
        author: {
            base_url: aem_author_basel_url,
            username: aem_author_username,
            password: aem_author_password,
        },
        publish: {
            base_url: aem_publish_basel_url,
            username: aem_publish_username,
            password: aem_publish_password,
        }
    },
    reports_path: reports_path,
    screenshots_path: path.join(reports_path, 'html/screenshots/'),
};
