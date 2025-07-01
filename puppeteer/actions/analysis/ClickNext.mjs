export default async function clickNext(page) {
  await page.waitForSelector('::-p-text(Suivant)');
  await page.click('::-p-text(Suivant)');
}
