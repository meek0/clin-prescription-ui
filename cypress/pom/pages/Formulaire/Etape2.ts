/* eslint-disable @typescript-eslint/no-explicit-any */

const selectors = {
  premierSigneClinique: '[data-cy="ObservedHP:0012443"]',
  selectAge: '[class*="ClinicalSignsSelect_ageSelectInput"]',
  ageAntenatale: '[class="rc-virtual-list"] [data-cy="SelectOptionHP:0030674"]',
  ajouterSigneObserve: '[class*="ClinicalSignsSelect_addClinicalSignBtn"]',
  rechercheSigneClinique: '[class*="ClinicalSignsSelect_phenotype-search"] input[class*="ant-select-selection-search-input"]',
  dropdownResultatSigne: '[class="rc-virtual-list"] [class="ant-select-item-option-content"]',
  commentaireClinique: 'textarea[id="proband_clinical_proband_clinical_comment"]',
  boutonSuivant: '[data-cy="NextButton"]',
};

export const Etape2 = {
  actions: {
    checkPremierSigneClinique() {
      cy.get(selectors.premierSigneClinique).check({ force: true });
    },
    selectAgeAntenatale(eq: number) {
      cy.get(selectors.selectAge).eq(eq).clickAndWait();
      cy.get(selectors.ageAntenatale).filter(':visible').clickAndWait({force: true});
    },
    clickAjouterSigneObserve() {
      cy.get(selectors.ajouterSigneObserve).first().clickAndWait({force: true});
    },
    typeEtSelectSigneClinique(signe: string, eq: number) {
      cy.get(selectors.rechercheSigneClinique).eq(eq).type(signe, {force: true});
      cy.get(selectors.dropdownResultatSigne).filter(':visible').contains(signe).eq(0).clickAndWait({force: true});
    },
    clickAjouterSigneNonObserve() {
      cy.get(selectors.ajouterSigneObserve).last().clickAndWait({force: true});
    },
    enterCommentaireClinique(commentaire: string) {
      cy.get(selectors.commentaireClinique).type(commentaire, {force: true});
    },
    clickSuivant() {
      cy.get(selectors.boutonSuivant).click();
    },
  },
};