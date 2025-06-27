import { BASE_URL } from '../../Config.mjs';

export async function newAnalysis(page) {
  await page.goto(`${BASE_URL}`);
  await page.waitForSelector("[data-cy='CreateNewPrescription']");
  await page.click("[data-cy='CreateNewPrescription']");
  await page.waitForSelector('#analysis_type');
}

export async function selectAnalysis(page, analysisName) {
  await page.waitForSelector('#analysis_type');
  await page.click('#analysis_type');
  await page.waitForSelector(`text/${analysisName}`);
  await page.click(`text/${analysisName}`);
}

export async function startAnalysis(page) {
  await page.waitForSelector('text/Commencer');
  await page.click('text/Commencer');
  await page.waitForSelector('[data-cy="NextButton"]');
}
