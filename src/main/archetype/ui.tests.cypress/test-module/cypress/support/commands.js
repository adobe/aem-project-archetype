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

Cypress.Commands.add('AEMForceLogout', function () {
    cy.visit('/')

    cy.title().then(title => {
        if (!title || !title.includes('AEM Sign In')) {
            cy.visit('/system/sling/logout.html')
        }
    })

    cy.get('form[name="login"]', {timeout: 3000}).should('exist')
})

Cypress.Commands.add('AEMLogin', function (username, password) {
    if (Cypress.config().baseUrl.includes('adobeaemcloud.com') || Cypress.config().baseUrl.includes('adobeaemcloud.net')) {
        cy.get('#coral-id-0').click()
    }

    cy.get('#login').should('have.attr', 'action', '/libs/granite/core/content/login.html/j_security_check')

    cy.get('#username').type(username)
    cy.get('#password').type(password, { log: false, parseSpecialCharSequences: false })

    cy.get('#submit-button').click()
    cy.get('coral-shell-content', {timeout: 5000}).should('exist')
})

Cypress.Commands.add('AEMPathExists', function (baseUrl, path) {
    const url = new URL(path, baseUrl)

    console.log('COMMAND CALLED - START')

    return cy.request({
        url: url.href,
        failOnStatusCode: false,
    })
        .then(response => {
            return (response.status === 200)
        });
})

Cypress.Commands.add('AEMDeleteAsset', function (assetPath) {
    const tokenUrl = new URL('/libs/granite/csrf/token.json', Cypress.env('AEM_AUTHOR_URL'))
    let csrfToken;

    cy.request(tokenUrl.href).then((response) => {
        csrfToken = response.body.token

        const form = new FormData();
        form.append('cmd', 'deletePage');
        form.append('path', assetPath);
        form.append('force', 'true');
        form.append('_charset_', 'utf-8');

        const body = {
            cmd: 'deletePage',
            path: assetPath,
            force: true,
            "_charset_": 'utf-8',
        }

        const url = new URL('/bin/wcmcommand', Cypress.env('AEM_AUTHOR_URL'))

        const referrerUrl = new URL(assetPath, Cypress.env('AEM_AUTHOR_URL'))

        // application/x-www-form-urlencoded; charset=UTF-8

        cy.request({
            url: url.href,
            method: 'POST',
            headers: {
                'CSRF-Token': csrfToken,
                Referer: referrerUrl,
            },
            form: true,
            body: body,
        })
    })
})

Cypress.Commands.add('waitUntil', function (innerFunction, options = {}) {
    // Determine wait parameters
    const errorMsg = options.errorMsg || 'timed out';
    const timeout = options.timeout || 3000;
    const interval = options.interval || 200;
    let retries = Math.floor(timeout / interval)

    // Evaluate the result and retry if needed
    const checkResult = (result) => {
        // Function succeeded, stop
        if (result) {
            return result
        }
        // Retries exceeded, fail
        if (retries < 1) {
            throw new Error(errorMsg)
        }
        // Wait and trigger a retry
        cy.wait(interval, {log: false}).then(() => {
            cy.log('Retrying...')
            retries--
            return callFunction()
        })
    }

    // Call the actual function
    const callFunction = () => {
        const result = innerFunction()

        const isPromise = Boolean(result && result.then)
        if (isPromise) {
            return result.then(checkResult)
        } else {
            return checkResult(result)
        }
    }

    return callFunction()
})
