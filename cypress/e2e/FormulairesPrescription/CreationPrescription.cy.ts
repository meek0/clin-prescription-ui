/// <reference types="cypress"/>
import '../../support/commands';

const mrnValues = [
  'MRN-283804',
  'MRN-283805',
  'MRN-283806',
  'MRN-283807',
  'MRN-283808',
  'MRN-283809'
];

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));

  cy.visit('/');
  cy.get('[data-cy="CreateNewPrescription"]').should('exist', {timeout: 20*1000});
});

describe('Formulaires de prescription - Création', () => {
  it('MMG - Solo', () => {
    const strMRN = mrnValues[Math.floor(Math.random() * mrnValues.length)];

    cy.get('[data-cy="CreateNewPrescription"]').find('[data-cy="ActionButton"]').click({force: true});

    // Choix de l'analyse
    cy.get('[data-cy="SelectAnalysis"]').click();
    cy.get('[data-cy="SelectOptionMMG"]').click({force: true});
    cy.get('[data-cy="SelectAnalysis"]').find('input').should('have.attr', 'aria-expanded', 'false');
    cy.get('[data-cy="AnalysisModal"]').find('button[class*="ant-btn-primary"]').click({force: true});

    // Identification du patient
    cy.get('input[type="radio"][value="CHUS"]', {timeout: 60 * 1000}).click({force: true});
    cy.get('[data-cy="InputMRN"]').type(strMRN, {force: true});
    cy.intercept('GET', `**${strMRN}`).as('getMRN');
    cy.get('[data-cy="InputMRN"]').parent().find('[type="button"]').click({force: true});
    cy.wait('@getMRN', {timeout: 5000});
    cy.get('[data-cy="NextButton"]').click({force: true});

    // Signes cliniques
    cy.get('[data-cy="ObservedHP:0001638"]').check({force: true});
    cy.get('[data-cy="SelectAge"]').click();
    cy.get('[data-cy="SelectOptionHP:0003577"]').click({force: true});
    cy.get('[data-cy="NextButton"]').click({force: true});

    // Examens paracliniques
    cy.get('[data-cy="NextButton"]').click({force: true});

    // Histoire et hypothèse diagnostique
    cy.get('[data-cy="InputHypothesis"]').type('Cypress', {force: true});
    cy.get('[data-cy="NextButton"]').click({force: true});

    // Soumission
    cy.intercept('POST', '**/form').as('getPOSTform');
    cy.get('[data-cy="NextButton"]').click({force: true});
    cy.wait('@getPOSTform', {timeout: 10 * 1000});
    
    // Confirmation de la soumission
    cy.intercept('POST', '**/$graphql*').as('getPOSTgraphql');
    cy.get('[class*="successModal"]').find('[href*="/prescription/entity/"]').click({force: true});
    cy.wait('@getPOSTgraphql', {timeout: 10 * 1000});
    cy.wait('@getPOSTgraphql', {timeout: 10 * 1000});
    cy.wait('@getPOSTgraphql', {timeout: 10 * 1000});
    cy.wait('@getPOSTgraphql', {timeout: 10 * 1000});

    // Page de la prescription
    cy.get('body').contains(strMRN).should('exist');
  });
});