export const formatDate = (date: string): string => {
  // https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
  const d = new Date(date.replace(/-/g, '/').replace(/T.+/, ''));
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};
