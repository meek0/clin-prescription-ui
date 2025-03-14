/// <reference types="cypress"/>
import '../../support/commands';

let epCHUSJ_ldmCHUSJ: any;
let epCUSM_ldmCHUSJ: any;
let epCUSM_ldmCUSM: any;
let epCHUS_ldmCHUS: any;

beforeEach(() => {
  epCHUSJ_ldmCHUSJ = Cypress.env('globalData').presc_EP_CHUSJ_LDM_CHUSJ;
  epCUSM_ldmCHUSJ = Cypress.env('globalData').presc_EP_CUSM_LDM_CHUSJ;
  epCUSM_ldmCUSM = Cypress.env('globalData').presc_EP_CUSM_LDM_CUSM;
  epCHUS_ldmCHUS = Cypress.env('globalData').presc_EP_CHUS_LDM_CHUS;
  cy.login(Cypress.env('username_G_CHUS'), Cypress.env('password').replace('$', '!'));
  cy.visit('/');
});

describe('Accès des utilisateurs', () => {
  it('Généticien (CHUS)', () => {
    // Accéder à la page Prescription d'un patient du CHUSJ
    cy.visit(`/prescription/entity/${epCHUSJ_ldmCHUSJ.prescriptionId}`);
    cy.contains('403').should('exist');

    // Accéder à la page Prescription d'un patient du CUSM (LDM: CHUSJ)
    cy.visit(`/prescription/entity/${epCUSM_ldmCHUSJ.prescriptionId}`);
    cy.contains('403').should('exist');

    // Accéder à la page Prescription d'un patient du CUSM (LDM: CUSM)
    cy.visit(`/prescription/entity/${epCUSM_ldmCUSM.prescriptionId}`);
    cy.contains('403').should('exist');

    // Accéder à la page Prescription d'un patient du CHUS
    cy.visit(`/prescription/entity/${epCHUS_ldmCHUS.prescriptionId}`);
    cy.contains('403').should('exist');

    // Les liens de la footer ne sont pas visibles
    cy.contains('Zeppelin').should('not.exist');
    cy.contains('Fhir').should('not.exist');
  });
});
