/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.visit('/');
});

describe('Affichage de la page Landing', () => {
  it('Vérifier le texte affiché', () => {
    cy.contains('Prescriptions et requêtes').should('exist', {timeout: 20*1000});
    cy.contains('Le Centre québécois de génomique clinique (CQGC) met à disposition un portail web de prescription d’analyses cliniques de séquençage à haut débit (NGS) pour le diagnostic moléculaire aux médecins prescripteurs de la province.').should('exist', {timeout: 20*1000});
    cy.contains('Connexion').should('exist', {timeout: 20*1000});
    cy.contains('Créer un compte').should('exist', {timeout: 20*1000});
    cy.contains('EN').should('not.exist', {timeout: 20*1000});
  });

  it('Vérifier les images des partenaires', () => {
    cy.get('[class*="Landing_logoRow"]').eq(0).find('svg').its('length').should('eq', 4);
    cy.get('[class*="Landing_logoRow"]').eq(1).find('svg').its('length').should('eq', 2);
    cy.get('[class*="Landing_logoRow"]').eq(1).find('img').its('length').should('eq', 2);
    cy.get('[class*="Landing_sssLogoContainer"]').find('svg').its('length').should('eq', 1);
  });
});
