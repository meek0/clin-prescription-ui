/* eslint-disable @typescript-eslint/no-explicit-any */
import { clickNext, clickSave, clickSaveWithValidateOnly } from "../../shared/actions";

const consanguinityValue = (consanguinity: string) => {
    const mapping: Record<string, string|null> = {
      yes: 'true',
      no: 'false',
      na: null,
    };
    return mapping[consanguinity];
};

const parentalLinkValue = (parent: string) => {
    const mapping: Record<string, string> = {
      mother: 'Membre de la branche maternelle',
      father: 'Membre de la branche paternelle',
    };
    return mapping[parent];
};

const selectors = {
  checkboxFamilyHistory: '[id="history_and_diagnosis_history_and_diagnosis_report_health_conditions"]',
  inputHealthCondition: (index: number) => `input[id="history_and_diagnosis_history_and_diagnosis_history_${index}_condition"]`,
  selectParentalLink: (index: number) => `input[id="history_and_diagnosis_history_and_diagnosis_history_${index}_parental_link_code"]`,
  dropdownParentalLink: '[class="ant-select-item-option-content"]',
  radioConsanguinity: (consanguinity: string) => consanguinityValue(consanguinity) === null
    ? '[id="history_and_diagnosis_history_and_diagnosis_inbreeding"] input[value=""]'
    : `[id="history_and_diagnosis_history_and_diagnosis_inbreeding"] input[value="${consanguinityValue(consanguinity)}"]`,
  selectEthnicity: 'input[id="history_and_diagnosis_history_and_diagnosis_ethnicity_codes"]',
  dropdownEthnicity: '[class="rc-virtual-list"] [class="ant-select-item-option-content"]',
  labelEthnicity: 'label[for="history_and_diagnosis_history_and_diagnosis_ethnicity_codes"]',
  inputDiagnosticHypothesis: 'textarea[data-cy="InputHypothesis"]',
};

export const Step4 = {
  actions: {
    checkFamilyHistory() {
      cy.get(selectors.checkboxFamilyHistory).check({force: true});
    },
    enterHealthCondition(index: number, condition: string) {
      cy.get(selectors.inputHealthCondition(index)).type(condition);
    },
    selectParentalLink(index: number, parent: string) {
      cy.get(selectors.selectParentalLink(index)).clickAndWait();
      cy.get(selectors.dropdownParentalLink).contains(parentalLinkValue(parent)).clickAndWait();
    },
    checkConsanguinity(consanguinity: string) {
      cy.get(selectors.radioConsanguinity(consanguinity)).check({force: true});
    },
    selectEthnicities() {
      cy.get(selectors.selectEthnicity).clickAndWait({force: true});
      cy.wait(1000);
      cy.get(selectors.dropdownEthnicity).filter(':visible').eq(0).clickAndWait({force: true});
      cy.wait(1000);
      cy.get(selectors.dropdownEthnicity).filter(':visible').eq(1).clickAndWait({force: true});
      cy.get(selectors.labelEthnicity).clickAndWait({force: true}); // To close the dropdown
    },
    enterDiagnosticHypothesis(hypothesis: string) {
      cy.get(selectors.inputDiagnosticHypothesis).type(hypothesis);
    },
    clickSave() {
      clickSave();
    },
    clickSaveWithValidateOnly() {
      clickSaveWithValidateOnly();
    },
    clickNext() {
      clickNext();
    },
  },
};