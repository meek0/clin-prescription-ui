/// <reference types="cypress"/>
import { Replacement } from '../../support/commands';
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();
let epCHUSJ_ldmCHUSJ: any;

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));

  epCHUSJ_ldmCHUSJ = Cypress.env('globalData').presc_EP_CHUSJ_LDM_CHUSJ;
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  cy.visitPrescriptionEntityPage(epCHUSJ_ldmCHUSJ.prescriptionId);

  cy.get('[class*="Header_contentHeader"] button[class*="ant-btn-primary"]').clickAndWait({force: true});
  cy.wait(2000);
  cy.waitUntilFile(oneMinute);
});

describe('Télécharger la prescription', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName(epCHUSJ_ldmCHUSJ.prescriptionId+'_'+strDate+'T*.pdf');
  });

  it('Valider le contenu du fichier', () => {
    const replacements: Replacement[] = [
      { placeholder: '{{stampDate}}', value: epCHUSJ_ldmCHUSJ.stampDate.substring(0, 7) },
      { placeholder: '{{lastNameProb}}', value: epCHUSJ_ldmCHUSJ.lastNameProb },
      { placeholder: '{{firstNameProb}}', value: epCHUSJ_ldmCHUSJ.firstNameProb },
      { placeholder: '{{genderProb}}', value: epCHUSJ_ldmCHUSJ.genderProb },
      { placeholder: '{{birthdayProb}}', value: epCHUSJ_ldmCHUSJ.birthdayProb },
      { placeholder: '{{ramqProb}}', value: epCHUSJ_ldmCHUSJ.ramqProb },
      { placeholder: '{{mrnProb}}', value: epCHUSJ_ldmCHUSJ.mrnProb },
      { placeholder: '{{lastNameFth}}', value: epCHUSJ_ldmCHUSJ.lastNameFth },
      { placeholder: '{{firstNameFth}}', value: epCHUSJ_ldmCHUSJ.firstNameFth },
      { placeholder: '{{birthdayFth}}', value: epCHUSJ_ldmCHUSJ.birthdayFth },
      { placeholder: '{{ramqFth}}', value: epCHUSJ_ldmCHUSJ.ramqFth },
      { placeholder: '{{mrnFth}}', value: epCHUSJ_ldmCHUSJ.mrnFth },
      { placeholder: '{{statusFth}}', value: epCHUSJ_ldmCHUSJ.statusFth },
      { placeholder: '{{lastNameMth}}', value: epCHUSJ_ldmCHUSJ.lastNameMth },
      { placeholder: '{{firstNameMth}}', value: epCHUSJ_ldmCHUSJ.firstNameMth },
      { placeholder: '{{birthdayMth}}', value: epCHUSJ_ldmCHUSJ.birthdayMth },
      { placeholder: '{{ramqMth}}', value: epCHUSJ_ldmCHUSJ.ramqMth },
      { placeholder: '{{mrnMth}}', value: epCHUSJ_ldmCHUSJ.mrnMth },
      { placeholder: '{{statusMth}}', value: epCHUSJ_ldmCHUSJ.statusMth },
      { placeholder: '{{requestProbId}}', value: epCHUSJ_ldmCHUSJ.requestProbId },
      { placeholder: '{{prescriptionId}}', value: epCHUSJ_ldmCHUSJ.prescriptionId },
      { placeholder: '{{requestFthId}}', value: epCHUSJ_ldmCHUSJ.requestFthId },
      { placeholder: '{{requestMthId}}', value: epCHUSJ_ldmCHUSJ.requestMthId },
    ];

    cy.validatePdfFileContent('DownloadPrescription.json', replacements);
  });
});
