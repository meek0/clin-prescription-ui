/* eslint-disable @typescript-eslint/no-explicit-any */

const consanguiniteValues = (consanguinite: string) => {
    const mapping: Record<string, string|null> = {
      yes: 'true',
      no: 'false',
      na: null,
    };
    return mapping[consanguinite];
};

const brancheParentaleValues = (parent: string) => {
    const mapping: Record<string, string> = {
      mere: 'Membre de la branche maternelle',
      pere: 'Membre de la branche paternelle',
    };
    return mapping[parent];
};

const selectors = {
  histoireFamiliale: '[id="history_and_diagnosis_history_and_diagnosis_report_health_conditions"]',
  conditionSante: (number: number) => `input[id="history_and_diagnosis_history_and_diagnosis_history_${number}_condition"]`,
  lienParental: (number: number) => `input[id="history_and_diagnosis_history_and_diagnosis_history_${number}_parental_link_code"]`,
  brancheParentale: '[class="ant-select-item-option-content"]',
  consanguinite: (consanguinite: string) => consanguiniteValues(consanguinite) === null
    ? '[id="history_and_diagnosis_history_and_diagnosis_inbreeding"] input[value=""]'
    : `[id="history_and_diagnosis_history_and_diagnosis_inbreeding"] input[value="${consanguiniteValues(consanguinite)}"]`,
  ethnicite: 'input[id="history_and_diagnosis_history_and_diagnosis_ethnicity_codes"]',
  ethniciteDropdown: '[class="rc-virtual-list"] [class="ant-select-item-option-content"]',
  ethniciteLabel: 'label[for="history_and_diagnosis_history_and_diagnosis_ethnicity_codes"]',
  hypotheseDiagnostique: 'textarea[data-cy="InputHypothesis"]',
  boutonSuivant: '[data-cy="NextButton"]',
};

export const Etape4 = {
  actions: {
    checkHistoireFamiliale() {
      cy.get(selectors.histoireFamiliale).check({ force: true });
    },
    enterConditionSante(eq: number, condition: string) {
      cy.get(selectors.conditionSante(eq)).type(condition);
    },
    selectLienParental(eq: number, parent: string) {
      cy.get(selectors.lienParental(eq)).clickAndWait();
      cy.get(selectors.brancheParentale).contains(brancheParentaleValues(parent)).clickAndWait();
    },
    checkConsanguinite(consanguinite: string) {
      cy.get(selectors.consanguinite(consanguinite)).check({ force: true });
    },
    selectEthnicites() {
      cy.get(selectors.ethnicite).clickAndWait({ force: true });
      cy.wait(1000);
      cy.get(selectors.ethniciteDropdown).filter(':visible').eq(0).clickAndWait({ force: true });
      cy.wait(1000);
      cy.get(selectors.ethniciteDropdown).filter(':visible').eq(1).clickAndWait({ force: true });
      cy.get(selectors.ethniciteLabel).clickAndWait({ force: true });
    },
    enterHypotheseDiagnostique(hypothese: string) {
      cy.get(selectors.hypotheseDiagnostique).type(hypothese);
    },
    clickSuivant() {
      cy.get(selectors.boutonSuivant).clickAndWait();
    },
  },
};