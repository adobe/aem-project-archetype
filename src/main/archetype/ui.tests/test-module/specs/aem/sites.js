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
const path = require('path');
const config = require('../../lib/config');
const commons = require('../../lib/commons');
const { expect } = require('chai');

const AEM_SAMPLE_PAGE_PARENT = '/content/${appId}/us';
const AEM_SAMPLE_PAGE_ID = 'en';

describe('AEM Sites Console', () => {

    // AEM Login
    beforeEach(() => {
        // Logout/Login dance
        browser.AEMForceLogout();
        browser.url(config.aem.author.base_url);
        browser.AEMLogin(config.aem.author.username, config.aem.author.password);

        // Setup browser state
        browser.AEMSitesSetView(commons.AEMSitesViewTypes.LIST);
    });

    let onboardingHdler;

    before(function() {
        // Enable helper to handle onboarding dialog popup
        onboardingHdler = new commons.OnboardingDialogHandler(browser);
        onboardingHdler.enable();
    });

    after(function() {
        // Disable helper to handle onboarding dialog popup
        onboardingHdler.disable();
    });


    describe('Page Properties form', () => {
        let originalTitle = '';

        it('should let user modify the title of a page', () => {
            let modifiedTitle = `modified-title-${Date.now()}`;

            // Change page title
            originalTitle = browser.AEMSitesSetPageTitle(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID, modifiedTitle);

            // Navigate to modified page
            browser.url(`${path.posix.join(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID)}.html`);

            // Assert title is the modified one
            expect(browser.getTitle()).to.equal(modifiedTitle);
        });

        after('Reset page title', () => {
            // Reset page title
            browser.AEMSitesSetPageTitle(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID, originalTitle);

            // Navigate to page
            browser.url(`${path.posix.join(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID)}.html`);

            // Assert title is the original one
            expect(browser.getTitle()).to.equal(originalTitle);
        });

    });

});