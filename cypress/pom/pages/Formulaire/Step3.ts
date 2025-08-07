/* eslint-disable @typescript-eslint/no-explicit-any */
import { clickNext, clickSave, clickSaveWithValidateOnly } from "../../shared/actions";

const statusValue = (status: string) => {
    const mapping: Record<string, string> = {
      normal: 'NORMAL',
      abnormal: 'ABNORMAL',
      not_done: 'NOT_DONE',
    };
    return mapping[status];
};

const selectors = {
  paraclinicalExam: '[class*="ParaclinicalExamsSelect_paraExamFormItemContent"]',
  radioExamStatus: (status: string) => `input[value="${statusValue(status)}"]`,
  selectExplanation: '[class="ant-select-selection-search-input"]',
  dropdownExplanation: '[class="rc-virtual-list"] [class="ant-select-item-option-content"]',
  inputExplanation:  (index: number) => `input[id="proband_paraclinical_proband_paraclinical_exams_${index}_value"]`,
  inputOtherExams: 'textarea[id="proband_paraclinical_proband_paraclinical_other"]',
};

export const Step3 = {
  actions: {
    checkParaclinicalExam(index: number, status: string) {
      cy.get(selectors.paraclinicalExam).eq(index).find(selectors.radioExamStatus(status)).check({force: true});
    },
    selectFirstExplanation() {
      cy.get(selectors.selectExplanation).clickAndWait({force: true});
      cy.get(selectors.dropdownExplanation).filter(':visible').eq(0).clickAndWait({force: true});
    },
    typeExplanation(index: number, explanation: string) {
      cy.get(selectors.inputExplanation(index)).type(explanation, {force: true});
    },
    enterOtherExams(exams: string) {
      cy.get(selectors.inputOtherExams).type(exams);
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