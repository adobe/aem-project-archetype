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
import {screenshots_path} from './config.js';

import moment from 'moment';
import path from 'path';
import { CookieJar, Cookie }  from 'tough-cookie';

const AEMSitesViewTypes = Object.freeze({'CARD': 'card', 'COLUMN': 'column', 'LIST': 'list'});

function takeScreenshot(browser, prefix) {
    prefix = prefix == null ? '' : prefix + '-';
    const timestamp = moment().format('YYYYMMDD-HHmmss.SSS');
    const filepath = path.join(screenshots_path, prefix + timestamp + '.png');
    browser.saveScreenshot(filepath);
    process.emit('test:screenshot', filepath);
    return this;
}

async function getAuthenticatedRequestOptions(browser) {
    let loginCookies = await _getLoginCookies(browser);
    let currentUrl = new URL(await browser.getUrl());
    const jar = new CookieJar();
    loginCookies.forEach(cookie => jar.setCookie(cookie.toString(), currentUrl.origin));
    return jar;
}

async function _getLoginCookies(browser) {
    let cookies = await browser.getCookies();

    // Get login and affinity cookies only
    let loginCookies = cookies.filter(e => ['login-token', 'affinity'].includes(e.name));

    // Throw if mandatory login cookie is not there
    if (!loginCookies.find(element => element.name == 'login-token')) {
        throw new Error('could not get login-token cookie');
    }

    return loginCookies.map(
        c =>
            new Cookie({
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
        this.beforeCmdBkp = this.browser.options.beforeCommand || [];


        this.browser.options.beforeCommand.push( async function() {
            let isDisplayed =  await $('coral-overlay[class*="onboarding"]').isDisplayedInViewport();
            if( isDisplayed) {
                console.log('User Onboarding Dialog is present, closing it.');
                await browser.keys('Escape');
                await $('coral-overlay[class*="onboarding"]').waitForDisplayed({reverse: true});
            }

        });
    }

    disable() {
        this.browser.options.beforeCommand = this.beforeCmdBkp;
    }
}

export default {
    AEMSitesViewTypes: AEMSitesViewTypes,
    getAuthenticatedRequestOptions: getAuthenticatedRequestOptions,
    takeScreenshot: takeScreenshot,
    OnboardingDialogHandler: OnboardingDialogHandler
};
