import { BASE_URL, PASSWORD, USERNAME } from '../Config.mjs';

export default async function login(page) {
  await page.goto(`${BASE_URL}landing?redirect_path=/`);

  // Click the "Connexion" button
  await page.waitForSelector('button span');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button span'));
    const btn = buttons.find((el) => el.textContent.trim() === 'Connexion');
    if (btn) btn.click();
  });
  await page.waitForNavigation();

  const cqgcButton = await page.$('#social-CQGC');
  if (cqgcButton) {
    await page.click('#social-CQGC');
  }

  // Fill in username
  await page.waitForSelector('#username');
  await page.click('#username');
  await page.type('#username', USERNAME);

  // Fill in password
  await page.waitForSelector('#password');
  await page.click('#password');
  await page.type('#password', PASSWORD);

  // Click the "Soumettre" (Submit) button
  await page.waitForSelector('button span');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button span'));
    const btn = buttons.find((el) => el.textContent.trim() === 'Soumettre');
    if (btn) btn.click();
  });
  await page.waitForNavigation();
}
