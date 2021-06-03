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

    // AEM Login
    beforeEach(() => {
        // Logout/Login
        browser.AEMForceLogout();
        browser.url(config.aem.author.base_url);
        browser.AEMLogin(config.aem.author.username, config.aem.author.password);

    });

    let onboardingHdler;

    before(function() {
        // Enable helper to handle onboarding dialog popup
        onboardingHdler = new commons.OnboardingDialogHandler(browser);
        onboardingHdler.enable();
    });

    after(function() {
        // Disable helper to handle onboarding dialog popup
        onboardingHdler.disable();
    });


    describe('AEM Forms Theme', () => {

        it('Basic Testing of Canvas Theme', () => {
            let themePath = '/content/dam/formsanddocuments-themes/${appId}/canvas-3-0/jcr:content';

            //Open Canvas theme in editing mode
            browser.url(`${config.aem.author.base_url}/editor.html${themePath}`);

            //Verify Selectors list is visible
            expect($(selectors.editor.themeEditor.themeEditorObjSelector).waitForDisplayed()).toBe(true);

            //Switch to content frame and click on first field label
            browser.switchToFrame(0);
            expect($(selectors.content.guideFieldLabelSelector).waitForDisplayed()).toBe(true);
            browser.$(selectors.content.guideFieldLabelSelector).click();

            //Switch to top frame and verify field label overlay visible.
            browser.switchToParentFrame();
            expect($(selectors.editor.overlay.guideFieldLabelOvelaySelector).waitForDisplayed()).toBe(true);

            //Click the overlay and verify style propertysheet is displayed
            browser.$(selectors.editor.overlay.guideFieldLabelOvelaySelector).click();
            expect($(selectors.editor.sidePanel.stylePropertySheetSelector).waitForDisplayed()).toBe(true);

            //Click preview layer button
            expect($(selectors.editor.previewButtonSelector)).toBeDisplayed();
            browser.$(selectors.editor.previewButtonSelector).click();

            //Switch to content frame and verify preview layer mode
            browser.switchToFrame(0);
            expect($(selectors.editor.previewLayerSelector).waitForDisplayed()).toBe(true);

            //Switch back to top frame and click edit layer button
            browser.switchToParentFrame();
            expect($(selectors.editor.currentLayerButtonSelector)).toBeDisplayed();
            browser.$(selectors.editor.currentLayerButtonSelector).click();

            //Switch to content frame and verify edit layer mode
            browser.switchToFrame(0);
            expect($(selectors.editor.editorLayerSelector).waitForExist()).toBe(true);

        });

    });

    describe('AEM Forms Temlplates', () => {
        let templates = [
                {path : '/conf/${appId}/settings/wcm/templates/basic-af', isBlankForm : false},
                {path : '/conf/${appId}/settings/wcm/templates/blank-af', isBlankForm : true}
            ],
            getContainerSelector = (templateContentPath, container) => {
                return `div[data-path="${templateContentPath}/${container}"]`;
            },
            verifyTemplate = (templatePath, isBlankForm) => {
                let templateStructure = templatePath + '/structure/jcr:content',
                    templateInitialContent = templatePath + '/initial/jcr:content',
                    afContainerOverlaySelector = '#OverlayWrapper ' + getContainerSelector(templateInitialContent,'guideContainer'),
                    afContainerOverlaySpanSelector = afContainerOverlaySelector + ' > span';

                //Open template in editing mode
                browser.url(`${config.aem.author.base_url}/editor.html${templatePath}/structure.html`);

                //Verify all three containers are visible
                expect($(getContainerSelector(templateStructure,'parsys1'))).toBeDisplayed();
                expect($(getContainerSelector(templateStructure,'parsys2'))).toBeDisplayed();
                expect($(getContainerSelector(templateStructure,'guideContainer'))).toBeDisplayed();

                //Switch to initial content layer
                $(selectors.editor.layerSwitcher).click();
                expect($(selectors.editor.layerSelector.initial).waitForDisplayed()).toBe(true);
                $(selectors.editor.layerSelector.initial).click();

                //Click on specific area of AF container overlay and verify toolbar
                expect($(afContainerOverlaySelector).waitForDisplayed()).toBe(true);
                browser.execute('$(\'' + `${afContainerOverlaySelector}` + '\').focus()');
                expect($(afContainerOverlaySpanSelector).waitForDisplayed()).toBe(true);
                $(afContainerOverlaySpanSelector).click();

                //In toolbar, click on configure button and verify properties container
                expect($(selectors.editor.editToolBar.configure).waitForDisplayed()).toBe(true);
                $(selectors.editor.editToolBar.configure).click();
                expect($(selectors.editor.sidePanel.afPropertiesContainer).waitForDisplayed()).toBe(true);

                //Switching back to Structure layer
                $(selectors.editor.layerSwitcher).click();
                expect($(selectors.editor.layerSelector.structure).waitForDisplayed()).toBe(true);
                $(selectors.editor.layerSelector.structure).click();

                //Preview the template using url and verify AF field presence in the form
                browser.url(`${config.aem.author.base_url}/${templatePath}/initial.html?wcmmode=preview`);
                expect($(selectors.content.genericAFField).waitForDisplayed({ reverse: isBlankForm })).toBe(true);
            };

        templates.forEach(function (template) {
            it('Basic Testing of Template '+ template.path , () => {
                verifyTemplate(template.path, template.isBlankForm);
            });
        });

    });

});