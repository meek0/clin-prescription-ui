/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));

  cy.visitHomePage();
});

describe('Page des prescriptions - Consultation du tableau des prescriptions', () => {
  it('Vérifier les informations affichées', () => {
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(1).contains(/\d{7}/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(2).contains(/\d{7}/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(3).contains(/(Routine|ASAP)/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(4).contains(/(Brouillon|Soumise|Approuvée)/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(5).contains(/^\d{4}-\d{2}-\d{2}$/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(6).contains(/(DYSM|HYPM|MITN|MMG|MYAC|MYOC|POLYM|RGDI|RHAB)/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(7).contains(/(CHUSJ|CHUS|CUSM)/).should('exist');
  });

  it('Valider les liens disponibles Lien Prescription', () => {
    cy.intercept('POST', '**/$graphql*').as('getPOSTgraphql');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(1).find('a[href*="prescription"]').clickAndWait({force: true});
    cy.wait('@getPOSTgraphql');

    cy.contains('Identifiant').should('exist');
  });
});

describe('Page des prescriptions - Consultation du tableau des prescriptions', () => {
  it('Valider les fonctionnalités du tableau - Tri Prescription', () => {
    cy.sortTableAndIntercept('Prescription', 1);
    cy.validateTableFirstRow(/\d{7}/, 1);
    cy.sortTableAndIntercept('Prescription', 1);
    cy.validateTableFirstRow(/\d{7}/, 1);
  });

  it('Valider les fonctionnalités du tableau - Tri Patient', () => {
    cy.sortTableAndIntercept('Patient', 1);
    cy.validateTableFirstRow(/\d{7}/, 2);
    cy.sortTableAndIntercept('Patient', 1);
    cy.validateTableFirstRow(/\d{7}/, 2);
  });

  it('Valider les fonctionnalités du tableau - Tri Priorité', () => {
    cy.sortTableAndIntercept('Priorité', 1);
    cy.validateTableFirstRow(/^(-|Routine|ASAP)$/, 3);
    cy.sortTableAndIntercept('Priorité', 1);
    cy.validateTableFirstRow(/^(Routine|ASAP)$/, 3);
  });

  it('Valider les fonctionnalités du tableau - Tri Statut', () => {
    cy.sortTableAndIntercept('Statut', 1);
    cy.validateTableFirstRow('Approuvée', 4);
    cy.sortTableAndIntercept('Statut', 1);
    cy.validateTableFirstRow('Soumise', 4);
  });

  it('Valider les fonctionnalités du tableau - Tri Créée le', () => {
    cy.sortTableAndIntercept('Créée le', 1);
    cy.validateTableFirstRow(/^\d{4}-\d{2}-\d{2}$/, 5);
    cy.sortTableAndIntercept('Créée le', 1);
    cy.validateTableFirstRow(/^\d{4}-\d{2}-\d{2}$/, 5);
  });

  it('Valider les fonctionnalités du tableau - Tri Analyse', () => {
    cy.sortTableAndIntercept('Analyse', 1);
    cy.validateTableFirstRow(/(DYSM|HYPM|MITN|MMG|MYAC|MYOC|POLYM|RGDI|RHAB)/, 6);
    cy.sortTableAndIntercept('Analyse', 1);
    cy.validateTableFirstRow(/(DYSM|HYPM|MITN|MMG|MYAC|MYOC|POLYM|RGDI|RHAB)/, 6);
  });

  it('Valider les fonctionnalités du tableau - Tri EP', () => {
    cy.sortTableAndIntercept('EP', 1);
    cy.validateTableFirstRow(/(CHUSJ|CHUS|CUSM)/, 7);
    cy.sortTableAndIntercept('EP', 1);
    cy.validateTableFirstRow(/(CHUSJ|CHUS|CUSM)/, 7);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndIntercept('EP', 1);
    cy.sortTableAndIntercept('Analyse', 1);
    cy.validateTableFirstRow(/\d{7}/, 1);
  });
});
