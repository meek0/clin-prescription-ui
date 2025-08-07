// Fonctions utilitaires partagées pour les actions de sauvegarde et de validation
import { sharedSelectors } from "./selectors";

const interceptSaveUrl = '**/api/v1/analysis?draft=true';

export function clickAddObservedSign() {
  cy.get(sharedSelectors.buttonAddClinicalSign).first().clickAndWait({force: true});
}

export function clickAddUnobservedSign() {
  cy.get(sharedSelectors.buttonAddClinicalSign).last().clickAndWait({force: true});
}

export function clickNext() {
  cy.get(sharedSelectors.buttonNext).clickAndWait({force: true});
}

export function clickSave() {
  cy.intercept('POST', interceptSaveUrl).as('analysisRequest');
  cy.get(sharedSelectors.buttonSave).clickAndWait({force: true});
  cy.wait('@analysisRequest');
}

export function clickSaveWithValidateOnly() {
  cy.intercept('POST', interceptSaveUrl, (req) => {
    req.destroy();
  }).as('analysisRequest');

  cy.get(sharedSelectors.buttonSave).click();

  cy.wait('@analysisRequest').then((interception) => {
    const { body, headers } = interception.request;
    const { request } = interception;
    const urlValidateOnly = new URL(request.url);
    urlValidateOnly.searchParams.set('validate-only', 'true');
    urlValidateOnly.searchParams.set('draft', 'true');
    cy.request({
      method: 'POST',
      url: urlValidateOnly.toString(),
      body,
      headers,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
}

export function clickSearchMrn() {
  cy.intercept('GET', '**/api/v1/search/patient?*').as('getPatient');
  cy.get(sharedSelectors.inputMrn).parent().find('[type="button"]').clickAndWait({force: true});
  cy.wait('@getPatient');
}

export function enterMrn(mrn: string) {
  cy.get(sharedSelectors.inputMrn).type(mrn, {force: true});
}

export function selectAge(index: number, age:string) {
  cy.get(sharedSelectors.selectAge).eq(index).clickAndWait();
  cy.get(sharedSelectors.dropdownAge(age)).filter(':visible').clickAndWait({force: true});
}

export function selectEp(ep: string) {
  cy.get(sharedSelectors.radioEp(ep)).check({force: true});
}

export function typeAndSelectClinicalSign(sign: string, index: number) {
  cy.get(sharedSelectors.inputClinicalSign).eq(index).type(sign, {force: true});
  cy.get(sharedSelectors.dropdownClinicalSign).filter(':visible').contains(sign).eq(0).clickAndWait({force: true});
}
