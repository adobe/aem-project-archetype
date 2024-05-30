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


import commons from '../../lib/commons.js';
import { aem } from '../../lib/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


describe('AEM Assets', () => {

    // AEM Login
    beforeEach(async () => {
        await browser.AEMForceLogout();
        await browser.url(aem.author.base_url);
        await browser.AEMLogin(aem.author.username, aem.author.password);
    });

    let onboardingHandler;

    before(function() {
        // Enable helper to handle onboarding dialog popup
        onboardingHandler = new commons.OnboardingDialogHandler(browser);
        onboardingHandler.enable();
    });

    after(function() {
        // Disable helper to handle onboarding dialog popup
        onboardingHandler.disable();
    });

    it.skip('should be possible to upload an asset', async () => {
        let assetsPath = '/content/dam';
        let imageName = 'image.png';
        let imagePath = `${assetsPath}/${imageName}`;

        // Go to the Assets page.
        await browser.url(`${aem.author.base_url}/assets.html${assetsPath}`);

        // Compute the handle for the asset.
        let handle = await browser.getFileHandleForUpload(path.join(__dirname, '..', '..', 'assets', imageName));

        // Required when AEM language is not "English"
        await browser.refresh();

        // Add the handle to the web page element.
        await $('dam-chunkfileupload > input').addValue(handle);

        // Wait two seconds for the upload dialog to be interactive.
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(2000);

        // Press the upload button.
        await $('coral-dialog.is-open coral-dialog-footer [variant="primary"]').click();

        // Wait until Asset exists
        await browser.waitUntil(async function() {
            return await browser.AEMPathExists(browser.options.baseUrl, imagePath);
        },
        {timeoutMsg: `asset ${imagePath} should exist`}
        );

        // Delete Asset
        await browser.AEMDeleteAsset(imagePath);

        // Wait until Asset does not exist anymore
        await browser.waitUntil(function() {
            return true !== browser.AEMPathExists(aem.author.base_url, imagePath);
        },
        {timeout: 3000, timeoutMsg: `asset ${imagePath} should not exist`}
        );
    });

});
