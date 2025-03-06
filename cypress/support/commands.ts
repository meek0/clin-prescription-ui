/// <reference types="cypress"/>
import { oneMinute } from '../support/utils';

export interface Replacement {
  placeholder: string;
  value: string;
}

Cypress.Commands.add('clickAndIntercept', (selector: string, methodHTTP: string, routeMatcher: string, nbCalls: number) => {
  cy.intercept(methodHTTP, routeMatcher).as('getRouteMatcher');

  cy.get(selector).clickAndWait({force: true});

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getRouteMatcher');
  };
});

Cypress.Commands.add('clickAndWait', { prevSubject: 'element' }, (subject, options) => {
  cy.wrap(subject).click(options);
  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('login', (user: string, password: string, restoreSession: boolean = true) => {
  const strUserSession = restoreSession ? user : Math.random();
  cy.session([strUserSession], () => {
    cy.visit('/');
    cy.waitWhileSpin(oneMinute);
    cy.get('button[class*="ant-btn-primary ant-btn-lg"]').should('exist');
    cy.get('button[class*="ant-btn-primary ant-btn-lg"]').clickAndWait();

    cy.get('input[id="username"]').should('exist');

    cy.get('input[id="username"]').type(user);
    cy.get('input[id="password"]').type(password, {log: false});
    cy.get('button[type="submit"]').clickAndWait();
  });
});

Cypress.Commands.add('logout', () => {
    cy.visit('/');
    cy.waitWhileSpin(oneMinute);

    cy.get('div').then(($div) => {
        if ($div.hasClass('App')) {
            cy.get('span[class="anticon anticon-down"]').clickAndWait({force: true});
            cy.get('[data-menu-id*="logout"]').clickAndWait({force: true});
        };
    });

  cy.exec('npm cache clear --force');
  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('removeFilesFromFolder', (folder: string) => {
  cy.exec(`/bin/rm ${folder}/*`, {failOnNonZeroExit: false});
});

Cypress.Commands.add('resetColumns', (eq: number) => {
  cy.get('svg[data-icon="setting"]').eq(eq).clickAndWait({force: true});
  cy.waitWhileSpin(oneMinute);
  cy.get('button[class*="ProTablePopoverColumnResetBtn"]').eq(eq).then(($button) => {
    cy.wrap($button).clickAndWait({force: true});
    cy.waitWhileSpin(oneMinute);
    cy.wrap($button).clickAndWait({force: true});
    cy.waitWhileSpin(oneMinute);
  });
  
  cy.get('button[class*="ProTablePopoverColumnResetBtn"]').eq(eq).should('be.disabled', {timeout: 20*1000});
  cy.get('svg[data-icon="setting"]').eq(eq).clickAndWait({force: true});
  cy.get('div[class*="Header_ProTableHeader"]').clickAndWait({force: true, multiple: true});
});

Cypress.Commands.add('showColumn', (column: string|RegExp, eq: number) => {
  cy.intercept('PUT', '**/user').as('getPOSTuser');

  cy.get('div[class="ant-popover-inner"]').eq(eq).find('div[class="ant-space-item"]').contains(column).find('[type="checkbox"]').check({force: true});
  cy.wait('@getPOSTuser', {timeout: oneMinute});
  cy.get('div[class*="Header_ProTableHeader"]').clickAndWait({force: true, multiple: true});
  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('sortTableAndIntercept', (column: string|RegExp, nbCalls: number, eq: number = 0) => {
  cy.intercept('POST', '**/graphql').as('getPOSTgraphql');

  cy.get('thead[class="ant-table-thead"]').eq(eq).contains(column).clickAndWait({force: true});

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getPOSTgraphql');
  };
});

Cypress.Commands.add('typeAndIntercept', (selector: string, text: string, methodHTTP: string, routeMatcher: string, nbCalls: number) => {
  cy.intercept(methodHTTP, routeMatcher).as('getRouteMatcher');

  cy.get(selector).type(text, {force: true});
  cy.waitWhileSpin(oneMinute);

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getRouteMatcher');
  };
});

Cypress.Commands.add('validateFileName', (namePattern: string) => {
  cy.exec(`/bin/ls ${Cypress.config('downloadsFolder')}/`+namePattern).then((result) => {
    const filename = result.stdout.trim();
    cy.readFile(`${filename}`).should('exist');
  });
});

Cypress.Commands.add('validatePdfFileContent', (fixture: string, replacements?: Replacement[]) => {
  const arrReplacements = replacements !== undefined ? replacements : [];
  cy.fixture(fixture).then((expectedData) => {
    cy.exec(`/bin/ls ${Cypress.config('downloadsFolder')}/*`).then((result) => {
      const filename = result.stdout.trim();
      cy.task('extractTextFromPDF', filename).then((file) => {
        let fileWithData = typeof file === 'string' ? file : '';
        arrReplacements.forEach((replacement) => {
          fileWithData = fileWithData.replace(replacement.placeholder, replacement.value);
        });
        expectedData.content.forEach((value: any) => {
          let valueWithData = value
          arrReplacements.forEach((replacement) => {
            valueWithData = valueWithData.replace(replacement.placeholder, replacement.value);
          });
          assert.include(fileWithData, valueWithData);
        });
      });
    });
  });
});

Cypress.Commands.add('validateTableFirstRow', (expectedValue: string|RegExp, eq: number, selector: string = '') => {
  cy.waitWhileSpin(oneMinute);
  cy.wait(3000);
  cy.get(selector+' tr[class*="ant-table-row"]').eq(0)
    .then(($firstRow) => {
      cy.wrap($firstRow).find('td').eq(eq).contains(expectedValue).should('exist');
    });
});

Cypress.Commands.add('visitAndIntercept', (url: string, methodHTTP: string, routeMatcher: string, nbCalls: number) => {
  cy.intercept(methodHTTP, routeMatcher).as('getRouteMatcher');

  cy.visit(url);
  cy.waitWhileSpin(oneMinute);

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getRouteMatcher');
  };

  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('visitHomePage', () => {
  cy.visitAndIntercept('/',
                       'POST',
                       '**/graphql',
                       1);
});

Cypress.Commands.add('visitPrescriptionEntityPage', (prescriptionId: string) => {
  cy.visitAndIntercept(`/prescription/entity/${prescriptionId}`,
                       'POST',
                       '**/$graphql*',
                       1);
});

Cypress.Commands.add('waitUntilFile', (ms: number) => {
  const start = new Date().getTime();

  function checkFile(): any {
    const now = new Date().getTime();
    if (now - start > ms) {
      throw new Error(`Timed out after ${ms}ms waiting for file`);
    }

    return cy.task('fileExists', `${Cypress.config('downloadsFolder')}`).then((exists) => {
      if (exists) {
        return true;
      } else {
        return cy.wait(500).then(checkFile);
      }
    });
  }

  return checkFile();
});

Cypress.Commands.add('waitWhileSpin', (ms: number) => {
  const start = new Date().getTime();

  function checkForSpinners():any {
    const now = new Date().getTime();
    if (now - start > ms) {
      throw new Error(`Timed out after ${ms}ms waiting for spinners to disappear`);
    };

    return cy.get('body').then(($body) => {
      if ($body.find('.ant-spin-blur').length > 0) {
        return cy.wait(1000).then(checkForSpinners);
      };
    });
  };

  return checkForSpinners();
});

Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));