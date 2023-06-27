describe('true is true', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
})

describe('login to AEM', () => {
  it('Login to AEM', () => {
    cy.AEMLogin()
  })
})