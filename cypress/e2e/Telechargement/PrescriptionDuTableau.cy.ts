/// <reference types="cypress"/>
import { getDateTime, oneMinute } from '../../support/utils';

const { strDate } = getDateTime();

beforeEach(() => {
  cy.removeFilesFromFolder(Cypress.config('downloadsFolder'));

  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  cy.visitHomePage();
  cy.resetColumns(0);

  cy.get('tr[class*="ant-table-row"]').eq(0).find('[class*="ant-table-cell"]').eq(10).find('button').clickAndWait({force: true});
  cy.wait(2000);
  cy.waitUntilFile(oneMinute);
});

describe('Télécharger la prescription du tableau', () => {
  it('Valider le nom du fichier', () => {
    cy.validateFileName('*_'+strDate+'T*.pdf');
  });

  it('Valider le contenu du fichier', () => {
    cy.validatePdfFileContent('DownloadPrescriptionDuTableau.json');
  });
});
