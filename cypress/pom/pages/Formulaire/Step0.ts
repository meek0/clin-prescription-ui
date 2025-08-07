/* eslint-disable @typescript-eslint/no-explicit-any */

const analysisLabel = (analysis: string) => {
    const mapping: Record<string, string> = {
      RGDI: 'Retard global de développement / Déficience intellectuelle',
      GENOR: 'Génome normal',
      FEAN: 'Anomalies fœtales',
      MMG: 'Maladies musculaires globales',
    };
    return mapping[analysis];
};

const selectors = {
  buttonNewPrescription: '[data-cy="CreateNewPrescription"] [data-cy="ActionButton"]',
  dropdownAnalysis: '[data-cy="SelectAnalysis"]',
  buttonStart: '[data-cy="AnalysisModal"] button[class*="ant-btn-primary"]',
};

export const Step0 = {
  actions: {
    createNewPrescription() {
      cy.get(selectors.buttonNewPrescription).clickAndWait({force: true});
    },
    selectAnalysis(analysis: string) {
      cy.get(selectors.dropdownAnalysis).clickAndWait();
      cy.contains(analysisLabel(analysis)).click({force: true});
      cy.get(`${selectors.dropdownAnalysis} input`).should('have.attr', 'aria-expanded', 'false');
    },
    clickStart() {
      cy.get(selectors.buttonStart).clickAndWait({force: true});
    },
  },
};