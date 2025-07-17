/* eslint-disable @typescript-eslint/no-explicit-any */

const statusValues = (status: string) => {
    const mapping: Record<string, string> = {
      now: 'NOW',
      later: 'LATER',
      never: 'NEVER',
    };
    return mapping[status];
};

const affectedValues = (affected: string) => {
    const mapping: Record<string, string> = {
      affected: 'affected',
      notaffected: 'not_affected',
      unknown: 'unknown',
    };
    return mapping[affected];
};

const selectors = {
  status: (status: string) => `[id="mother_mother_status"] input[value="${statusValues(status)}"]`,
  checkboxChusj: 'input[type="radio"][value="CHUSJ"]',
  inputDossier: '[data-cy="InputMRN"]',
  loupeDossier: '[data-cy="InputMRN"] button[class*="ant-input-search-button"]',
  inputRamq: '[id="mother_mother_jhn"]',
  loupeRamq: '[id="mother_mother_jhn"] button[class*="ant-input-search-button"]',
  inputNom: '[id="mother_mother_last_name"]',
  inputPrenom: '[id="mother_mother_first_name"]',
  affected: (affected: string) => `[id="mother_mother_parent_clinical_status"] input[value="${affectedValues(affected)}"]`,
  ajouterSigneObserve: '[class*="ClinicalSignsSelect_addClinicalSignBtn"]',
  rechercheSigneClinique: '[class*="ClinicalSignsSelect_phenotype-search"] input[class*="ant-select-selection-search-input"]',
  dropdownResultatSigne: '[class="rc-virtual-list"] [class="ant-select-item-option-content"]',
  selectAge: '[class*="ClinicalSignsSelect_ageSelectInput"]',
  ageEnfance: '[class="rc-virtual-list"] [data-cy="SelectOptionHP:0011463"]',
  commentaireClinique: 'textarea[id="mother_mother_comment"]',
  boutonSuivant: '[data-cy="NextButton"]',
};

export const Etape5 = {
  actions: {
    checkStatus(status: string) {
      cy.get(selectors.status(status)).check({ force: true });
    },
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
    checkAtteint(affected: string) {
      cy.get(selectors.affected(affected)).check({ force: true });
    },
    clickAjouterSigneObserve() {
      cy.get(selectors.ajouterSigneObserve).first().clickAndWait({force: true});
    },
    typeEtSelectSigneClinique(signe: string, eq: number) {
      cy.get(selectors.rechercheSigneClinique).eq(eq).type(signe, {force: true});
      cy.get(selectors.dropdownResultatSigne).filter(':visible').contains(signe).eq(0).clickAndWait({force: true});
    },
    selectAgeEnfance(eq: number) {
      cy.get(selectors.selectAge).eq(eq).clickAndWait();
      cy.get(selectors.ageEnfance).filter(':visible').clickAndWait({force: true});
    },
    clickAjouterSigneNonObserve() {
      cy.get(selectors.ajouterSigneObserve).last().clickAndWait({force: true});
    },
    enterCommentaireClinique(commentaire: string) {
      cy.get(selectors.commentaireClinique).type(commentaire);
    },
    clickSuivant() {
      cy.get(selectors.boutonSuivant).clickAndWait({force: true});
    },
  },
};