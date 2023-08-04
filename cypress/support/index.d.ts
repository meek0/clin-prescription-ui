/// <reference types="Cypress" />
/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  interface Chainable {
    clickAndIntercept(selector: string, methodHTTP: string, routeMatcher: string, nbCalls: number): cy & CyEventEmitter;
    login(user: string, password: string): cy & CyEventEmitter;
    logout(): cy & CyEventEmitter;
    removeFilesFromFolder(folder: string): cy & CyEventEmitter;
    resetColumns(eq: number): cy & CyEventEmitter;
    typeAndIntercept(selector: string, text: string, methodHTTP: string, routeMatcher: string, nbCalls: number): cy & CyEventEmitter;
    visitAndIntercept(url: string, methodHTTP: string, routeMatcher: string, nbCalls: number): cy & CyEventEmitter;
    visitPrescriptionEntityPage(prescriptionId: string): cy & CyEventEmitter;
  }
}