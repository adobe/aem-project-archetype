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

describe('AEM Login Page', () => {

    beforeEach(() => {
        cy.AEMForceLogout()
    })

    it('should redirect to login page by default', () => {
        cy.visit(Cypress.env('AEM_AUTHOR_URL'))

        cy.url().should('match', /login.html/)
    });

    it('should contain the login form', () => {
        cy.visit(Cypress.env('AEM_AUTHOR_URL'))

        cy.get('#username').should('exist')
        cy.get('#password').should('exist')
        cy.get('form [type="submit"]').should('exist')
    });

    it('should login with correct credentials', () => {
        cy.visit(Cypress.env('AEM_AUTHOR_URL'))

        cy.AEMLogin(Cypress.env('AEM_AUTHOR_USERNAME'), Cypress.env('AEM_AUTHOR_PASSWORD'))

        cy.get('coral-shell', { timeout: 6000 }).should('exist')
        cy.get('coral-shell-header', { timeout: 6000 }).should('exist')
    });
})