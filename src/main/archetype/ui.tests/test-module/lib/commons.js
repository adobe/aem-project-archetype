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
const conf   = require('./config');
const moment = require('moment');
const path   = require('path');

function takeScreenshot(browser) {
    const timestamp = moment().format('YYYYMMDD-HHmmss.SSS');
    const filepath = path.join(conf.screenshots_path, timestamp + '.png');
    browser.saveScreenshot(filepath);
    process.emit('test:screenshot', filepath);
    return this;
}

module.exports = {
    takeScreenshot: takeScreenshot
};
