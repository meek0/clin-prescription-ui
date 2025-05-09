/// <reference types="cypress"/>
import '../../support/commands';
import { oneMinute } from '../../support/utils';

beforeEach(() => {
  cy.visit('/');
  cy.waitWhileSpin(oneMinute);
  cy.get('button[class*="ant-btn-primary ant-btn-lg"]').should('exist');
  cy.get('button[class*="ant-btn-primary ant-btn-lg"]').clickAndWait();
});

describe('Affichage de la page Login', () => {
  it('Vérifier le texte affiché', () => {
    cy.get('[id="social-CQGC"]').clickAndWait();
    cy.waitWhileSpin(oneMinute);

    cy.contains('Courriel (.med@ssss.gouv.qc.ca)').should('exist');
    cy.contains('Mot de passe').should('exist');
    cy.contains('Mot de passe oublié ?').should('exist');
    cy.contains('Soumettre').should('exist');
    cy.contains('Annuler').should('exist');
    cy.contains('EN').should('not.exist');
  });
});
