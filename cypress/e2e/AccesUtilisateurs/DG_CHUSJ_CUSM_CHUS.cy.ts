/// <reference types="cypress"/>
import '../../support/commands';

let epCHUSJ_ldmCHUSJ: any;
let epCUSM_ldmCHUSJ: any;
let epCUSM_ldmCUSM: any;
let epCHUS_ldmCHUS: any;
let epCHUM_ldmCHUM: any;

beforeEach(() => {
  epCHUSJ_ldmCHUSJ = Cypress.env('globalData').presc_EP_CHUSJ_LDM_CHUSJ;
  epCUSM_ldmCHUSJ = Cypress.env('globalData').presc_EP_CUSM_LDM_CHUSJ;
  epCUSM_ldmCUSM = Cypress.env('globalData').presc_EP_CUSM_LDM_CUSM;
  epCHUS_ldmCHUS = Cypress.env('globalData').presc_EP_CHUS_LDM_CHUS;
  epCHUM_ldmCHUM = Cypress.env('globalData').presc_EP_CHUM_LDM_CHUM;
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  cy.visit('/');
});

describe('Accès des utilisateurs', () => {
  it('Docteur et généticien (CHUSJ, CUSM, CHUS)', () => {
    // Accéder à la page Prescription d'un patient du CHUSJ
    cy.visitPrescriptionEntityPage(epCHUSJ_ldmCHUSJ.prescriptionId);
    cy.contains(epCHUSJ_ldmCHUSJ.firstNameProb).should('exist');

    // Accéder à la page Prescription d'un patient du CUSM (LDM: CHUSJ)
    cy.visitPrescriptionEntityPage(epCUSM_ldmCHUSJ.prescriptionId);
    cy.contains(epCUSM_ldmCHUSJ.firstNameProb).should('exist');

    // Accéder à la page Prescription d'un patient du CUSM (LDM: CUSM)
    cy.visitPrescriptionEntityPage(epCUSM_ldmCUSM.prescriptionId);
    cy.contains(epCUSM_ldmCUSM.firstNameProb).should('exist');

    // Accéder à la page Prescription d'un patient du CHUS
    cy.visitPrescriptionEntityPage(epCHUS_ldmCHUS.prescriptionId);
    cy.contains(epCHUS_ldmCHUS.firstNameProb).should('exist');

    // Les liens de la footer sont visibles
    cy.contains('Zeppelin').should('exist');
    cy.contains('Fhir').should('exist');
  });
});
