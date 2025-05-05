/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));

  cy.visitHomePage();
  cy.resetColumns(0);
  cy.showColumn('Patient ID', 0);
});

describe('Page des prescriptions - Consultation du tableau des prescriptions', () => {
  it('Vérifier les informations affichées', () => {
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(1).contains(/\d{7}/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(2).contains(/^(?!-).*$/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(3).contains(/^(?!-).*$/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(4).contains('Soumise').should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(5).contains(/^\d{4}-\d{2}-\d{2}$/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(6).contains(/(DYSM|EXTUM|HYPM|MITN|MMG|MYAC|MYOC|POLYM|RGDI|RHAB)/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(7).contains(/(CHUSJ|CHUS|CUSM)/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(8).contains(/.+/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(9).contains(/.+/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(10).contains(/\d{7}/).should('exist');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(11).find('[class*="anticon-download"]').should('exist');
  });

  it('Valider les liens disponibles Lien Prescription', () => {
    cy.intercept('POST', '**/$graphql*').as('getPOSTgraphql');
    cy.get('tr[class*="ant-table-row"]').eq(0).find('[class="ant-table-cell"]').eq(1).find('a[href*="prescription"]').clickAndWait({force: true});
    cy.wait('@getPOSTgraphql');

    cy.contains('Identifiant').should('exist');
  });
});
