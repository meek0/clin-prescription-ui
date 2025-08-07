/* eslint-disable @typescript-eslint/no-explicit-any */
import { clickAddObservedSign, clickAddUnobservedSign, clickNext, clickSave, clickSaveWithValidateOnly, selectAge, typeAndSelectClinicalSign } from "../../shared/actions";

const selectors = {
  clinicalSign: '[data-cy*="ObservedHP"]',
  inputClinicalComment: 'textarea[id="proband_clinical_proband_clinical_comment"]',
};

export const Step2 = {
  actions: {
    checkFirstClinicalSign() {
      cy.get(selectors.clinicalSign).eq(0).check({force: true});
    },
    selectAntenatalAge(index: number) {
      selectAge(index, 'antenatal');
    },
    clickAddObservedSign() {
      clickAddObservedSign();
    },
    typeAndSelectClinicalSign(sign: string, index: number) {
      typeAndSelectClinicalSign(sign, index);
    },
    clickAddUnobservedSign() {
      clickAddUnobservedSign();
    },
    enterClinicalComment(comment: string) {
      cy.get(selectors.inputClinicalComment).type(comment, {force: true});
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