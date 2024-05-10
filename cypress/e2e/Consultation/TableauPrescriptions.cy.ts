/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));

  cy.visitHomePage();
});

describe('Page des prescriptions - Consultation du tableau des prescriptions', () => {
  it('Vérifier les informations affichées', () => {
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(0).contains(/\d{7}/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(1).contains(/\d{7}/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(2).contains(/(Routine|ASAP)/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(3).contains('Soumise').should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(4).contains(/^\d{4}-\d{2}-\d{2}$/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(5).contains(/(DYSM|HYPM|MITN|MMG|MYAC|MYOC|POLYM|RGDI|RHAB)/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(6).contains(/(CHUSJ|CHUS|CUSM)/).should('exist');
  });

  it('Valider les liens disponibles Lien Prescription', () => {
    cy.intercept('POST', '**/$graphql*').as('getPOSTgraphql');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(0).find('a[href*="prescription"]').click({force: true});
    cy.wait('@getPOSTgraphql', {timeout: 20*1000});

    cy.contains('Identifiant').should('exist', {timeout: 20*1000});
  });
});

describe('Page des prescriptions - Consultation du tableau des prescriptions', () => {
  it('Valider les fonctionnalités du tableau - Tri Prescription', () => {
    cy.sortTableAndIntercept('Prescription', 1);
    cy.validateTableFirstRow(/\d{7}/, 0);
    cy.sortTableAndIntercept('Prescription', 1);
    cy.validateTableFirstRow(/\d{7}/, 0);
  });

  it('Valider les fonctionnalités du tableau - Tri Patient', () => {
    cy.sortTableAndIntercept('Patient', 1);
    cy.validateTableFirstRow(/\d{7}/, 1);
    cy.sortTableAndIntercept('Patient', 1);
    cy.validateTableFirstRow(/\d{7}/, 1);
  });

  it('Valider les fonctionnalités du tableau - Tri Priorité', () => {
    cy.sortTableAndIntercept('Priorité', 1);
    cy.validateTableFirstRow(/^(-|Routine|ASAP)$/, 2);
    cy.sortTableAndIntercept('Priorité', 1);
    cy.validateTableFirstRow(/^(Routine|ASAP)$/, 2);
  });

  it('Valider les fonctionnalités du tableau - Tri Statut', () => {
    cy.sortTableAndIntercept('Statut', 1);
    cy.validateTableFirstRow('Soumise', 3);
    cy.sortTableAndIntercept('Statut', 1);
    cy.validateTableFirstRow('Soumise', 3);
  });

  it('Valider les fonctionnalités du tableau - Tri Créée le', () => {
    cy.sortTableAndIntercept('Créée le', 1);
    cy.validateTableFirstRow(/^\d{4}-\d{2}-\d{2}$/, 4);
    cy.sortTableAndIntercept('Créée le', 1);
    cy.validateTableFirstRow(/^\d{4}-\d{2}-\d{2}$/, 4);
  });

  it('Valider les fonctionnalités du tableau - Tri Analyse', () => {
    cy.sortTableAndIntercept('Analyse', 1);
    cy.validateTableFirstRow(/(DYSM|HYPM|MITN|MMG|MYAC|MYOC|POLYM|RGDI|RHAB)/, 5);
    cy.sortTableAndIntercept('Analyse', 1);
    cy.validateTableFirstRow(/(DYSM|HYPM|MITN|MMG|MYAC|MYOC|POLYM|RGDI|RHAB)/, 5);
  });

  it('Valider les fonctionnalités du tableau - Tri EP', () => {
    cy.sortTableAndIntercept('EP', 1);
    cy.validateTableFirstRow(/(CHUSJ|CHUS|CUSM)/, 6);
    cy.sortTableAndIntercept('EP', 1);
    cy.validateTableFirstRow(/(CHUSJ|CHUS|CUSM)/, 6);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndIntercept('EP', 1);
    cy.sortTableAndIntercept('Analyse', 1);
    cy.validateTableFirstRow(/\d{7}/, 0);
  });
});
