/* eslint-disable @typescript-eslint/no-explicit-any */

const selectors = {
  boutonSoumettre: '[data-cy="SubmitButton"]',
};

export const EtapeSoumission = {
  actions: {
    clickSoumettreWithValidateOnly() {
      cy.intercept('POST', '**/api/v1/analysis', (req) => {
        req.destroy();
      }).as('analysisRequest');

      cy.get(selectors.boutonSoumettre).click();

      cy.wait('@analysisRequest').then((interception) => {
        const { body, headers } = interception.request;
        const { request } = interception;
        const urlValidateOnly = new URL(request.url);
        urlValidateOnly.searchParams.set('validate-only', 'true');
        cy.request({
          method: 'POST',
          url: urlValidateOnly.toString(),
          body,
          headers,
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    },
  },
};