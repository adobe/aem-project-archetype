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

describe('AEM Forms Reference Artifacts', () => {

    let onboardingHdler,
        testName,
        consoleErrors = [];

    // AEM Login
    beforeEach(() => {
        // Logout/Login
        browser.AEMForceLogout();
        browser.url(config.aem.author.base_url);
        browser.AEMLogin(config.aem.author.username, config.aem.author.password);
        consoleErrors = commons.trackConsoleErrors(browser);
    });

    afterEach(() => {
        //Print console error logs for diagnosis in case test fails before console log verification steps
        console.log('Console error logs during test execution of [' + testName + '] : \n' + consoleErrors);
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

    describe('AEM Forms Theme E2E', () => {
        it('E2E Testing of Canvas 3.0 Theme', function () {
            testName = this.test.parent.title + '.' + this.test.title;
            let themePath = '/content/dam/formsanddocuments-themes/${appId}/canvas-3-0/jcr:content',
                failedRules = [],
                verifyCSS = function (selectors, cssProperty, expectedCSSValue) {
                    let selectorList = selectors.split(',');
                    selectorList.forEach(selector => {
                        let actualCSSValue = $(selector).getCSSProperty(cssProperty).value;
                        if ( actualCSSValue !== expectedCSSValue) {
                            failedRules.push('Verification failed for selector ' + selector + ' and style rule ' + cssProperty + ' [Expected : ' + expectedCSSValue + ' but ' + 'Received : ' + actualCSSValue + ']');
                        }
                    });
                };

            //Open Canvas theme in editing mode
            browser.url(`${config.aem.author.base_url}/editor.html${themePath}`);

            //Verify no console error present in edit mode so far
            expect(consoleErrors).toHaveLength(0);

            //Preview theme
            browser.url(`${config.aem.author.base_url}/${themePath}?wcmmode=disabled`);

            let ruleJson = fs.readFileSync(path.resolve(__dirname, '../../rules/canvas-3.0-theme-rules.json'));
            let rules = JSON.parse(ruleJson);

            for (let selectors in rules.cssRules) {
                let selectorRules = rules.cssRules[selectors];
                for (let cssProperty in selectorRules ) {
                    verifyCSS(selectors, cssProperty, selectorRules[cssProperty] );
                }
            }
            //Print all error messages for all the failed rules
            for (let failedRule of failedRules) {
                console.error(failedRule);
            }
            expect(failedRules).toHaveLength(0);
            //Verify console errors for preview mode
            expect(consoleErrors).toHaveLength(0);

        });

    });

    describe('AEM Forms Templates E2E Testing', () => {
        let templates = [
                {path : '/conf/${appId}/settings/wcm/templates/basic-af', isBlankForm : false, verificationRuleFilePath : '../../rules/template-rules.json'},
                {path : '/conf/${appId}/settings/wcm/templates/blank-af', isBlankForm : true}
            ],
            tabbedLayoutCount = 0,
            tabNavigatorSelector = '.tab-navigators-vertical',
            getContainerSelector = (templateContentPath, container) => {
                return `div[data-path="${templateContentPath}/${container}"]`;
            },
            getVisibleFieldCount = function () {
                var fields = browser.$$('.tab-pane.active ' + selectors.content.genericAFField);
                let count = 0;
                for (let field of fields){
                    if(field.isDisplayed()){
                        count++;
                    }
                }
                return count;
            },
            verifyTabbedPanelContent = function (panel) {
                if (panel.layout === 'tabsLeft' ) {
                    tabbedLayoutCount++;
                    let tabbedLayoutLevel = tabbedLayoutCount,
                        items = panel.items;
                    if (items instanceof Array ) {
                        //Verify No. of tabs
                        expect(browser.$$(tabNavigatorSelector + ':nth-child(' + tabbedLayoutCount + ')>li')).toHaveLength(items.length);
                        for (let i = 0; i < items.length; i++ ) {
                            let childPanel = items[i];
                            if (childPanel.layout === 'Responsive' && !(childPanel.items instanceof Array)) {
                                //Navigate through all the panels by clicking navigator tab
                                browser.$$(tabNavigatorSelector + ':nth-child(' + tabbedLayoutLevel + ')>li')[[i]].waitForClickable();
                                browser.$$(tabNavigatorSelector + ':nth-child(' + tabbedLayoutLevel + ')>li')[[i]].click();
                                //Verify field count for each panel
                                expect(getVisibleFieldCount()).toBe(childPanel.items.count);
                            } else {
                                verifyTabbedPanelContent(items[i]);
                            }
                        }
                    }
                }

                //Verify total number of tabbed Layout in the form
                expect(browser.$$(tabNavigatorSelector)).toHaveLength(tabbedLayoutCount);

            },
            verifyTemplate = (templatePath, isBlankForm, verificationRuleFilePath) => {
                let templateStructure = templatePath + '/structure/jcr:content',
                    templateInitialContent = templatePath + '/initial/jcr:content',
                    afContainerOverlaySelector = '#OverlayWrapper ' + getContainerSelector(templateInitialContent,'guideContainer');

                //Open template in editing mode
                browser.url(`${config.aem.author.base_url}/editor.html${templatePath}/structure.html`);

                //First open structure layer
                $(selectors.editor.layerSwitcher).waitForClickable();
                $(selectors.editor.layerSwitcher).click();
                $(selectors.editor.layerSelector.structure).waitForClickable();
                $(selectors.editor.layerSelector.structure).click();

                //Content Verification - Verify all three containers are visible in structure
                expect($(getContainerSelector(templateStructure,'parsys1'))).toBeDisplayed();
                expect($(getContainerSelector(templateStructure,'parsys2'))).toBeDisplayed();
                expect($(getContainerSelector(templateStructure,'guideContainer'))).toBeDisplayed();

                //Content Verification - Verify Applied Policy
                $(getContainerSelector(templateStructure,'guideContainer')).waitForClickable();
                $(getContainerSelector(templateStructure,'guideContainer')).click();
                $(selectors.editor.templateEditor.structureLayer.policyButton).waitForClickable();
                $(selectors.editor.templateEditor.structureLayer.policyButton).click();
                expect($(selectors.editor.templateEditor.structureLayer.policyPage.allowedComponent.adaptiveFormGroup + '[checked]').waitForDisplayed()).toBe(true);
                $(selectors.editor.templateEditor.structureLayer.policyPage.cancel).waitForClickable();
                $(selectors.editor.templateEditor.structureLayer.policyPage.cancel).click();

                //Switch to initial content layer to just check any console error in edit layer
                $(selectors.editor.layerSwitcher).waitForClickable();
                $(selectors.editor.layerSwitcher).click();
                $(selectors.editor.layerSelector.initial).waitForClickable();
                $(selectors.editor.layerSelector.initial).click();
                expect($(afContainerOverlaySelector).waitForDisplayed()).toBe(true);

                //Verify no console error present in structure and initial content layer
                expect(consoleErrors).toHaveLength(0);

                //Preview the template using url and verify no. of AF field presence in the form/panel
                browser.url(`${config.aem.author.base_url}/${templatePath}/initial.html?wcmmode=preview`);
                if(isBlankForm) {
                    //For blank template, there should be no AF field present
                    expect($(selectors.content.genericAFField).waitForDisplayed({ reverse : isBlankForm })).toBe(true);
                }else {
                    //Load the verification rule and validate content
                    let ruleJson = fs.readFileSync(path.resolve(__dirname, verificationRuleFilePath));
                    let rules = JSON.parse(ruleJson);
                    tabbedLayoutCount = 0;
                    verifyTabbedPanelContent(rules.template.content.formContainer.rootPanel);
                }

                //Verify no console error present in preview mode
                expect(consoleErrors).toHaveLength(0);
            };

        templates.forEach(function (template) {
            it('E2E Testing of Template '+ template.path , function () {
                testName = this.test.parent.title + '.' + this.test.title;
                verifyTemplate(template.path, template.isBlankForm, template.verificationRuleFilePath);
            });
        });

    });

});