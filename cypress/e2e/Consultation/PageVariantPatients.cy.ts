/// <reference types="Cypress" />
import '../../support/commands';

const epCHUSJ_ldmCHUSJ = JSON.parse(Cypress.env('presc_EP_CHUSJ_LDM_CHUSJ'));

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));

  cy.intercept('POST', '**/$graphql').as('getPOSTgraphql');
  cy.visitVariantEntityPage('10-113679881-CTT-C', 2);
  cy.wait('@getPOSTgraphql', {timeout: 5000});

  cy.get('body').find('div[id*="rc-tabs-0-tab-patients"]').click({force: true});
});

afterEach(() => {
  cy.logout();
});

describe('Page d\'un variant (onglet Patients)', () => {
  describe('Vérifier les informations affichées', () => {
    it('Des graphiques', () => {
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('path[opacity="1"]').eq(1).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('div[style*="pointer-events"]').invoke('text').then((invokeText) => {
        let orderFeminin  = 1;
        let orderMasculin = 2;

        if(invokeText.includes("Masculin")) {
          orderFeminin  = 2;
          orderMasculin = 1;
        };
          
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).contains('Sexe').should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('path[opacity="1"]').eq(0).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('div[style*="pointer-events"]').contains('Indéterminé').should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('div[style*="pointer-events"]').contains(/^1$/).should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('path[opacity="1"]').eq(orderMasculin).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('div[style*="pointer-events"]').contains('Masculin').should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('div[style*="pointer-events"]').contains(/^37$/).should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('path[opacity="1"]').eq(orderFeminin).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('div[style*="pointer-events"]').contains('Féminin').should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(0).find('div[style*="pointer-events"]').contains(/^36$/).should('exist');
      });

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('path[opacity="1"]').eq(0).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('div[style*="pointer-events"]').invoke('text').then((invokeText) => {
        let label0;
        let count0;

        if(invokeText.includes("RGDI")) {
          label0  = "RGDI";
          count0 = /^15$/;
        }
        else if(invokeText.includes("MYOC")) {
          label0  = "MYOC";
          count0 = /^24$/;
        }
        else {
          label0  = "HYPM";
          count0 = /^35$/;
        };

        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).contains('Analyse').should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('path[opacity="1"]').eq(0).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('div[style*="pointer-events"]').contains(label0).should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('div[style*="pointer-events"]').contains(count0).should('exist');
      });

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('path[opacity="1"]').eq(1).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('div[style*="pointer-events"]').invoke('text').then((invokeText) => {
        let label1;
        let count1;

        if(invokeText.includes("RGDI")) {
          label1  = "RGDI";
          count1 = /^15$/;
        }
        else if(invokeText.includes("MYOC")) {
          label1  = "MYOC";
          count1 = /^24$/;
        }
        else {
          label1  = "HYPM";
          count1 = /^35$/;
        };

        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('path[opacity="1"]').eq(1).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('div[style*="pointer-events"]').contains(label1).should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('div[style*="pointer-events"]').contains(count1).should('exist');
      });

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('path[opacity="1"]').eq(2).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('div[style*="pointer-events"]').invoke('text').then((invokeText) => {
        let label2;
        let count2;

        if(invokeText.includes("RGDI")) {
          label2  = "RGDI";
          count2 = /^15$/;
        }
        else if(invokeText.includes("MYOC")) {
          label2  = "MYOC";
          count2 = /^24$/;
        }
        else {
          label2  = "HYPM";
          count2 = /^35$/;
        };

        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('path[opacity="1"]').eq(2).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('div[style*="pointer-events"]').contains(label2).should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(1).find('div[style*="pointer-events"]').contains(count2).should('exist');
      });

        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(2).contains('Filtre (Dragen)').should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(2).find('path[opacity="1"]').eq(0).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(2).find('div[style*="pointer-events"]').contains('PASS').should('exist');
        cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(0).find('div[class*="ant-col"]').eq(2).find('div[style*="pointer-events"]').contains(/^74$/).should('exist');
    });
    
    it('Du tableau', () => {
      cy.get('body').find('span[class*="ant-select-selection-item"]').click({force: true});
      cy.get('body').find('div[class*="ant-select-item-option-content"]').contains('100').click({force: true});
      
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').contains(epCHUSJ_ldmCHUSJ.requestProbId).should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').contains('RGDI').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').contains(epCHUSJ_ldmCHUSJ.patientProbId).should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').contains('Masculin').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').contains('Atteint').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').contains('PASS').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').contains('1.07').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').find('td[class="ant-table-cell"]').eq(7).contains('187').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').find('td[class="ant-table-cell"]').eq(8).contains('187').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').contains('1.00').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').contains('447').should('exist');

      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').contains(epCHUSJ_ldmCHUSJ.requestMthId).should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').contains('RGDI').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').contains(epCHUSJ_ldmCHUSJ.patientMthId).should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').contains('Féminin').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').contains('Non atteint').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').contains('PASS').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').contains('1.07').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').find('td[class="ant-table-cell"]').eq(7).contains('190').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').find('td[class="ant-table-cell"]').eq(8).contains('190').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').contains('1.00').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientMthId+'"]').contains('447').should('exist');

      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains(epCHUSJ_ldmCHUSJ.requestFthId).should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains('RGDI').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains(epCHUSJ_ldmCHUSJ.patientFthId).should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains('Masculin').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains('Non atteint').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains('PASS').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains('1.07').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains('107').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains('215').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains('0.50').should('exist');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientFthId+'"]').contains('48').should('exist');
    });
  });
 
  describe('Valider les liens disponibles', () => {
    it('Lien de la requête', () => {
      cy.get('body').find('span[class*="ant-select-selection-item"]').click({force: true});
      cy.get('body').find('div[class*="ant-select-item-option-content"]').contains('100').click({force: true});

      cy.intercept('POST', '**/$graphql').as('getPOSTgraphql');
      cy.get('tr[data-row-key*="'+epCHUSJ_ldmCHUSJ.patientProbId+'"]').find('a[href*="prescription"]').eq(0).click({force: true});
      cy.wait('@getPOSTgraphql', {timeout: 20*1000});

      cy.contains('Prescription ID : '+epCHUSJ_ldmCHUSJ.prescriptionId).should('exist', {timeout: 20*1000});
    });
  });
  
  describe('Valider les fonctionnalités du tableau', () => {
    it('Les tris', () => {
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('Analyse').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('HYPM').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('Analyse').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('RGDI').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('Analyse').click({force: true});

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('QP').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('1.07').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('QP').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('1.07').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('QP').click({force: true});

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains(/^61$/).should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('261').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT').click({force: true});

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT+REF').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('136').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT+REF').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('319').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT+REF').click({force: true});

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT/(ALT+REF)').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('0.38').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT/(ALT+REF)').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('1.00').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT/(ALT+REF)').click({force: true});

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('QG').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains(/^44$/).should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('QG').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('447').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('QG').click({force: true});
    });

    it('Le tri multiple [CLIN-1664]', () => {
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT/(ALT+REF)').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT/(ALT+REF)').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').contains('ALT').click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('161').should('exist');
    });
  
    it('Les filtres', () => {
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').find('span[class*="ant-dropdown-trigger"]').eq(0).click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('li[data-menu-id*="RGDI"]').find('[type="checkbox"]').check({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-primary"]').last().click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('RGDI').should('exist');
      cy.get('div[class*="ProTableHeader"]').contains('15 Résultats').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').find('span[class*="ant-dropdown-trigger"]').eq(0).click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-link"]').last().click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-primary"]').last().click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('RGDI').should('not.exist');
      cy.get('div[class*="ProTableHeader"]').contains('15 Résultats').should('not.exist');

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').find('span[class*="ant-dropdown-trigger"]').eq(1).click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('li[data-menu-id*="unknown"]').find('[type="checkbox"]').check({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-primary"]').last().click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('Indéterminé').should('exist');
      cy.get('div[class*="ProTableHeader"]').contains('1 Résultats').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').find('span[class*="ant-dropdown-trigger"]').eq(1).click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-link"]').last().click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-primary"]').last().click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('Indéterminé').should('not.exist');
      cy.get('div[class*="ProTableHeader"]').contains('1 Résultats').should('not.exist');

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').find('span[class*="ant-dropdown-trigger"]').eq(2).click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('li[data-menu-id*="not_affected"]').find('[type="checkbox"]').check({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-primary"]').last().click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('Non atteint').should('exist');
      cy.get('div[class*="ProTableHeader"]').contains('5 Résultats').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').find('span[class*="ant-dropdown-trigger"]').eq(2).click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-link"]').last().click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-primary"]').last().click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('Non atteint').should('not.exist');
      cy.get('div[class*="ProTableHeader"]').contains('5 Résultats').should('not.exist');

      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').find('span[class*="ant-dropdown-trigger"]').eq(3).click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('li[data-menu-id*="PASS"]').find('[type="checkbox"]').check({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-primary"]').last().click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('PASS').should('exist');
      cy.get('div[class*="ProTableHeader"]').contains('de 74').should('exist');
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('thead[class="ant-table-thead"]').find('span[class*="ant-dropdown-trigger"]').eq(3).click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-link"]').last().click({force: true});
      cy.get('div[class="ant-table-filter-dropdown"]').find('button[class*="ant-btn-primary"]').last().click({force: true});
      cy.get('div[class*="ant-tabs-tabpane-active"]').find('div[class="ant-space-item"]').eq(1).find('tr[class*="ant-table-row"]').eq(0).contains('PASS').should('exist');
      cy.get('div[class*="ProTableHeader"]').contains('de 74').should('exist');
    });
  
    it('La pagination [CLIN-1662]', () => {
      cy.get('body').find('span[class*="ant-select-selection-item"]').click({force: true});
      cy.get('body').find('div[class*="ant-select-item-option-content"]').contains('100').click({force: true});
      cy.get('div[class*="ProTableHeader"]').contains('74 Résultats').should('exist');

      cy.get('body').find('span[class*="ant-select-selection-item"]').click({force: true});
      cy.get('body').find('div[class*="ant-select-item-option-content"]').contains('20').click({force: true});
      cy.get('div[class*="ProTableHeader"]').contains('Résultats 1 - 20 de 74').should('exist');

      cy.get('body').find('[class*="ant-pagination-item-2"]').click({force: true});
      cy.get('div[class*="ProTableHeader"]').contains('Résultats 21 - 40 de 74').should('exist');

      cy.get('body').find('[class*="anticon-right"]').click({force: true});
      cy.get('div[class*="ProTableHeader"]').contains('Résultats 41 - 60 de 74').should('exist');

      cy.get('body').find('[class*="anticon-left"]').click({force: true});
      cy.get('div[class*="ProTableHeader"]').contains('Résultats 21 - 40 de 74').should('exist');
    });
  });
});