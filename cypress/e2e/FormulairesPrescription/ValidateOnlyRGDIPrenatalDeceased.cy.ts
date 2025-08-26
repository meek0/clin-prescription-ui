/* eslint-disable no-loss-of-precision */
import { Step0 } from '../../pom/pages/Formulaire/Step0';
import { Step1 } from '../../pom/pages/Formulaire/Step1';
import { Step2 } from '../../pom/pages/Formulaire/Step2';
import { Step3 } from '../../pom/pages/Formulaire/Step3';
import { Step4 } from '../../pom/pages/Formulaire/Step4';
import { Step5 } from '../../pom/pages/Formulaire/Step5';
import { Step6 } from '../../pom/pages/Formulaire/Step6';
import { StepProject } from '../../pom/pages/Formulaire/StepProject';
import { StepSubmission } from '../../pom/pages/Formulaire/StepSubmission';
import { oneMinute } from '../../support/utils';
import { generateRandomJhn, generateRandomMrn } from '../../utils/random';

describe('Formulaires de prescription', () => {
  beforeEach(() => {
    cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  
    cy.visit('/');
    cy.waitWhileSpin(oneMinute);
    cy.get('[data-cy="CreateNewPrescription"]').should('exist');
  });

  it('Valider une prescription RGDI (prenatal deceased)', () => {
    // Choix de l'analyse
    Step0.actions.createNewPrescription();
    Step0.actions.selectAnalysis('RGDI');
    Step0.actions.clickStart();

    // Identification du patient
    const randomMrn = generateRandomMrn();
    Step1.actions.selectEp('CHUSJ');
    Step1.actions.enterMrn(randomMrn);
    Step1.actions.clickSearchMrn();
    Step1.actions.enterJhn(generateRandomJhn(true/*isFemale*/));
    Step1.actions.clickSearchJhn();
    Step1.actions.enterLastName('RGDI');
    Step1.actions.enterFirstName('ValidateOnly');
    Step1.actions.checkPrenatalDiagnosis();
    Step1.actions.checkFetusSex('male');
    Step1.actions.checkGestationalAge('deceased');
    Step1.actions.clickNext();

    // Signes cliniques
    Step2.actions.checkFirstClinicalSign();
    Step2.actions.selectAntenatalAge(0);
    Step2.actions.clickAddObservedSign();
    Step2.actions.typeAndSelectClinicalSign('111', 0);
    Step2.actions.selectAntenatalAge(1);
    Step2.actions.clickAddUnobservedSign();
    Step2.actions.typeAndSelectClinicalSign('111', 1);
    Step2.actions.enterClinicalComment('Comment for proband');
    Step2.actions.clickNext();

    // Examens paracliniques
    Step3.actions.checkParaclinicalExam(0, 'normal');
    Step3.actions.checkParaclinicalExam(1, 'abnormal');
    Step3.actions.selectFirstExplanation();
    Step3.actions.enterOtherExams('Other exams');
    Step3.actions.clickNext();

    // Histoire et hypothèse diagnostique
    Step4.actions.checkFamilyHistory();
    Step4.actions.enterHealthCondition(0, 'Condition');
    Step4.actions.selectParentalLink(0, 'father');
    Step4.actions.checkConsanguinity('no');
    Step4.actions.selectEthnicities();
    Step4.actions.enterDiagnosticHypothesis('Hypothesis');
    Step4.actions.clickNext();

    // Informations de la mère
    Step5.actions.checkStatus('now');
    Step5.actions.checkAffected('affected');
    Step5.actions.clickAddObservedSign();
    Step5.actions.typeAndSelectClinicalSign('222', 0);
    Step5.actions.selectChildhoodAge(0);
    Step5.actions.clickAddUnobservedSign();
    Step5.actions.typeAndSelectClinicalSign('222', 1);
    Step5.actions.enterClinicalComment('Comment for mother');
    Step5.actions.clickNext();

    // Informations du père
    const randomMrnFather = generateRandomMrn();
    Step6.actions.checkStatus('now');
    Step6.actions.checkEp('CHUSJ');
    Step6.actions.enterMrn(randomMrnFather);
    Step6.actions.clickSearchMrn();
    Step6.actions.enterJhn(generateRandomJhn());
    Step6.actions.clickSearchJhn();
    Step6.actions.enterLastName('RGDI');
    Step6.actions.enterFirstName('ValidateOnly Father');
    Step6.actions.checkAffected('affected');
    Step6.actions.clickAddObservedSign();
    Step6.actions.typeAndSelectClinicalSign('333', 0);
    Step6.actions.selectYoungAdultAge(0);
    Step6.actions.clickAddUnobservedSign();
    Step6.actions.typeAndSelectClinicalSign('333', 1);
    Step6.actions.enterClinicalComment('Comment for father');
    Step6.actions.clickNext();
    
    // Projet de recherche
    StepProject.actions.clickNext();

    // Soumission
    StepSubmission.actions.clickSubmitWithValidateOnly();
  });
});