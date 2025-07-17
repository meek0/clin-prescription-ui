/* eslint-disable no-loss-of-precision */
import { Etape0 } from '../../pom/pages/Formulaire/Etape0';
import { Etape1 } from '../../pom/pages/Formulaire/Etape1';
import { Etape2 } from '../../pom/pages/Formulaire/Etape2';
import { Etape3 } from '../../pom/pages/Formulaire/Etape3';
import { Etape4 } from '../../pom/pages/Formulaire/Etape4';
import { Etape5 } from '../../pom/pages/Formulaire/Etape5';
import { Etape6 } from '../../pom/pages/Formulaire/Etape6';
import { EtapeSoumission } from '../../pom/pages/Formulaire/EtapeSoumission';
import { oneMinute } from '../../support/utils';
import { generateRandomRamq, generateRandomDossier } from '../../utils/random';

describe('Formulaires de prescription', () => {
  beforeEach(() => {
    cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  
    cy.visit('/');
    cy.waitWhileSpin(oneMinute);
    cy.get('[data-cy="CreateNewPrescription"]').should('exist');
  });

  it('Valider une prescription RGDI', () => {
    Etape0.actions.nouvellePrescription();
    Etape0.actions.selectPrescriptionRGDI();
    Etape0.actions.clickCommencer();

    const randomDossier = generateRandomDossier();
    Etape1.actions.checkChusj();
    Etape1.actions.enterDossier(randomDossier);
    Etape1.actions.clickLoupeDossier();
    Etape1.actions.enterRamq(generateRandomRamq());
    Etape1.actions.clickLoupeRamq();
    Etape1.actions.enterNom('RGDI');
    Etape1.actions.enterPrenom('ValidateOnly');
    Etape1.actions.clickSuivant();

    Etape2.actions.checkPremierSigneClinique();
    Etape2.actions.selectAgeAntenatale(0);
    Etape2.actions.clickAjouterSigneObserve();
    Etape2.actions.typeEtSelectSigneClinique('111', 0);
    Etape2.actions.selectAgeAntenatale(1);
    Etape2.actions.clickAjouterSigneNonObserve();
    Etape2.actions.typeEtSelectSigneClinique('111', 1);
    Etape2.actions.enterCommentaireClinique('Commentaire pour le proband');
    Etape2.actions.clickSuivant();

    Etape3.actions.checkExamenParaclinique(0, 'normal');
    Etape3.actions.checkExamenParaclinique(1, 'abnormal');
    Etape3.actions.selectPremiereExplication();
    Etape3.actions.enterAutresExamens('Autres examens');
    Etape3.actions.clickSuivant();

    Etape4.actions.checkHistoireFamiliale();
    Etape4.actions.enterConditionSante(0,'Condition');
    Etape4.actions.selectLienParental(0, 'pere');
    Etape4.actions.checkConsanguinite('no');
    Etape4.actions.selectEthnicites();
    Etape4.actions.enterHypotheseDiagnostique('Hypothèse');
    Etape4.actions.clickSuivant();

    const randomDossierMth = generateRandomDossier();
    Etape5.actions.checkStatus('now');
    Etape5.actions.checkChusj();
    Etape5.actions.enterDossier(randomDossierMth);
    Etape5.actions.clickLoupeDossier();
    Etape5.actions.enterRamq(generateRandomRamq());
    Etape5.actions.clickLoupeRamq();
    Etape5.actions.enterNom('RGDI');
    Etape5.actions.enterPrenom('ValidateOnly Mère');
    Etape5.actions.checkAtteint('affected');
    Etape5.actions.clickAjouterSigneObserve();
    Etape5.actions.typeEtSelectSigneClinique('222', 0);
    Etape5.actions.selectAgeEnfance(0);
    Etape5.actions.clickAjouterSigneNonObserve();
    Etape5.actions.typeEtSelectSigneClinique('222', 1);
    Etape5.actions.enterCommentaireClinique('Commentaire pour la mère');
    Etape5.actions.clickSuivant();

    const randomDossierFth = generateRandomDossier();
    Etape6.actions.checkStatus('now');
    Etape6.actions.checkChusj();
    Etape6.actions.enterDossier(randomDossierFth);
    Etape6.actions.clickLoupeDossier();
    Etape6.actions.enterRamq(generateRandomRamq());
    Etape6.actions.clickLoupeRamq();
    Etape6.actions.enterNom('RGDI');
    Etape6.actions.enterPrenom('ValidateOnly Père');
    Etape6.actions.checkAtteint('affected');
    Etape6.actions.clickAjouterSigneObserve();
    Etape6.actions.typeEtSelectSigneClinique('333', 0);
    Etape6.actions.selectAgeJeuneAdulte(0);
    Etape6.actions.clickAjouterSigneNonObserve();
    Etape6.actions.typeEtSelectSigneClinique('333', 1);
    Etape6.actions.enterCommentaireClinique('Commentaire pour le père');
    Etape6.actions.clickSuivant();

    EtapeSoumission.actions.clickSoumettreWithValidateOnly();
  });
});