import process from 'process';
import puppeteer from 'puppeteer';

import clickNext from '../actions/analysis/ClickNext.mjs';
import {
  fillClinicalSigns,
  fillHistoryDiagnosis,
  fillPatientIdentification,
} from '../actions/analysis/FillAnalysisSteps.mjs';
import { newAnalysis, selectAnalysis, startAnalysis } from '../actions/analysis/NewAnalysis.mjs';
import saveDraft from '../actions/analysis/SaveDraft.mjs';
import login from '../actions/Login.mjs';

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 15 });
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);

  await page.setViewport({ width: 947, height: 1228 });

  await login(page);
  await newAnalysis(page);
  await selectAnalysis(page, 'Retard global de');
  await startAnalysis(page);
  await fillPatientIdentification(page);
  await clickNext(page);
  await fillClinicalSigns(page);
  await clickNext(page);
  await clickNext(page);
  await fillHistoryDiagnosis(page);
  await saveDraft(page);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
