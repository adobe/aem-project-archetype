/*
 *  Copyright 2023 Adobe Systems Incorporated
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

describe('AEM Assets', () => {

    beforeEach(() => {
        // End any existing user session
        cy.AEMForceLogout()
        // Start new one
        cy.visit(Cypress.env('AEM_AUTHOR_URL'))
        cy.AEMLogin(Cypress.env('AEM_AUTHOR_USERNAME'), Cypress.env('AEM_AUTHOR_PASSWORD'))
    })

    // skip by default if the CDN is not accessible. Remove the .skip to run the test
    it.skip('should be possible to upload an asset', () => {
        const assetsPath = '/content/dam';
        const localImageName = 'image.png';
        const localPath = `assets/${localImageName}`;
        const uuid = () => Cypress._.random(0, 1e6)
        const id = uuid()
        const remoteImageName = `image-${id}.png`;
        const imagePath = `${assetsPath}/${remoteImageName}`;

        // Go to the Assets page.
        cy.visit(`${Cypress.env('AEM_AUTHOR_URL')}/assets.html${assetsPath}`);

        // Wait for any lazy loaded dialogs to appear
        /* eslint-disable cypress/no-unnecessary-waiting */
        cy.wait(3000)


        cy.intercept({url: '/content/dam.completeUpload.json', method: 'POST'}).as('completeupload')

        // Add the file handle to the upload form
        cy.get('dam-chunkfileupload.dam-ChunkFileUpload > input').first().selectFile(localPath, {force: true})

        // rename image
        cy.get('input#dam-asset-upload-rename-input').clear()
        cy.type(remoteImageName, {force: true});

        // Press the upload button.
        cy.get('coral-dialog.is-open coral-dialog-footer [variant="primary"]').click({force: true});

        // Wait for the /content/dam.completeUpload.json POST to complete before polling for the asset
        cy.wait(['@completeupload'], { responseTimeout: 10000 });

        // Wait until Asset exists
        cy.waitUntil(() => cy.AEMPathExists(Cypress.env('AEM_AUTHOR_URL'), imagePath), {
            errorMsg: `asset ${imagePath} should exist`,
            timeout: 15000,
            interval: 1000
        });

        // Wait before deletion as immediate deletion may fail
        /* eslint-disable cypress/no-unnecessary-waiting */
        cy.wait(3000)

        // Delete Asset
        cy.AEMDeleteAsset(imagePath);

        // Wait until Asset does not exist anymore
        cy.waitUntil(() => cy.AEMPathExists(Cypress.env('AEM_AUTHOR_URL'), imagePath).then(result => !result), {
            errorMsg: `asset ${imagePath} should not exist`,
            timeout: 15000,
            interval: 1000
        });
    });
})