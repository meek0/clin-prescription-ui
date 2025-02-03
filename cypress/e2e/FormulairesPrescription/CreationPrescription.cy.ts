/// <reference types="cypress"/>
import '../../support/commands';
import { oneMinute } from '../../support/utils';

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
  cy.waitWhileSpin(oneMinute);
  cy.get('[data-cy="CreateNewPrescription"]').should('exist');
});

describe('Formulaires de prescription - Création', () => {
  it('MMG - Solo', () => {
    const strMRN = mrnValues[Math.floor(Math.random() * mrnValues.length)];

    cy.get('[data-cy="CreateNewPrescription"] [data-cy="ActionButton"]').clickAndWait({force: true});

    // Choix de l'analyse
    cy.get('[data-cy="SelectAnalysis"]').clickAndWait();
    cy.get('[data-cy="SelectOptionMMG"]').clickAndWait({force: true});
    cy.get('[data-cy="SelectAnalysis"] input').should('have.attr', 'aria-expanded', 'false');
    cy.get('[data-cy="AnalysisModal"] button[class*="ant-btn-primary"]').clickAndWait({force: true});

    // Identification du patient
    cy.get('input[type="radio"][value="CHUS"]').clickAndWait({force: true});
    cy.get('[data-cy="InputMRN"]').type(strMRN, {force: true});
    cy.intercept('GET', `**${strMRN}`).as('getMRN');
    cy.get('[data-cy="InputMRN"]').parent().find('[type="button"]').clickAndWait({force: true});
    cy.wait('@getMRN');
    cy.get('[data-cy="NextButton"]').clickAndWait({force: true});

    // Signes cliniques
    cy.get('[data-cy="ObservedHP:0001638"]').check({force: true});
    cy.get('[data-cy="SelectAge"]').clickAndWait();
    cy.get('[data-cy="SelectOptionHP:0003577"]').clickAndWait({force: true});
    cy.get('[data-cy="NextButton"]').clickAndWait({force: true});

    // Examens paracliniques
    cy.get('[data-cy="NextButton"]').clickAndWait({force: true});

    // Histoire et hypothèse diagnostique
    cy.get('[data-cy="InputHypothesis"]').type('Cypress', {force: true});
    cy.get('[data-cy="NextButton"]').clickAndWait({force: true});

    // Soumission
    cy.intercept('POST', '**/form').as('getPOSTform');
    cy.get('[data-cy="SubmitButton"]').clickAndWait({force: true});
    cy.wait('@getPOSTform');
    
    // Confirmation de la soumission
    cy.clickAndIntercept('[class*="SaveModal"] [href*="/prescription/entity/"]', 'POST', '**/$graphql*', 3);

    // Page de la prescription
    cy.get('[data-cy="PatientCard"]').contains(strMRN).should('exist');
  });
});