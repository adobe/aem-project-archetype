/*
 *  Copyright 2021 Adobe Systems Incorporated
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
const SCREENSHOTTYPES = {
    BASE: 'base',
    CURR: 'current',
    DIFF: 'diff'
};
class PathUtils {
    constructor(baseDirectory) {
        this.baseDirectory = baseDirectory || './assets';
    }
    getScreenshotDirectory(context, baseDir) {
        return path.join(baseDir ? baseDir : this.baseDirectory, context.test.title, browser.capabilities.platformName, browser.capabilities.browserName);
    }
    getScreenshotPath(viewportSize, screenshotName, type, baseDir) {
        return path.join(baseDir, `${screenshotName} ${viewportSize.width}x${viewportSize.height}-${type}.png`);
    }
}
module.exports = { PathUtils, SCREENSHOTTYPES };