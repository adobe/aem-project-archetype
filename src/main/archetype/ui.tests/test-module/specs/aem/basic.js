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

#if ( $aemVersion != "cloud" )
        $('coral-shell-solutionswitcher').waitForDisplayed();
#else
        $('coral-shell-menu[aria-label$="solutions"]').waitForDisplayed();
#end
    });

});
