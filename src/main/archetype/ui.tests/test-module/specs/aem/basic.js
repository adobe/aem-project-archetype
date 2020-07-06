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
const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const config = require('../../lib/config');

// Init custom WDIO commands (ex. AEMLogin)
require('../../lib/wdio.commands').init(browser);

function fileHandleBySharedFolder(sharedFolderPath, filePath) {
    const sharedFilePath = path.join(sharedFolderPath, path.basename(filePath));
    fs.copyFileSync(filePath, sharedFilePath);
    return sharedFilePath;
}

function fileHandleByUploadUrl(uploadUrl, filePath) {
    return request.post(uploadUrl, {
        formData: {
            data: {
                value: fs.createReadStream(filePath),
                options: {
                    filename: path.basename(filePath)
                }
            },
        },
    });
}

async function fileHandle(filePath) {
    if (process.env.UPLOAD_URL) {
        return fileHandleByUploadUrl(process.env.UPLOAD_URL, filePath);
    }
    if (process.env.SHARED_FOLDER) {
        return fileHandleBySharedFolder(process.env.SHARED_FOLDER, filePath);
    }
    return filePath;
}

describe('AEM Basic', () => {

    // AEM Login
    beforeEach(() => {
        browser.AEMForceLogout();
        browser.url(config.aem.author.base_url);
        browser.AEMLogin(config.aem.author.username, config.aem.author.password);
    });

    it('should be possible to display Solutions panel', () => {
        browser.url(config.aem.author.base_url);

        $('[data-foundation-toggleable-control-src$="solutionswitcher.html"]').click();

        $('coral-shell-solutionswitcher').waitForDisplayed(10000);
    });

    it('should be possible to upload an asset', () => {
        // Go to the Assets page.
        browser.url(`${config.aem.author.base_url}/assets.html/content/dam`);

        // Compute the handle for the asset.
        const handle = browser.call(() => {
            return fileHandle(path.join(__dirname, '..', '..', 'assets', 'image.png'));
        });

        // Add the handle to the web page element.
        $('dam-chunkfileupload > input').addValue(handle);

        // Wait two seconds for the upload dialog to be interactive.
        browser.pause(2000);

        // Press the upload button.
        $('coral-dialog.is-open coral-dialog-footer [variant="primary"]').click();
    });

});
