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


import commons from '../../lib/commons.js';
import { aem } from '../../lib/config.js';
import path from 'path';
import fs from 'fs';
import chai from 'chai';
const chaiExpect = chai.expect;
import { selectors } from '../../lib/util/forms.selectors.js';
import { URL } from 'url';

const __dirname = new URL('.', import.meta.url).pathname;

async function waitUntilPageLoad(timeoutMsg) {
    await browser.waitUntil(async function () {
        const state = await browser.execute(function () {
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
    beforeEach(async () => {
        // Logout/Login
        await browser.AEMForceLogout();
        await browser.url(aem.author.base_url);
        await browser.AEMLogin(aem.author.username, aem.author.password);
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
    describe.skip('DataSource Tests', () => {
        let dataSources = [
                {name : 'salesforce-cloud-config', title : 'Salesforce Cloud Config'},
                {name : 'microsoft-dynamics-365-cloud-config', title : 'Microsoft Dynamics 365 Cloud Config'}
            ],
            basePath = 'mnt/overlay/fd/fdm/gui/components/admin/fdmcloudservice/properties.html',
            confPath = '/conf/${appId}/settings/cloudconfigs/fdm',
            verifyDataSource = async (dataSource) => {
                //Open datasource in editing mode
                await browser.url(`${aem.author.base_url}/${basePath}?item=${confPath}/${dataSource.name}`);

                //Verify title value populated with correct value
                const title = await $(selectors.editor.dataSourceEditor.title);
                await expect(title).toBeDisplayed({wait: 2000, interval: 100, message: 'title not displayed'});
                await expect(await $(selectors.editor.dataSourceEditor.title).getValue()).toEqual(dataSource.title);

                //click authentication settings tab
                await expect(await $(selectors.editor.dataSourceEditor.authenticationTab)).toBeDisplayed();
                await $(selectors.editor.dataSourceEditor.authenticationTab).click();

                //Verify OAuth authentication mechanism selected
                await expect(await $(selectors.editor.dataSourceEditor.authenticationSelector)).toBeDisplayed();
                await expect(await $(selectors.editor.dataSourceEditor.authenticationSelectorInput).getValue()).toEqual('OAuth 2.0');

                //Verify Auth url not empty
                await expect(await $(selectors.editor.dataSourceEditor.oAuthUrl)).toBeDisplayed();
                await expect(await $(selectors.editor.dataSourceEditor.oAuthUrl).getValue()).not.toEqual('');

                //Verify refresh token url not empty
                await expect(await $(selectors.editor.dataSourceEditor.refreshTokenUrl)).toBeDisplayed();
                await expect(await $(selectors.editor.dataSourceEditor.refreshTokenUrl).getValue()).not.toEqual('');

                //Verify access token url not empty
                await expect(await $(selectors.editor.dataSourceEditor.accessTokenUrl)).toBeDisplayed();
                await expect(await $(selectors.editor.dataSourceEditor.accessTokenUrl).getValue()).not.toEqual('');

            };

        dataSources.forEach(function (dataSource) {
            it('Testing Data Source : '+ dataSource.title , async function () {
                await verifyDataSource(dataSource);
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
            verifyformDataModel = async (formDataModel) => {
                //Open form data model in editing mode
                await browser.url(`${aem.author.base_url}/${basePath}/${formDataModel.name}`);

                //Verify title value populated with correct value
                await expect(await $(selectors.editor.fdmEditor.title).waitForDisplayed()).toBe(true);
                await expect(await $(selectors.editor.fdmEditor.title).getText()).toEqual(formDataModel.title);

                //click model tab
                await expect(await $(selectors.editor.fdmEditor.modelTab)).toBeDisplayed();
                await $(selectors.editor.fdmEditor.modelTab).click();

                //Verify Each entity present in model panel
                for(const entity  of formDataModel.entities){
                    await expect(await $(getEntitySelector(entity))).toBeDisplayed();
                }

                //click services tab
                await expect(await $(selectors.editor.fdmEditor.servicesTab)).toBeDisplayed();
                await $(selectors.editor.fdmEditor.servicesTab).click();

                //Verify Each operations present in services panel.
                for(const operation of formDataModel.operations){
                    await expect($(getOperationSelector(operation))).toBeDisplayed();
                }

            };

        formDataModels.forEach(function (formDataModel) {
            it('Testing Form Data Model : '+ formDataModel.title , async function () {
                await verifyformDataModel(formDataModel);
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
            getVisibleFieldCount = async function (fieldSelector) {
                var fields = await browser.$$('.tab-pane.active ' + fieldSelector);
                let count = 0;
                for (let field of fields){
                    if(await field.isDisplayed()){
                        count++;
                    }
                }
                return count;
            },
            verifyPanelContent = async function (panel) {
                if (panel && panel.layout === 'tabsOnLeft' ) {
                    tabbedLayoutCount++;
                    let tabbedLayoutNestingLevel = tabbedLayoutCount,
                        items = panel.items;
                    if (items instanceof Array ) {
                        //Verify No. of tabs in the navigator for this particular panel
                        await expect(await browser.$$(tabNavigatorSelector + ':nth-child(' + tabbedLayoutCount + ')>li')).toHaveLength(items.length);
                        for (let i = 0; i < items.length; i++ ) {
                            let childPanel = items[i].panel,
                                afFieldTypes = selectors.content.afFieldTypes,
                                visibleFieldCount = 0;
                            if (!childPanel.items) {
                                //Navigate through all the panels by clicking navigator tab
                                await browser.$$(tabNavigatorSelector + ':nth-child(' + tabbedLayoutNestingLevel + ')>li')[i].waitForClickable();
                                await browser.$$(tabNavigatorSelector + ':nth-child(' + tabbedLayoutNestingLevel + ')>li')[i].click();
                                //Verify count of AF field, image and table etc for each panel
                                for (let key in afFieldTypes){
                                    let currentVisibleFieldCount = await getVisibleFieldCount(afFieldTypes[key]);
                                    visibleFieldCount = visibleFieldCount + currentVisibleFieldCount;
                                }
                                await expect(visibleFieldCount).toBe(childPanel.afFieldCount);
                            } else {
                                await verifyPanelContent(childPanel);
                            }
                        }
                    }
                }

                //Verify total number of tabbed Layout in the form
                await expect(await browser.$$(tabNavigatorSelector)).toHaveLength(tabbedLayoutCount);

            },
            verifyTemplate = async (templatePath, isBlankForm, verificationRuleFilePath) => {

                //Preview the template using url and verify no. of AF field presence in the form/panel
                await browser.url(`${aem.author.base_url}/${templatePath}/initial.html?wcmmode=preview`);

                //Content Verification - Verify all three containers are visible in runtime
                await expect(await $('body>.parsys1')).toBeDisplayed();
                await expect(await $('body>.guideContainer')).toBeDisplayed();
                await expect(await $('body>.parsys2')).toBeDisplayed();

                if(isBlankForm) {
                    //For blank template, there should be no AF field present
                    await expect(await $(selectors.content.afFieldTypes.genericAFField).waitForDisplayed({ reverse : isBlankForm })).toBe(true);
                }else {
                    //Load the verification rule and validate content
                    let ruleJson = fs.readFileSync(path.resolve(__dirname, verificationRuleFilePath));
                    let rules = JSON.parse(ruleJson);
                    tabbedLayoutCount = 0;
                    await verifyPanelContent(rules.panel);
                }
            };

        templates.forEach(function (template) {
            it('E2E Testing of Template '+ template.path , async function () {
                await verifyTemplate(template.path, template.isBlankForm, template.verificationRuleFilePath);
            });
        });

    });

    describe('Theme testing', () => {
        const getThemePath = (theme) => '/content/dam/formsanddocuments-themes/${appId}/' + theme + '/jcr:content?wcmmode=disabled';
        const themes = ['beryl', 'ultramarine', 'urbane', 'tranquil', 'canvas-3-0'];
        const pixelmatchConfig = { errorThreshold: .3, baseDir: './assets/form/themes' };
        async function verifyThemePanel(theme, panelName) {
            const isMatched = await browser.call(async () => await browser.matchScreenshot(this, panelName, pixelmatchConfig));
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
            it(theme, async function () {
                const verifyPanel = verifyThemePanel.bind(this, theme);
                await browser.url(getThemePath(theme));
                //Wait for the page resources to load
                await waitUntilPageLoad('Instance slow' + theme + ' could not be loaded');
                await verifyPanel('Basic info');
                await $(footer).scrollIntoView();
                await verifyPanel('Basic info Submit');
                await $(header).scrollIntoView();
                await $(panels.address).click();
                await verifyPanel('Address');
                await $(footer).scrollIntoView();
                await verifyPanel('Address Submit');
                await $(header).scrollIntoView();
                await $(panels.employment).click();
                await verifyPanel('Employment');
                await $(footer).scrollIntoView();
                await verifyPanel('Employment Submit');
                await $(header).scrollIntoView();
                await $(panels.expenditure).click();
                await verifyPanel('Expenditure');
                await $(panels.documents).click();
                await verifyPanel('Documents');
                await $(panels.communication).click();
                await verifyPanel('Communication');
                await $(panels.confirmation).click();
                await verifyPanel('Confirmation');
                await $(footer).scrollIntoView();
                await verifyPanel('Confirmation Submit');
            });
        });
    });

});
