/* eslint-disable @typescript-eslint/no-explicit-any */

const statusValues = (status: string) => {
    const mapping: Record<string, string> = {
      normal: 'NORMAL',
      abnormal: 'ABNORMAL',
      not_done: 'NOT_DONE',
    };
    return mapping[status];
};

const selectors = {
  examenParaclinique: '[class*="ParaclinicalExamsSelect_paraExamFormItemContent"]',
  examenStatus: (status: string) => `input[value="${statusValues(status)}"]`,
  explication: '[class="ant-select-selection-search-input"]',
  dropdownExplications: '[class="rc-virtual-list"] [class="ant-select-item-option-content"]',
  autresExamens: 'textarea[id="proband_paraclinical_proband_paraclinical_other"]',
  boutonSuivant: '[data-cy="NextButton"]',
};

export const Etape3 = {
  actions: {
    checkExamenParaclinique(eq: number, status: string) {
      cy.get(selectors.examenParaclinique).eq(eq).find(selectors.examenStatus(status)).check({ force: true });
    },
    selectPremiereExplication() {
      cy.get(selectors.explication).clickAndWait({ force: true });
      cy.get(selectors.dropdownExplications).filter(':visible').eq(0).clickAndWait({ force: true });
    },
    enterAutresExamens(examens: string) {
      cy.get(selectors.autresExamens).type(examens);
    },
    clickSuivant() {
      cy.get(selectors.boutonSuivant).clickAndWait();
    },
  },
};