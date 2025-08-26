/// <reference types="cypress"/>
import { Step0 } from '../../pom/pages/Formulaire/Step0';
import { Step1 } from '../../pom/pages/Formulaire/Step1';
import { Step2 } from '../../pom/pages/Formulaire/Step2';
import { Step3 } from '../../pom/pages/Formulaire/Step3';
import { Step4 } from '../../pom/pages/Formulaire/Step4';
import { StepProject } from '../../pom/pages/Formulaire/StepProject';
import { StepSubmission } from '../../pom/pages/Formulaire/StepSubmission';
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

    Step0.actions.createNewPrescription();

    // Choix de l'analyse
    Step0.actions.selectAnalysis('MMG');
    Step0.actions.clickStart();

    // Identification du patient
    Step1.actions.selectEp('CHUS');
    Step1.actions.enterMrn(strMRN);
    Step1.actions.clickSearchMrn();
    Step1.actions.clickNext();

    // Signes cliniques
    Step2.actions.checkFirstClinicalSign();
    Step2.actions.clickNext();

    // Examens paracliniques
    Step3.actions.clickNext();

    // Histoire et hypothèse diagnostique
    Step4.actions.enterDiagnosticHypothesis('Cypress');
    Step4.actions.clickNext();

    // Projet de recherche
    StepProject.actions.clickNext();

    // Soumission
    StepSubmission.actions.clickSubmit();

    // Afficher les erreurs s'il y en a
    cy.get('[class*="SaveModal"]').invoke('text').then((invokeText) => {
      if (invokeText.includes('error info')) {
        cy.get('[class*="SaveModal"] [class*="ant-collapse-expand-icon"]').clickAndWait({force: true});
      };
    });

    // Confirmation de la soumission
    cy.clickAndIntercept('[class*="SaveModal"] [href*="/prescription/entity/"]', 'GET', '**/api/v1/analysis/*', 1,);

    // Page de la prescription
    cy.get('[data-cy="PatientCard"]').contains(strMRN).should('exist');
  });
});