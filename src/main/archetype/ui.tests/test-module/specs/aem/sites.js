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


const AEM_SITES_PATH = '/sites.html';
const AEM_SAMPLE_PAGE_PARENT = '/content/${appId}/us';
const AEM_SAMPLE_PAGE_ID = 'en';

describe('AEM Sites', () => {

    // AEM Login
    beforeEach(() => {
        // Logout/Login dance
        browser.AEMForceLogout();
        browser.url(config.aem.author.base_url);
        browser.AEMLogin(config.aem.author.username, config.aem.author.password);

        // Setup browser state
        browser.url(AEM_SITES_PATH);
        browser.AEMSitesSetView(commons.AEMSitesViewTypes.LIST);
    });

    it('should be possible to modify the title of a page', () => {
        const modifiedTitle = `modified-title-${Date.now()}`;

        // Navigate to page parent path
        browser.url(path.join(AEM_SITES_PATH, AEM_SAMPLE_PAGE_PARENT));
        // Select sample page in the list
        $(`[data-foundation-collection-item-id="${path.join(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID)}"] [type="checkbox"]`).click();
        // Aaccess page properties form
        $('[data-foundation-collection-action*="properties"]').click();
        // Modify title
        $('[name="./jcr:title"]').setValue(modifiedTitle);
        // Submit
        $('[type="submit"]').click();
        // Navigate to modified page
        browser.url(`${path.join(AEM_SAMPLE_PAGE_PARENT, AEM_SAMPLE_PAGE_ID)}.html`);

        //Assert title is the modified one
        expect(browser.getTitle()).to.equal(modifiedTitle);
    });

});
