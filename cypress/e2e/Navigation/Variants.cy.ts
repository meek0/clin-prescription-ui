/// <reference types="Cypress" />
import { toNumber } from 'cypress/types/lodash';
import { exit } from 'process';
import '../../support/commands';

///////////////////////////////////
///// À exécuter avec firefox /////
///// cypress -b firefox      /////
///////////////////////////////////

/*
// cypress test code
cy.get('[data-testid="num"]').then(($span) => {
  // capture what num is right now
  const num1 = parseFloat($span.text())

  cy.get('button')
    .click()
    .then(() => {
      // now capture it again
      const num2 = parseFloat($span.text())

      // make sure it's what we expected
      expect(num2).to.eq(num1 + 1)
    })
})
*/

beforeEach(() => {
//  cy.log('Login');
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  cy.wait(2000);

  cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
  cy.visit('/snv/exploration?sharedFilterId=f9e443d7-35c8-4114-9e0c-7256bd9e4078');
  cy.wait('@getPOSTgraphql', {timeout: 20*1000});
  cy.wait('@getPOSTgraphql', {timeout: 20*1000});
  cy.wait('@getPOSTgraphql', {timeout: 20*1000});
  cy.wait('@getPOSTgraphql', {timeout: 20*1000});
  cy.wait('@getPOSTgraphql', {timeout: 20*1000});
  cy.wait('@getPOSTgraphql', {timeout: 20*1000});
  cy.wait('@getPOSTgraphql', {timeout: 20*1000});
  cy.wait('@getPOSTgraphql', {timeout: 20*1000});

  cy.resetColumns(0);
});

describe.skip('Affichage de tous les variants [!! Très long à exécuter !!]', () => {
  it('Par page de 100', () => {
    cy.get('body').find('span[class*="ant-select-selection-item"]').click({force: true});
    cy.get('body').find('div[class*="ant-select-item-option-content"]').contains('100').click({force: true});

    let nbpagesmax = 60;
    let cmp1 = "";
    let cmp2 = "";
    let i = 1;

    while (i <= nbpagesmax) {
      cy.log('Itération: '+i.toString()+'/'+nbpagesmax.toString());
      expect(i).to.lte(nbpagesmax);
      cy.get('body').find('tr[class*="ant-table-row"]').eq(0).find('td[class*="ant-table-cell"]').eq(0).invoke('text').then((text1) => {
        cy.get('div[class*=ant-spin-blur]', {timeout: 30*1000}).should('not.be.exist', {timeout: 30*1000});
        cy.get('body').find('button[type="button"]').contains('Suivant').click({force: true});
        cy.get('div[class*=ant-spin-blur]', {timeout: 30*1000}).should('not.be.exist', {timeout: 30*1000});
        cy.get('body').find('tr[class*="ant-table-row"]').eq(0).find('td[class*="ant-table-cell"]').eq(0).invoke('text').should((text2) => {
          cmp1 = text1;
          cmp2 = text2;
//          if (i <= nbpagesmax) {
            expect(text1).not.to.eq(text2);
//          };
        });
        cy.log(cmp1+' vs. '+cmp2);
      });
      i++; 
    };
  });
/*
  it('Par page de 100', () => {
    cy.get('body').find('span[class*="ant-select-selection-item"]').click({force: true});
    cy.get('body').find('div[class*="ant-select-item-option-content"]').contains('100').click({force: true});

    let nbpagesmax = 200;
    let i = 1;

    while (i <= nbpagesmax) {
      cy.log('i :'+i.toString());
      cy.get('body').find('tr[class*="ant-table-row"]').eq(0).find('td[class*="ant-table-cell"]').eq(0).invoke('text').then((text1) => {
        cy.get('div[class*=ant-spin-blur]').should('not.be.exist', {timeout: 60*1000});
        cy.get('body').find('button[type="button"]').contains('Suivant').click({force: true});
        cy.get('div[class*=ant-spin-blur]').should('not.be.exist', {timeout: 60*1000});
        cy.get('body').find('tr[class*="ant-table-row"]').eq(0).find('td[class*="ant-table-cell"]').eq(0).invoke('text').should((text2) => {

          expect(text1).not.to.eq(text2);

          cy.log(text1+' vs. '+text2);
        });
      });

      cy.get('div[class*="Pagination"]').find('button[type="button"]').eq(2).first().then(($buttonNext) => {
        if ($buttonNext.is(":disabled")) {
          cy.log('Button Disabled');
          expect(false);
        };
      });
    i++; 
    };
  });*/
});