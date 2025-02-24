/// <reference types="cypress"/>
import '../../support/commands';

let epCHUSJ_ldmCHUSJ: any;

beforeEach(() => {
  epCHUSJ_ldmCHUSJ = Cypress.env('globalData').presc_EP_CHUSJ_LDM_CHUSJ;
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  cy.visitPrescriptionEntityPage(epCHUSJ_ldmCHUSJ.prescriptionId);
});

describe('Page d\'une prescription - Valider les liens indisponibles', () => {
  it('Bouton Voir les variants', () => {
    cy.contains('Voir les variants').should('not.exist');
  });

  it('Bouton Télécharger', () => {
    cy.get('button[type="button"]').contains('Télécharger').should('exist');
  });

  it('Lien Fichiers (Cas-index)', () => {
    cy.contains('[data-cy="ArchiveLink_'+epCHUSJ_ldmCHUSJ.requestProbId+'"]').should('not.exist');
  });

  it('Lien Fichiers (Mère)', () => {
    cy.contains('[data-cy="ArchiveLink_'+epCHUSJ_ldmCHUSJ.requestMthId+'"]').should('not.exist');
  });

  it('Lien Fichiers (Père)', () => {
    cy.contains('[data-cy="ArchiveLink_'+epCHUSJ_ldmCHUSJ.requestFthId+'"]').should('not.exist');
  });

  it('Lien Variants (Cas-index)', () => {
    cy.contains('[data-cy="VariantsLink_'+epCHUSJ_ldmCHUSJ.patientProbId+'_'+epCHUSJ_ldmCHUSJ.requestProbId+'"]').should('not.exist');
  });

  it('Lien Variants (Mère)', () => {
    cy.contains('[data-cy="VariantsLink_'+epCHUSJ_ldmCHUSJ.patientMthId+'_'+epCHUSJ_ldmCHUSJ.requestMthId+'"]').should('not.exist');
  });

  it('Lien Variants (Père)', () => {
    cy.contains('[data-cy="VariantsLink_'+epCHUSJ_ldmCHUSJ.patientFthId+'_'+epCHUSJ_ldmCHUSJ.requestFthId+'"]').should('not.exist');
  });
});
