/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
});

describe('Page des prescriptions - Colonnes du tableau des prescriptions', () => {

  beforeEach(() => {
    cy.visitHomePage();
  });

  it('Valider l\'affichage (par défaut/optionnel) et l\'ordre des colonnes', () => {
    cy.get('thead[class="ant-table-thead"]').eq(0)
      .find('th[class*="ant-table-cell"]').eq(0)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Prescription').should('exist');
  
    cy.get('thead[class="ant-table-thead"]').eq(0)
      .find('th[class*="ant-table-cell"]').eq(1)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Patient').should('exist');

    cy.get('thead[class="ant-table-thead"]').eq(0)
      .find('th[class*="ant-table-cell"]').eq(2)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Priorité').should('exist');

    cy.get('thead[class="ant-table-thead"]').eq(0)
      .find('th[class*="ant-table-cell"]').eq(3)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Statut').should('exist');

    cy.get('thead[class="ant-table-thead"]').eq(0)
      .find('th[class*="ant-table-cell"]').eq(4)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Créée le').should('exist');

    cy.get('thead[class="ant-table-thead"]').eq(0)
      .find('th[class*="ant-table-cell"]').eq(5)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('Analyse').should('exist');

    cy.get('thead[class="ant-table-thead"]').eq(0)
      .find('th[class*="ant-table-cell"]').eq(6)
      .should('have.class', 'ant-table-column-has-sorters')
      .contains('EP').should('exist');

    cy.get('thead[class="ant-table-thead"]').eq(0)
      .find('th[class*="ant-table-cell"]').eq(7)
      .should('have.css', 'text-align', 'center');
  });
});
