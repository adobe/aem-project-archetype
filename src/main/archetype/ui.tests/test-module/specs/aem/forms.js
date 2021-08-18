/*
 *  Copyright 2021 Adobe Systems Incorporated
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
const commons = require('../../lib/commons');
const selectors = require('../../lib/util/forms.selectors.js');
const fs = require('fs');
const path = require('path');
/*
    E2E UI Testing of AEM Forms OOTB Sample Content included in archetype ui.content package.
*/
describe('AEM Forms OOTB Content Tests', () => {

    let onboardingHdler;

    // AEM Login
    beforeEach(() => {
        // Logout/Login
        browser.AEMForceLogout();
        browser.url(config.aem.author.base_url);
        browser.AEMLogin(config.aem.author.username, config.aem.author.password);
    });

    before(function() {
        // Enable helper to handle onboarding dialog popup
        onboardingHdler = new commons.OnboardingDialogHandler(browser);
        onboardingHdler.enable();
    });

    after(function() {
        // Disable helper to handle onboarding dialog popup
        onboardingHdler.disable();
    });

    describe('AEM Forms Templates E2E Testing', () => {
        let templates = [
                {path : '/conf/${appId}/settings/wcm/templates/basic-af', isBlankForm : false, verificationRuleFilePath : '../../rules/template-rules.json'},
                {path : '/conf/${appId}/settings/wcm/templates/blank-af', isBlankForm : true}
            ],
            tabbedLayoutCount = 0,
            tabNavigatorSelector = '.tab-navigators-vertical',
            getVisibleFieldCount = function (fieldSelector) {
                var fields = browser.$$('.tab-pane.active ' + fieldSelector);
                let count = 0;
                for (let field of fields){
                    if(field.isDisplayed()){
                        count++;
                    }
                }
                return count;
            },
            verifyPanelContent = function (panel) {
                if (panel && panel.layout === 'tabsOnLeft' ) {
                    tabbedLayoutCount++;
                    let tabbedLayoutNestingLevel = tabbedLayoutCount,
                        items = panel.items;
                    if (items instanceof Array ) {
                        //Verify No. of tabs in the navigator for this particular panel
                        expect(browser.$$(tabNavigatorSelector + ':nth-child(' + tabbedLayoutCount + ')>li')).toHaveLength(items.length);
                        for (let i = 0; i < items.length; i++ ) {
                            let childPanel = items[i].panel,
                                afFieldTypes = selectors.content.afFieldTypes,
                                visibleFieldCount = 0;
                            if (!childPanel.items) {
                                //Navigate through all the panels by clicking navigator tab
                                browser.$$(tabNavigatorSelector + ':nth-child(' + tabbedLayoutNestingLevel + ')>li')[i].waitForClickable();
                                browser.$$(tabNavigatorSelector + ':nth-child(' + tabbedLayoutNestingLevel + ')>li')[i].click();
                                //Verify count of AF field, image and table etc for each panel
                                for (let key in afFieldTypes){
                                    visibleFieldCount = visibleFieldCount + getVisibleFieldCount(afFieldTypes[key]);
                                }
                                expect(visibleFieldCount).toBe(childPanel.afFieldCount);
                            } else {
                                verifyPanelContent(childPanel);
                            }
                        }
                    }
                }

                //Verify total number of tabbed Layout in the form
                expect(browser.$$(tabNavigatorSelector)).toHaveLength(tabbedLayoutCount);

            },
            verifyTemplate = (templatePath, isBlankForm, verificationRuleFilePath) => {

                //Preview the template using url and verify no. of AF field presence in the form/panel
                browser.url(`${config.aem.author.base_url}/${templatePath}/initial.html?wcmmode=preview`);

                //Content Verification - Verify all three containers are visible in runtime
                expect($('body>.parsys1')).toBeDisplayed();
                expect($('body>.guideContainer')).toBeDisplayed();
                expect($('body>.parsys2')).toBeDisplayed();

                if(isBlankForm) {
                    //For blank template, there should be no AF field present
                    expect($(selectors.content.afFieldTypes.genericAFField).waitForDisplayed({ reverse : isBlankForm })).toBe(true);
                }else {
                    //Load the verification rule and validate content
                    let ruleJson = fs.readFileSync(path.resolve(__dirname, verificationRuleFilePath));
                    let rules = JSON.parse(ruleJson);
                    tabbedLayoutCount = 0;
                    verifyPanelContent(rules.panel);
                }
            };

        templates.forEach(function (template) {
            it('E2E Testing of Template '+ template.path , function () {
                verifyTemplate(template.path, template.isBlankForm, template.verificationRuleFilePath);
            });
        });

    });

});