import { faker } from '@faker-js/faker';

import { getRandomDateString, getRandomFutureDateString } from '../../utils/date.mjs';
import generateRandomJHN from '../../utils/randomJHN.mjs';
import { getRandomString } from '../../utils/string.mjs';

export async function fillPatientIdentification(page, patientRelationship = 'proband') {
  await page.waitForSelector('::-p-text(CHUSJ)');
  await page.click('::-p-text(CHUSJ)');
  await page.waitForSelector("[data-cy='InputMRN']");
  await page.click("[data-cy='InputMRN']");
  await page.type("[data-cy='InputMRN']", getRandomString(20));
  await page.keyboard.down('Enter');
  await page.keyboard.up('Enter');
  await page.waitForSelector('::-p-text(Aucun numéro de RAMQ)');
  await page.click('::-p-text(Aucun numéro de RAMQ)');
  await page.waitForSelector(`#${patientRelationship}_${patientRelationship}_last_name`);
  await page.click(`#${patientRelationship}_${patientRelationship}_last_name`);
  await page.type(
    `#${patientRelationship}_${patientRelationship}_last_name`,
    faker.person.lastName(),
  );
  await page.click(`#${patientRelationship}_${patientRelationship}_first_name`);
  await page.type(
    `#${patientRelationship}_${patientRelationship}_first_name`,
    faker.person.firstName(),
  );
  await page.click(`#${patientRelationship}_${patientRelationship}_birth_date`);
  await page.type(
    `#${patientRelationship}_${patientRelationship}_birth_date`,
    getRandomDateString('YYYYMMDD'),
  );
  if (patientRelationship == 'father') {
    await page.click('::-p-text(Masculin)');
  } else await page.click('::-p-text(Féminin)');
}

export async function fillNewbornMotherIdentification(page) {
  const patientRelationship = 'mother';
  await page.waitForSelector(`#${patientRelationship}_${patientRelationship}_mrn`);
  await page.click(`#${patientRelationship}_${patientRelationship}_mrn`);
  await page.type(`#${patientRelationship}_${patientRelationship}_mrn`, getRandomString(20));
  await page.keyboard.down('Enter');
  await page.keyboard.up('Enter');
  await page.waitForSelector(`#${patientRelationship}_${patientRelationship}_last_name`);
  await page.click(`#${patientRelationship}_${patientRelationship}_last_name`);
  await page.type(
    `#${patientRelationship}_${patientRelationship}_last_name`,
    faker.person.lastName(),
  );
  await page.click(`#${patientRelationship}_${patientRelationship}_first_name`);
  await page.type(
    `#${patientRelationship}_${patientRelationship}_first_name`,
    faker.person.firstName(),
  );
  await page.click(`#${patientRelationship}_${patientRelationship}_birth_date`);
  await page.type(
    `#${patientRelationship}_${patientRelationship}_birth_date`,
    getRandomDateString('YYYYMMDD'),
  );
  await page.click('::-p-text(Féminin)');
}

export async function fillClinicalSigns(page) {
  await page.waitForSelector("[data-cy^='ObservedHP']");
  const elements = await page.$$("[data-cy^='ObservedHP']");
  if (elements.length > 0) {
    await elements[0].click();
  }
  await page.type('#proband_clinical_proband_clinical_comment', getRandomString(10));
}

export async function fillHistoryDiagnosis(page) {
  await page.waitForSelector("[data-cy='InputHypothesis']");
  await page.type("[data-cy='InputHypothesis']", getRandomString(10));
}

export async function selectParentMomentNow(page, parentType = 'mother') {
  await page.waitForSelector(`#${parentType}_${parentType}_status`);
  await page.click('::-p-text(Maintenant)');
}

export async function selectParentClinicalStatusAffected(page, parentType = 'mother') {
  await page.waitForSelector(`#${parentType}_${parentType}_parent_clinical_status`);
  await page.click('::-p-text(Atteint)');
}

export async function fillAddObservedClinicalSign(page, signName = 'Head') {
  await page.waitForSelector('::-p-text(Ajouter un signe clinique observé)');
  await page.click('::-p-text(Ajouter un signe clinique observé)');

  const selectHandles = await page.$$('[id^="rc_select_"]');
  if (selectHandles.length === 0) {
    throw new Error('No selector found starting with rc_select_');
  }
  const selectHandle = selectHandles[0];
  await selectHandle.click();
  await selectHandle.type(signName);
  await page.waitForSelector('.ant-select-item-option', { visible: true });
  // Click the first option
  const firstOption = await page.$('.ant-select-item-option');
  if (firstOption) {
    await firstOption.click();
  }
}

export async function fillPrenatal(page) {
  await page.waitForSelector('#proband_proband_foetus_is_prenatal_diagnosis');
  await page.click('#proband_proband_foetus_is_prenatal_diagnosis');
  const genderContainer = await page.$('#proband_proband_foetus_sex');
  if (genderContainer) {
    const femininBtn = await genderContainer.$('::-p-text(Féminin)');
    if (femininBtn) {
      await femininBtn.click();
    }
  }
  await page.waitForSelector('#proband_proband_foetus_gestational_method');
  await page.click('#proband_proband_foetus_gestational_method');
  await page.waitForSelector('#proband_proband_foetus_gestational_date');
  await page.type(
    '#proband_proband_foetus_gestational_date',
    getRandomFutureDateString(90, 'YYYYMMDD'),
  );
}

export async function fillNewborn(page) {
  await page.waitForSelector('#proband_proband_foetus_is_new_born');
  await page.click('#proband_proband_foetus_is_new_born');
  await page.type('#proband_proband_foetus_mother_jhn', generateRandomJHN());
}
