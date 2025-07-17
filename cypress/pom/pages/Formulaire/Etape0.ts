const selectors = {
  nouvellePrescription: '[data-cy="CreateNewPrescription"] [data-cy="ActionButton"]',
  selectAnalyse: '[data-cy="SelectAnalysis"]',
  commencer: '[data-cy="AnalysisModal"] button[class*="ant-btn-primary"]',
};

export const Etape0 = {
  actions: {
    nouvellePrescription() {
      cy.get(selectors.nouvellePrescription).clickAndWait({force: true});
    },
    selectPrescriptionRGDI() {
      cy.get(selectors.selectAnalyse).clickAndWait();
      cy.contains('Retard global de développement / Déficience intellectuelle').click({force: true});
      cy.get(`${selectors.selectAnalyse} input`).should('have.attr', 'aria-expanded', 'false');
    },
    clickCommencer() {
      cy.get(selectors.commencer).clickAndWait({force: true});
    },
  },
};