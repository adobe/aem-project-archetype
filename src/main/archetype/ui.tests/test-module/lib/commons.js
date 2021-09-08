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
const conf   = require('./config');
const moment = require('moment');
const path   = require('path');
const request = require('request-promise');
const tough = require('tough-cookie');

const AEMSitesViewTypes = Object.freeze({'CARD': 'card', 'COLUMN': 'column', 'LIST': 'list'});

function takeScreenshot(browser, prefix) {
    prefix = prefix == null ? '' : prefix + '-';
    const timestamp = moment().format('YYYYMMDD-HHmmss.SSS');
    const filepath = path.join(conf.screenshots_path, prefix + timestamp + '.png');
    browser.saveScreenshot(filepath);
    process.emit('test:screenshot', filepath);
    return this;
}

function getAuthenticatedRequestOptions(browser) {
    let loginCookies = _getLoginCookies(browser);
    let jar = request.jar();
    let currentUrl = new URL(browser.getUrl());

    loginCookies.forEach(cookie => jar.setCookie(cookie.toString(), currentUrl.origin));

    return {
        jar: jar
    };
}

function _getLoginCookies(browser) {
    let cookies = browser.getCookies();

    // Get login and affinity cookies only
    let loginCookies = cookies.filter(e => ['login-token', 'affinity'].includes(e.name));

    // Throw if mandatory login cookie is not there
    if (!loginCookies.find(element => element.name == 'login-token')) {
        throw new Error('could not get login-token cookie');
    }

    return loginCookies.map(
        c =>
            new tough.Cookie({
                key: c.name,
                value: c.value,
                httpOnly: c.httpOnly,
                secure: false,
                path: c.path
            })
    );
}

class OnboardingDialogHandler {
    constructor(browser) {
        this.browser = browser;
        this.beforeCmdBkp = null;
    }

    enable() {
        this.beforeCmdBkp = this.browser.config.beforeCommand || [];

        this.browser.config.beforeCommand.push(function() {
            if($('coral-overlay[class*="onboarding"]').isDisplayedInViewport()) {
                console.log('User Onboarding Dialog is present, closing it.');
                // console.log(arguments);
                browser.keys('Escape');
                $('coral-overlay[class*="onboarding"]').waitForDisplayed({reverse: true});
            }
        });
    }

    disable() {
        this.browser.config.beforeCommand = this.beforeCmdBkp;
    }
}

module.exports = {
    AEMSitesViewTypes: AEMSitesViewTypes,
    getAuthenticatedRequestOptions: getAuthenticatedRequestOptions,
    takeScreenshot: takeScreenshot,
    OnboardingDialogHandler: OnboardingDialogHandler
};
