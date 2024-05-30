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
import { aem } from '../../lib/config.js';
import { expect } from 'chai';
import url from 'url';


describe('AEM Login Page', () => {

    // Force AEM Logout
    beforeEach(async () => {
        await browser.AEMForceLogout();
    });

    it('should redirect to login page by default', async () => {
        await browser.url(aem.author.base_url);
        let redirectedURL = url.parse( await browser.getUrl());
        expect(redirectedURL.pathname.endsWith('login.html')).to.be.true;
    });

    it('should contain the login form', async () => {
        browser.url(aem.author.base_url);

        await $('#username').waitForExist();
        await $('#password').waitForExist();
        await $('form [type="submit"]').waitForExist();
    });

    it('should login with correct credentials', async () => {
        await browser.url(aem.author.base_url);

        await browser.AEMLogin(aem.author.username, aem.author.password);

        await $('coral-shell').waitForExist({ timeout: 6000 });
        await $('coral-shell-header').waitForExist({ timeout: 6000 });
    });

});
