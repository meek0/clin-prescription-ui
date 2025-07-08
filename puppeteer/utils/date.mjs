export function getRandomDateString(format = 'YYYYMMDD') {
  const start = new Date(1950, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, '0');
  const day = String(randomDate.getDate()).padStart(2, '0');

  return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
}

export function getRandomFutureDateString(maxDays = 30, format = 'YYYYMMDD') {
  const now = new Date();
  const future = new Date(
    now.getTime() + Math.floor(Math.random() * maxDays) * 24 * 60 * 60 * 1000,
  );
  const year = future.getFullYear();
  const month = String(future.getMonth() + 1).padStart(2, '0');
  const day = String(future.getDate()).padStart(2, '0');
  return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
}
