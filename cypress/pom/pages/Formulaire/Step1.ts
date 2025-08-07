/* eslint-disable @typescript-eslint/no-explicit-any */
import { clickNext, clickSave, clickSaveWithValidateOnly, clickSearchMrn, enterMrn, selectEp } from "../../shared/actions";

const sexValue = (sex: string) => {
    const mapping: Record<string, string> = {
      female: 'FEMALE',
      male: 'MALE',
      unknown: 'UNKNOWN',
    };
    return mapping[sex];
};

const gestationalAgeValue = (gestationalAge: string) => {
    const mapping: Record<string, string> = {
      ddm: 'DDM',
      dpa: 'DPA',
      deceased: 'DECEASED',
    };
    return mapping[gestationalAge];
};

const selectors = {
  inputJhn: '[id="proband_proband_jhn"]',
  checkboxNoJhn: 'input[id="proband_proband_no_jhn"]',
  inputLastName: '[id="proband_proband_last_name"]',
  inputFirstName: '[id="proband_proband_first_name"]',
  inputBirthDate: 'input[id="proband_proband_birth_date"]',
  radioSex: (sex: string) => `[id="proband_proband_sex"] input[value="${sexValue(sex)}"]`,
  checkboxPrenatalDiagnosis: 'input[id="proband_proband_foetus_is_prenatal_diagnosis"]',
  checkboxNewborn: 'input[id="proband_proband_foetus_is_new_born"]',
  radioFetusSex: (sex: string) => `[id="proband_proband_foetus_sex"] input[value="${sexValue(sex)}"]`,
  radioGestationalAge: (gestationalAge: string) => `[class*="AdditionalInformation_verticalRadioWrapper"] input[value="${gestationalAgeValue(gestationalAge)}"]`,
  inputGestationalDate: 'input[id="proband_proband_foetus_gestational_date"]',
  inputMotherJhn: 'input[id="proband_proband_foetus_mother_jhn"]',
};

export const Step1 = {
  actions: {
    selectEp(ep: string) {
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
    checkNoJhn() {
      cy.get(selectors.checkboxNoJhn).check({force: true});
    },
    enterLastName(lastName: string) {
      cy.get(selectors.inputLastName).type(lastName, {force: true});
    },
    enterFirstName(firstName: string) {
      cy.get(selectors.inputFirstName).type(firstName, {force: true});
    },
    enterBirthDate(date: string) {
      cy.get(selectors.inputBirthDate).type(date, {force: true});
    },
    checkSex(sex: string) {
      cy.get(selectors.radioSex(sex)).check({force: true});
    },
    checkPrenatalDiagnosis() {
      cy.get(selectors.checkboxPrenatalDiagnosis).check({force: true});
    },
    checkNewborn() {
      cy.get(selectors.checkboxNewborn).check({force: true});
    },
    checkFetusSex(sex: string) {
      cy.get(selectors.radioFetusSex(sex)).check({force: true});
    },
    checkGestationalAge(gestationalAge: string) {
      cy.get(selectors.radioGestationalAge(gestationalAge)).check({force: true});
    },
    enterGestationalDate(date: string) {
      cy.get(selectors.inputGestationalDate).type(date, {force: true});
    },
    enterMotherJhn(jhn: string) {
      cy.get(selectors.inputMotherJhn).type(jhn, {force: true});
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