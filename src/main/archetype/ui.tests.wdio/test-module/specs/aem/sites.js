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
import chai from 'chai';
const expect = chai.expect;


const AEM_SAMPLE_PAGE_PARENT = '/content/${appId}/${country}';
const AEM_SAMPLE_PAGE_ID = '${language}';


describe('AEM Sites Console',  () => {

    // AEM Login
    beforeEach(async () => {
        // Logout/Login dance
        await browser.AEMForceLogout();
        await browser.url(aem.author.base_url);
        await browser.AEMLogin(aem.author.username, aem.author.password);
        // Setup browser state
        await browser.AEMSitesSetView(commons.AEMSitesViewTypes.LIST);
    });

    let onboardingHandler = new commons.OnboardingDialogHandler(browser);

    before(' Enable helper to handle onboarding dialog popup',   function() {
        onboardingHandler.enable();
    });

    after( 'Disable helper to handle onboarding dialog popup', function() {
        onboardingHandler.disable();
    });


    describe('Page Properties form', () => {
        let originalTitle = 'original-page-title';

        it('should let user modify the title of a page', async () => {
            let modifiedTitle = `modified-title-${Date.now()}`;

            // Change page title
            originalTitle = await browser.AEMSitesSetPageTitle(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID, modifiedTitle);

            // Navigate to modified page
            await browser.url(`${path.posix.join(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID)}.html`);

            let currentTitle = await browser.getTitle();

            // Assert title is the modified one
            expect(currentTitle).to.equal(modifiedTitle);
        });

        after('Reset page title', async () => {
            await browser.AEMSitesSetPageTitle(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID, originalTitle);

            // Navigate to page
            await browser.url(`${path.posix.join(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID)}.html`);

            // Assert title is the original one
            let currentTitle = await browser.getTitle();
            expect(currentTitle).to.equal(originalTitle);
        });
    });
});
