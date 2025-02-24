/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'), false);
  cy.logout();
});

describe('Affichage de la page Logout', () => {
  it('Vérifier le texte affiché', () => {
    cy.contains('Prescriptions et requêtes').should('exist');
    cy.contains('Le Centre québécois de génomique clinique (CQGC) met à disposition un portail web de prescription d’analyses cliniques de séquençage à haut débit (NGS) pour le diagnostic moléculaire aux médecins prescripteurs de la province.').should('exist');
    cy.contains('Connexion').should('exist');
    cy.contains('Créer un compte').should('exist');
    cy.contains('EN').should('not.exist');
  });

  it('Vérifier les images des partenaires', () => {
    cy.get('[class*="Landing_logoRow"]').eq(0).find('svg').its('length').should('eq', 4);
    cy.get('[class*="Landing_logoRow"]').eq(1).find('svg').its('length').should('eq', 2);
    cy.get('[class*="Landing_logoRow"]').eq(1).find('img').its('length').should('eq', 2);
    cy.get('[class*="Landing_sssLogoContainer"] svg').its('length').should('eq', 1);
  });
});
