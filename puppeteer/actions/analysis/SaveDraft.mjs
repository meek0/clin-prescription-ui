export default async function saveDraft(page) {
  await page.waitForSelector('[data-cy="SaveButton"]');
  await page.click('[data-cy="SaveButton"]');
}
