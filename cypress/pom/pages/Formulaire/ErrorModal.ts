/* eslint-disable @typescript-eslint/no-explicit-any */

const selectors = {
  buttonClose: '[class*="SaveModal"] button[class*="ant-btn-primary"]',
};

export const ErrorModal = {
  actions: {
    clickClose() {
      cy.get(selectors.buttonClose).clickAndWait({force: true});
    }
  },
};