// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('AEMLogin', function (){
    cy.visit('/')
    if (Cypress.config().baseUrl.includes('adobeaemcloud.com')) {
        cy.get('#coral-id-0').click()
    }
    cy.get('#login').should('have.attr', 'action', '/libs/granite/core/content/login.html/j_security_check')
    cy.get('#username').type(Cypress.env('AEM_AUTHOR_USERNAME'))
    cy.get('#password').type(Cypress.env('AEM_AUTHOR_PASSWORD'), { log: false })
    cy.get('#submit-button').click()
    cy.get('coral-shell-content')
})
