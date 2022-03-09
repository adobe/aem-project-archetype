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
const chaiExpect = require('chai').expect;

function waitUntilPageLoad(timeoutMsg) {
    browser.waitUntil(function () {
        const state = browser.execute(function () {
            return document.readyState;// eslint-disable-line
        });
        return state === 'complete';
    },
    {
        timeout: 60000, //60secs
        timeoutMsg: timeoutMsg
    });
}
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

    // Validate rendering of Data Source properties page with partially filled OAuth details.
    describe('DataSource Tests', () => {
        let dataSources = [
                {name : 'salesforce-cloud-config', title : 'Salesforce Cloud Config'},
                {name : 'microsoft-dynamics-365-cloud-config', title : 'Microsoft Dynamics 365 Cloud Config'}
            ],
            basePath = 'mnt/overlay/fd/fdm/gui/components/admin/fdmcloudservice/properties.html',
            confPath = '/conf/${appId}/settings/cloudconfigs/fdm',
            verifyDataSource = (dataSource) => {
                //Open datasource in editing mode
                browser.url(`${config.aem.author.base_url}/${basePath}?item=${confPath}/${dataSource.name}`);

                //Verify title value populated with correct value
                expect($(selectors.editor.dataSourceEditor.title)).toBeDisplayed();
                expect($(selectors.editor.dataSourceEditor.title).getValue()).toEqual(dataSource.title);

                //click authentication settings tab
                expect($(selectors.editor.dataSourceEditor.authenticationTab)).toBeDisplayed();
                $(selectors.editor.dataSourceEditor.authenticationTab).click();

                //Verify OAuth authentication mechanism selected
                expect($(selectors.editor.dataSourceEditor.authenticationSelector)).toBeDisplayed();
                expect($(selectors.editor.dataSourceEditor.authenticationSelectorInput).getValue()).toEqual('OAuth 2.0');

                //Verify Auth url not empty
                expect($(selectors.editor.dataSourceEditor.oAuthUrl)).toBeDisplayed();
                expect($(selectors.editor.dataSourceEditor.oAuthUrl).getValue()).not.toEqual('');

                //Verify refresh token url not empty
                expect($(selectors.editor.dataSourceEditor.refreshTokenUrl)).toBeDisplayed();
                expect($(selectors.editor.dataSourceEditor.refreshTokenUrl).getValue()).not.toEqual('');

                //Verify access token url not empty
                expect($(selectors.editor.dataSourceEditor.accessTokenUrl)).toBeDisplayed();
                expect($(selectors.editor.dataSourceEditor.accessTokenUrl).getValue()).not.toEqual('');

            };

        dataSources.forEach(function (dataSource) {
            it('Testing Data Source : '+ dataSource.title , function () {
                verifyDataSource(dataSource);
            });
        });
    });

    // Validate rendering of FDM in editor mode with already added entity/services.
    describe('Form Data Model Tests', () => {

        let formDataModels = [
                {name : 'salesforce-data-model', title : 'Salesforce Data Model', entities : ['Contact', 'Lead'],
                    operations : ['POST /services/data/v32.0/sobjects/Contact', 'GET /services/data/v32.0/sobjects/Contact/{id}'] },
                {name : 'microsoft-dynamics-365-data-model', title : 'Microsoft Dynamics 365 Data Model', entities : ['contact', 'lead'],
                    operations : ['GET contact /contacts', 'POST contact /contacts', 'DELETE contact /contacts'] }
            ],
            getEntitySelector = (entityName) => {
                return `.fdmEntity[data-id*="${entityName}"]`;
            },
            getOperationSelector = (operationName) => {
                return `.fdmOperation[data-operationid*="${operationName}"]`;
            },
            basePath = 'aem/fdm/editor.html/content/dam/formsanddocuments-fdm/${appId}',
            verifyformDataModel = (formDataModel) => {
                //Open form data model in editing mode
                browser.url(`${config.aem.author.base_url}/${basePath}/${formDataModel.name}`);

                //Verify title value populated with correct value
                expect($(selectors.editor.fdmEditor.title).waitForDisplayed()).toBe(true);
                expect($(selectors.editor.fdmEditor.title).getText()).toEqual(formDataModel.title);

                //click model tab
                expect($(selectors.editor.fdmEditor.modelTab)).toBeDisplayed();
                $(selectors.editor.fdmEditor.modelTab).click();

                //Verify Each entity present in model panel
                formDataModel.entities.forEach(function (entity) {
                    expect($(getEntitySelector(entity))).toBeDisplayed();
                });

                //click services tab
                expect($(selectors.editor.fdmEditor.servicesTab)).toBeDisplayed();
                $(selectors.editor.fdmEditor.servicesTab).click();

                //Verify Each operations present in services panel.
                formDataModel.operations.forEach(function (operation) {
                    expect($(getOperationSelector(operation))).toBeDisplayed();
                });

            };

        formDataModels.forEach(function (formDataModel) {
            it('Testing Form Data Model : '+ formDataModel.title , function () {
                verifyformDataModel(formDataModel);
            });
        });
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

    describe('Theme testing', () => {
        const getThemePath = (theme) => '/content/dam/formsanddocuments-themes/${appId}/' + theme + '/jcr:content?wcmmode=disabled';
        const themes = ['beryl', 'ultramarine', 'urbane', 'tranquil', 'canvas-3-0'];
        const pixelmatchConfig = { errorThreshold: .3, baseDir: './assets/form/themes' };
        function verifyThemePanel(theme, panelName) {
            const isMatched = browser.call(() => browser.matchScreenshot(this, panelName, pixelmatchConfig));
            chaiExpect(isMatched, `${theme} ${panelName} panel screenshot did not match`).true;
        }
        const panels = {
            address: '#guideContainer-rootPanel-basics-basics2___guide-item-nav',
            employment: '#guideContainer-rootPanel-basics-employment___guide-item-nav',
            expenditure: '#guideContainer-rootPanel-expenditure___guide-item-nav',
            documents: '#guideContainer-rootPanel___guide-item-nav-container > li[title="Documents"]',
            communication: '#guideContainer-rootPanel-communication___guide-item-nav',
            confirmation: '#guideContainer-rootPanel___guide-item-nav-container > li[title="Confirmation"]'
        };
        const footer = '.guidefooter';
        const header = '.guideheader';
        themes.forEach((theme) => {
            //For each theme take screenshot of all the panels
            //For those panels whose content does not fit in single screenshot take two screenshots
            it(theme, function () {
                const verifyPanel = verifyThemePanel.bind(this, theme);
                browser.url(getThemePath(theme));
                //Wait for the page resources to load
                waitUntilPageLoad('Instance slow' + theme + ' could not be loaded');
                verifyPanel('Basic info');
                $(footer).scrollIntoView();
                verifyPanel('Basic info Submit');
                $(header).scrollIntoView();
                $(panels.address).click();
                verifyPanel('Address');
                $(footer).scrollIntoView();
                verifyPanel('Address Submit');
                $(header).scrollIntoView();
                $(panels.employment).click();
                verifyPanel('Employment');
                $(footer).scrollIntoView();
                verifyPanel('Employment Submit');
                $(header).scrollIntoView();
                $(panels.expenditure).click();
                verifyPanel('Expenditure');
                $(panels.documents).click();
                verifyPanel('Documents');
                $(panels.communication).click();
                verifyPanel('Communication');
                $(panels.confirmation).click();
                verifyPanel('Confirmation');
                $(footer).scrollIntoView();
                verifyPanel('Confirmation Submit');
            });
        });
    });

});