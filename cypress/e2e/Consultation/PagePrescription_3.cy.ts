/// <reference types="cypress"/>
import '../../support/commands';

let epCHUSJ_ldmCHUSJ: any;

beforeEach(() => {
  epCHUSJ_ldmCHUSJ = Cypress.env('globalData').presc_EP_CHUSJ_LDM_CHUSJ;
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  cy.visitPrescriptionEntityPage(epCHUSJ_ldmCHUSJ.prescriptionId);
});

describe('Page d\'une prescription - Valider les panneaux masquables', () => {
  it('Panneau Information clinique', () => {
    cy.get('[data-cy="ClinicalInformation_CollapsePanel"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[data-cy="ClinicalInformation_CollapsePanel"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[data-cy="ClinicalInformation_CollapsePanel"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[data-cy="ClinicalInformation_CollapsePanel"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[data-cy="ClinicalInformation_CollapsePanel"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Mère', () => {
    cy.get('[data-cy="ParentCard_Mère_CollapsePanel"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[data-cy="ParentCard_Mère_CollapsePanel"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[data-cy="ParentCard_Mère_CollapsePanel"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[data-cy="ParentCard_Mère_CollapsePanel"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[data-cy="ParentCard_Mère_CollapsePanel"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Père', () => {
    cy.get('[data-cy="ParentCard_Père_CollapsePanel"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[data-cy="ParentCard_Père_CollapsePanel"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[data-cy="ParentCard_Père_CollapsePanel"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[data-cy="ParentCard_Père_CollapsePanel"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[data-cy="ParentCard_Père_CollapsePanel"] div[class*="ant-collapse-content-active"]').should('exist');
  });
});
  