/* eslint-disable @typescript-eslint/no-explicit-any */

const selectors = {
  checkboxChusj: 'input[type="radio"][value="CHUSJ"]',
  inputDossier: '[data-cy="InputMRN"]',
  loupeDossier: '[data-cy="InputMRN"] button[class*="ant-input-search-button"]',
  inputRamq: '[id="proband_proband_jhn"]',
  loupeRamq: '[id="proband_proband_jhn"] button[class*="ant-input-search-button"]',
  inputNom: '[id="proband_proband_last_name"]',
  inputPrenom: '[id="proband_proband_first_name"]',
  boutonSuivant: '[data-cy="NextButton"]',
};

export const Etape1 = {
  actions: {
    checkChusj() {
      cy.get(selectors.checkboxChusj).clickAndWait({force: true});
    },
    enterDossier(dossier: string) {
      cy.get(selectors.inputDossier).type(dossier, {force: true});
    },
    clickLoupeDossier() {
      cy.intercept('GET', '**/api/v1/search/patient?*').as('getPatient');
      cy.get(selectors.inputDossier).parent().find('[type="button"]').clickAndWait({force: true});
      cy.wait('@getPatient');
    },
    enterRamq(ramq: string) {
      cy.get(selectors.inputRamq).type(ramq, {force: true});
    },
    clickLoupeRamq() {
      cy.intercept('GET', '**/api/v1/search/patients?*').as('getPatients');
      cy.get(selectors.inputRamq).parent().find('[type="button"]').clickAndWait({force: true});
      cy.wait('@getPatients');
    },
    enterNom(nom: string) {
      cy.get(selectors.inputNom).type(nom, {force: true});
    },
    enterPrenom(prenom: string) {
      cy.get(selectors.inputPrenom).type(prenom, {force: true});
    },
    clickSuivant() {
      cy.get(selectors.boutonSuivant).clickAndWait({force: true});
    },
  },
};