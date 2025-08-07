/* eslint-disable @typescript-eslint/no-explicit-any */
import { clickAddObservedSign, clickAddUnobservedSign, clickNext, clickSave, clickSaveWithValidateOnly, clickSearchMrn, enterMrn, selectAge, selectEp, typeAndSelectClinicalSign } from "../../shared/actions";

const statusValue = (status: string) => {
    const mapping: Record<string, string> = {
      now: 'NOW',
      later: 'LATER',
      never: 'NEVER',
    };
    return mapping[status];
};

const affectedValue = (affected: string) => {
    const mapping: Record<string, string> = {
      affected: 'affected',
      notaffected: 'not_affected',
      unknown: 'unknown',
    };
    return mapping[affected];
};

const selectors = {
  checkboxStatus: (status: string) => `[id="father_father_status"] input[value="${statusValue(status)}"]`,
  inputJhn: '[id="father_father_jhn"]',
  inputLastName: '[id="father_father_last_name"]',
  inputFirstName: '[id="father_father_first_name"]',
  checkboxAffected: (affected: string) => `[id="father_father_parent_clinical_status"] input[value="${affectedValue(affected)}"]`,
  inputClinicalComment: 'textarea[id="father_father_comment"]',
};

export const Step6 = {
  actions: {
    checkStatus(status: string) {
      cy.get(selectors.checkboxStatus(status)).check({force: true});
    },
    checkEp(ep: string) {
      selectEp(ep);
    },
    enterMrn(mrn: string) {
      enterMrn(mrn);
    },
    clickSearchMrn() {
      clickSearchMrn();
    },
    enterJhn(jhn: string) {
      cy.get(selectors.inputJhn).type(jhn, {force: true});
    },
    clickSearchJhn() {
      cy.intercept('GET', '**/api/v1/search/patients?*').as('getPatients');
      cy.get(selectors.inputJhn).parent().find('[type="button"]').clickAndWait({force: true});
      cy.wait('@getPatients');
    },
    enterLastName(lastName: string) {
      cy.get(selectors.inputLastName).type(lastName, {force: true});
    },
    enterFirstName(firstName: string) {
      cy.get(selectors.inputFirstName).type(firstName, {force: true});
    },
    checkAffected(affected: string) {
      cy.get(selectors.checkboxAffected(affected)).check({force: true});
    },
    clickAddObservedSign() {
      clickAddObservedSign();
    },
    typeAndSelectClinicalSign(sign: string, index: number) {
      typeAndSelectClinicalSign(sign, index);
    },
    selectYoungAdultAge(index: number) {
      selectAge(index, 'youngAdult');
    },
    clickAddUnobservedSign() {
      clickAddUnobservedSign();
    },
    enterClinicalComment(comment: string) {
      cy.get(selectors.inputClinicalComment).type(comment);
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