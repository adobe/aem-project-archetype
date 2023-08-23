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

    it('should be possible to upload an asset', () => {
        const assetsPath = '/content/dam';
        const imageName = 'image.png';
        const imagePath = `${assetsPath}/${imageName}`;

        // Go to the Assets page.
        cy.visit(`${Cypress.env('AEM_AUTHOR_URL')}/assets.html${assetsPath}`);

        // Add the file handle to the upload form
        const localPath = `assets/${imageName}`;
        cy.get('dam-chunkfileupload.dam-ChunkFileUpload > input').first().selectFile(localPath, {force: true})

        // Press the upload button.
        cy.get('coral-dialog.is-open coral-dialog-footer [variant="primary"]').click();

        // Wait until Asset exists
        cy.waitUntil(() => cy.AEMPathExists(Cypress.env('AEM_AUTHOR_URL'), imagePath), {
            errorMsg: `asset ${imagePath} should exist`,
            timeout: 10000,
            interval: 500
        });

        // Wait before deletion as immediate deletion may fail
        cy.wait(1000)

        // Delete Asset
        cy.AEMDeleteAsset(imagePath);

        // Wait until Asset does not exist anymore
        cy.waitUntil(() => cy.AEMPathExists(Cypress.env('AEM_AUTHOR_URL'), imagePath).then(result => !result), {
            errorMsg: `asset ${imagePath} should not exist`,
            timeout: 10000,
            interval: 500
        });
    });
})