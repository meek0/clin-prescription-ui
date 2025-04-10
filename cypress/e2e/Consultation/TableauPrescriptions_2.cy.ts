/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));

  cy.visitHomePage();
  cy.resetColumns(0);
  cy.showColumn('Patient ID', 0);
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
    cy.validateTableFirstRow(/^(?!-).*$/, 2);
    cy.sortTableAndIntercept('Patient', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 2);
  });

  it('Valider les fonctionnalités du tableau - Tri Priorité', () => {
    cy.sortTableAndIntercept('Priorité', 1);
    cy.validateTableFirstRow(/^(-|(?!-).*)$/, 3);
    cy.sortTableAndIntercept('Priorité', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 3);
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
    cy.validateTableFirstRow(/(DYSM|EXTUM|HYPM|MITN|MMG|MYAC|MYOC|POLYM|RGDI|RHAB)/, 6);
    cy.sortTableAndIntercept('Analyse', 1);
    cy.validateTableFirstRow(/(DYSM|EXTUM|HYPM|MITN|MMG|MYAC|MYOC|POLYM|RGDI|RHAB)/, 6);
  });

  it('Valider les fonctionnalités du tableau - Tri EP', () => {
    cy.sortTableAndIntercept('EP', 1);
    cy.validateTableFirstRow(/(CHUSJ|CHUS|CUSM)/, 7);
    cy.sortTableAndIntercept('EP', 1);
    cy.validateTableFirstRow(/(CHUSJ|CHUS|CUSM)/, 7);
  });

  it('Valider les fonctionnalités du tableau - Tri RAMQ', () => {
    cy.sortTableAndIntercept('Patient', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 8);
    cy.sortTableAndIntercept('Patient', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 8);
  });

  it('Valider les fonctionnalités du tableau - Tri Dossier', () => {
    cy.sortTableAndIntercept('Patient', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 9);
    cy.sortTableAndIntercept('Patient', 1);
    cy.validateTableFirstRow(/^(?!-).*$/, 9);
  });

  it('Valider les fonctionnalités du tableau - Tri multiple', () => {
    cy.sortTableAndIntercept('Analyse', 1);
    cy.sortTableAndIntercept('Analyse', 1);
    cy.sortTableAndIntercept('Statut', 1);
    cy.validateTableFirstRow('Approuvée', 4);
  });
});
