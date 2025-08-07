/* eslint-disable @typescript-eslint/no-explicit-any */
import { clickSave, clickSaveWithValidateOnly } from "../../shared/actions";

const selectors = {
  buttonSubmit: '[data-cy="SubmitButton"]',
};

export const StepSubmission = {
  actions: {
    clickSave() {
      clickSave();
    },
    clickSaveWithValidateOnly() {
      clickSaveWithValidateOnly();
    },
    clickSubmit() {
      cy.intercept('POST', '**/api/v1/analysis').as('analysisRequest');
      cy.get(selectors.buttonSubmit).clickAndWait({force: true});
      cy.wait('@analysisRequest');
    },
    clickSubmitWithValidateOnly() {
      cy.intercept('POST', '**/api/v1/analysis', (req) => {
        req.destroy();
      }).as('analysisRequest');

      cy.get(selectors.buttonSubmit).click();

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