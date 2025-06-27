import { faker } from '@faker-js/faker';

import { getRandomDateString } from '../../utils/date.mjs';
import { getRandomString } from '../../utils/string.mjs';

export async function fillPatientIdentification(page) {
  await page.waitForSelector('::-p-text(CHUSJ)');
  await page.click('::-p-text(CHUSJ)');
  await page.waitForSelector("[data-cy='InputMRN']");
  await page.click("[data-cy='InputMRN']");
  await page.type("[data-cy='InputMRN']", getRandomString(20));
  await page.keyboard.down('Enter');
  await page.keyboard.up('Enter');
  await page.waitForSelector('::-p-text(Aucun numéro de RAMQ)');
  await page.click('::-p-text(Aucun numéro de RAMQ)');
  await page.waitForSelector('#patient_patient_last_name');
  await page.click('#patient_patient_last_name');
  await page.type('#patient_patient_last_name', faker.person.lastName());
  await page.click('#patient_patient_first_name');
  await page.type('#patient_patient_first_name', faker.person.firstName());
  await page.click('#patient_patient_birth_date');
  await page.type('#patient_patient_birth_date', getRandomDateString('YYYYMMDD'));
  await page.click('::-p-text(Féminin)');
}
