/// <reference types="Cypress" />
import '../../support/commands';

const epCHUSJ_ldmCHUSJ = JSON.parse(Cypress.env('presc_EP_CHUSJ_LDM_CHUSJ'));

describe('Affichage de toutes les pages et modals', () => {

  beforeEach(() => {
    cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  });

  it('Accueil', () => {
    cy.visit('/');
    cy.contains('Beta').should('exist', {timeout: 20*1000});
    cy.contains('Créer une nouvelle prescription').should('exist', {timeout: 20*1000});
    cy.contains('Ajouter un parent à une prescription existante').should('exist', {timeout: 20*1000});
    cy.contains('Mes Prescriptions').should('exist', {timeout: 20*1000});
    cy.get('[data-cy="ZeppelinLink"]').should('have.attr', 'href', Cypress.env('zeppelin_URL'));
    cy.get('[data-cy="FhirLink"]').should('have.attr', 'href', Cypress.env('fhir_URL'));
  });
 
  it('Prescription', () => {
    cy.visitPrescriptionEntityPage(epCHUSJ_ldmCHUSJ.prescriptionId);

    cy.get('[class*="Header"]').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist', {timeout: 20*1000});
    cy.contains('Identifiant').should('exist', {timeout: 20*1000});
    cy.contains('Statut').should('exist', {timeout: 20*1000});
    cy.contains('Approuvée').should('exist', {timeout: 20*1000});
    cy.contains('Analyse demandée').should('exist', {timeout: 20*1000});
    cy.contains('Panel en réflexe').should('exist', {timeout: 20*1000});
    cy.contains('Créée le').should('exist', {timeout: 20*1000});
    cy.contains('Médecin prescripteur').should('exist', {timeout: 20*1000});
    cy.contains('Établissement prescripteur').should('exist', {timeout: 20*1000});
    cy.contains('LDM').should('exist', {timeout: 20*1000});
    cy.contains('Patient').should('exist', {timeout: 20*1000});
    cy.contains('Dossier').should('exist', {timeout: 20*1000});
    cy.contains('RAMQ').should('exist', {timeout: 20*1000});
    cy.contains('Nom').should('exist', {timeout: 20*1000});
    cy.contains('Date de naissance').should('exist', {timeout: 20*1000});
    cy.contains('Sexe').should('exist', {timeout: 20*1000});
    cy.contains('Information clinique').should('exist', {timeout: 20*1000});
    cy.contains('Historique familiale').should('exist', {timeout: 20*1000});
    cy.contains('Présence de consanguinité').should('exist', {timeout: 20*1000});
    cy.contains('Ethnicité').should('exist', {timeout: 20*1000});
    cy.contains('Hypothèse diagnostique').should('exist', {timeout: 20*1000});
    cy.contains('Requête').should('exist', {timeout: 20*1000});
    cy.contains('Code ministère').should('exist', {timeout: 20*1000});
    cy.contains('Statut').should('exist', {timeout: 20*1000});
    cy.contains('Créée le').should('exist', {timeout: 20*1000});
    cy.contains('Requérant').should('exist', {timeout: 20*1000});
    cy.contains('Échantillon').should('exist', {timeout: 20*1000});
    cy.contains('Mère').should('exist', {timeout: 20*1000});
    cy.contains('Père').should('exist', {timeout: 20*1000});
    cy.contains('Statut clinique').should('exist', {timeout: 20*1000});
  });
});
