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

    describe('AEM Forms DataSource Tests', () => {
        let dataSources = [
                {name : 'salesforce-cloud-service', title : 'Salesforce Cloud Service'},
                {name : 'ms-dynamics-odata-cloud-service', title : 'MS Dynamics OData Cloud Service'}
            ],
            basePath = 'mnt/overlay/fd/fdm/gui/components/admin/fdmcloudservice/properties.html',
            confPath = '/conf/${appId}/settings/cloudconfigs/fdm',
            verifyDataSource = (dataSource) => {
                //Open datasource in editing mode
                browser.url(`${config.aem.author.base_url}/${basePath}?item=${confPath}/${dataSource.name}`);
                //Verify no console error present
                //expect(consoleErrors).toHaveLength(0);

                //Verify title value populated with correct value
                expect($(selectors.editor.dataSourceEditor.title)).toBeDisplayed();
                expect($(selectors.editor.dataSourceEditor.title).getValue()).toEqual(dataSource.title);

                //click authentication settings tab
                expect($(selectors.editor.dataSourceEditor.authenticationTab)).toBeDisplayed();
                $(selectors.editor.dataSourceEditor.authenticationTab).click();

                //Verify no console error present
                //expect(consoleErrors).toHaveLength(0);

                //Verify OAuth authentication mechanism selected
                expect($(selectors.editor.dataSourceEditor.authenticationSelector)).toBeDisplayed();
                expect($(selectors.editor.dataSourceEditor.authenticationSelector).getValue()).toEqual('OAuth 2.0');

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
            it('Testing of Data Source '+ dataSource.title , function () {
                testName = this.test.parent.title + '.' + this.test.title;
                verifyDataSource(dataSource);
            });
        });
    });

    describe('AEM Forms Form Data Model Tests', () => {

        let formDataModels = [
                {name : 'salesforce-fdm', title : 'Salesforce FDM', entities : ['Contact', 'Lead'],
                    operations : ['POST /services/data/v32.0/sobjects/Contact', 'GET /services/data/v32.0/sobjects/Contact/{id}'] },
                {name : 'ms-dynamics-fdm', title : 'Microsoft Dynamics FDM', entities : ['contact', 'lead'],
                    operations : ['GET contact /contacts', 'POST contact /contacts', 'DELETE contact /contacts'] }
            ],
            getEntitySelector = (entityName) => {
                return `div[data-id*="${entityName}"]`;
            },
            getOperationSelector = (operationName) => {
                return `tr[data-operationid*="${operationName}"]`;
            },
            basePath = 'aem/fdm/editor.html/content/dam/formsanddocuments-fdm/${appId}',
            verifyformDataModel = (formDataModel) => {
                //Open form data model in editing mode
                browser.url(`${config.aem.author.base_url}/${basePath}/${formDataModel.name}`);
                //Verify no console error present
                //expect(consoleErrors).toHaveLength(0);

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

                //Verify no console error present
                //expect(consoleErrors).toHaveLength(0);

                //Verify Each operations present in services panel.
                formDataModel.operations.forEach(function (operation) {
                    expect($(getOperationSelector(operation))).toBeDisplayed();
                });

            };

        formDataModels.forEach(function (formDataModel) {
            it('Testing of Form Data Model '+ formDataModel.title , function () {
                testName = this.test.parent.title + '.' + this.test.title;
                verifyformDataModel(formDataModel);
            });
        });

    });

});