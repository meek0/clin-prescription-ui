/// <reference types="cypress"/>
import '../../support/commands';

let epCHUSJ_ldmCHUSJ: any;

beforeEach(() => {
  epCHUSJ_ldmCHUSJ = Cypress.env('globalData').presc_EP_CHUSJ_LDM_CHUSJ;
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));

  cy.visitHomePage();
  cy.resetColumns(0);
});

describe('Page des prescriptions - Rechercher des prescriptions [PRESC-376]', () => {
  it('Par numéro de prescription', () => {
    cy.typeAndIntercept('[class*="PractitionerTable_patientContentContainer"] [class="ant-input"]', epCHUSJ_ldmCHUSJ.prescriptionId, 'POST', '**/graphql', 1);

    cy.get('tr[class*="ant-table-row"]').eq(1).should('not.exist');
    cy.validateTableFirstRow(epCHUSJ_ldmCHUSJ.prescriptionId, 1);
  });

  it('Par numéro de dossier du cas-index', () => {
    cy.typeAndIntercept('[class*="PractitionerTable_patientContentContainer"] [class="ant-input"]', epCHUSJ_ldmCHUSJ.mrnProb, 'POST', '** /graphql', 1);

    cy.get('tr[class*="ant-table-row"]').eq(1).should('not.exist');
    cy.validateTableFirstRow(epCHUSJ_ldmCHUSJ.prescriptionId, 1);
  });

  it('Par numéro de ramq du cas-index', () => {
    cy.typeAndIntercept('[class*="PractitionerTable_patientContentContainer"] [class="ant-input"]', epCHUSJ_ldmCHUSJ.ramqProb, 'POST', '** /graphql', 1);

    cy.get('tr[class*="ant-table-row"]').eq(1).should('not.exist');
    cy.validateTableFirstRow(epCHUSJ_ldmCHUSJ.prescriptionId, 1);
  });

  it('Par prénom du cas-index', () => {
    cy.typeAndIntercept('[class*="PractitionerTable_patientContentContainer"] [class="ant-input"]', epCHUSJ_ldmCHUSJ.firstNameProb, 'POST', '** /graphql', 1);

    cy.get('tr[class*="ant-table-row"]').eq(1).should('not.exist');
    cy.validateTableFirstRow(epCHUSJ_ldmCHUSJ.prescriptionId, 1);
  });

  it('Par nom du cas-index', () => {
    cy.typeAndIntercept('[class*="PractitionerTable_patientContentContainer"] [class="ant-input"]', epCHUSJ_ldmCHUSJ.lastNameProb, 'POST', '** /graphql', 1);

    cy.get('tr[class*="ant-table-row"]').eq(1).should('not.exist');
    cy.validateTableFirstRow(epCHUSJ_ldmCHUSJ.prescriptionId, 1);
  });

  it('Par numéro de dossier de la mère', () => {
    cy.typeAndIntercept('[class*="PractitionerTable_patientContentContainer"] [class="ant-input"]', epCHUSJ_ldmCHUSJ.mrnMth.toLowerCase(), 'POST', '** /graphql', 1);

    cy.get('tr[class*="ant-table-row"]').eq(1).should('not.exist');
    cy.validateTableFirstRow(epCHUSJ_ldmCHUSJ.prescriptionId, 1);
  });

  it('Par numéro de ramq de la mère', () => {
    cy.typeAndIntercept('[class*="PractitionerTable_patientContentContainer"] [class="ant-input"]', epCHUSJ_ldmCHUSJ.ramqMth, 'POST', '** /graphql', 1);

    cy.get('tr[class*="ant-table-row"]').eq(1).should('not.exist');
    cy.validateTableFirstRow(epCHUSJ_ldmCHUSJ.prescriptionId, 1);
  });

  it('Par prénom de la mère', () => {
    cy.typeAndIntercept('[class*="PractitionerTable_patientContentContainer"] [class="ant-input"]', epCHUSJ_ldmCHUSJ.firstNameMth, 'POST', '** /graphql', 1);

    cy.get('tr[class*="ant-table-row"]').eq(1).should('not.exist');
    cy.validateTableFirstRow(epCHUSJ_ldmCHUSJ.prescriptionId, 1);
  });

  it('Par nom de la mère', () => {
    cy.typeAndIntercept('[class*="PractitionerTable_patientContentContainer"] [class="ant-input"]', epCHUSJ_ldmCHUSJ.lastNameMth, 'POST', '** /graphql', 1);

    cy.get('tr[class*="ant-table-row"]').eq(1).should('not.exist');
    cy.validateTableFirstRow(epCHUSJ_ldmCHUSJ.prescriptionId, 1);
  });
});
