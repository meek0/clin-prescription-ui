/// <reference types="cypress"/>
import '../../support/commands';

import { oneMinute } from '../../support/utils';

let epCHUSJ_ldmCHUSJ: any;

beforeEach(() => {
  epCHUSJ_ldmCHUSJ = Cypress.env('globalData').presc_EP_CHUSJ_LDM_CHUSJ;
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
});

describe('Affichage de toutes les pages et modals', () => {
  it('Accueil', () => {
    cy.visit('/');
    cy.waitWhileSpin(oneMinute);
    cy.contains('Beta').should('exist');
    cy.contains('Créer une nouvelle prescription').should('exist');
    cy.contains('Ajouter un parent à une prescription existante').should('exist');
    cy.contains('Mes prescriptions').should('exist');
    cy.get('[data-cy="ZeppelinLink"]').should('have.attr', 'href', Cypress.env('zeppelin_URL'));
    cy.get('[data-cy="FhirLink"]').should('have.attr', 'href', Cypress.env('fhir_URL'));
  });

  it('Prescription', () => {
    cy.visitPrescriptionEntityPage(epCHUSJ_ldmCHUSJ.prescriptionId);

    cy.get('[class*="Header"]').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
    cy.contains('Identifiant').should('exist');
    cy.contains('Priorité').should('exist');
    cy.contains('Statut').should('exist');
    cy.contains('Approuvée').should('exist');
    cy.contains('Analyse demandée').should('exist');
    cy.contains('Panel en réflexe').should('exist');
    cy.contains('Créée le').should('exist');
    cy.contains('Médecin prescripteur').should('exist');
    cy.contains('Établissement prescripteur').should('exist');
    cy.contains('LDM').should('exist');
    cy.contains('Patient').should('exist');
    cy.contains('Dossier').should('exist');
    cy.contains('RAMQ').should('exist');
    cy.contains('Nom').should('exist');
    cy.contains('Date de naissance').should('exist');
    cy.contains('Sexe').should('exist');
    cy.contains('Information clinique').should('exist');
    cy.contains('Historique familiale').should('exist');
    cy.contains('Présence de consanguinité').should('exist');
    cy.contains('Ethnicité').should('exist');
    cy.contains('Hypothèse diagnostique').should('exist');
    cy.contains('Requête').should('exist');
    cy.contains('Type').should('exist');
    cy.contains('Statut').should('exist');
    cy.contains('Créée le').should('exist');
    cy.contains('Requérant').should('exist');
    cy.contains('Échantillon').should('exist');
    cy.contains('Mère').should('exist');
    cy.contains('Père').should('exist');
    cy.contains('Statut clinique').should('exist');
  });
});
