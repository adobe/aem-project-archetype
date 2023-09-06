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

describe('AEM Basic', () => {

    beforeEach(() => {
        // End any existing user session
        cy.AEMForceLogout()
        // Start new one
        cy.visit(Cypress.env('AEM_AUTHOR_URL'))
        cy.AEMLogin(Cypress.env('AEM_AUTHOR_USERNAME'), Cypress.env('AEM_AUTHOR_PASSWORD'))
    })

    it('should be possible to display Solutions panel', () => {
        cy.visit(Cypress.env('AEM_AUTHOR_URL'))

        cy.get('[data-foundation-toggleable-control-src$="solutionswitcher.html"]').click()
        cy.get('coral-shell-menu[aria-label$="solutions"]').should('exist')
    });
})
