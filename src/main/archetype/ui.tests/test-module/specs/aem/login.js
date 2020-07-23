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
const config = require('../../lib/config');
const expect = require('chai').expect;
const url = require('url');

describe('AEM Login Page', () => {

    // Force AEM Logout
    beforeEach(() => {
        browser.AEMForceLogout();
    });

    it('should redirect to login page by default', () => {
        browser.url(config.aem.author.base_url);

        let redirectedURL = url.parse(browser.getUrl());

        expect(redirectedURL.pathname.endsWith('login.html')).to.be.true;
    });

    it('should contain the login form', () => {
        browser.url(config.aem.author.base_url);

        $('#username').waitForExist();
        $('#password').waitForExist();
        $('form [type="submit"]').waitForExist();
    });

    it('should login with correct credentials', () => {
        browser.url(config.aem.author.base_url);

        browser.AEMLogin(config.aem.author.username, config.aem.author.password);

        $('coral-shell').waitForExist();
        $('coral-shell-header').waitForExist();
    });

});
