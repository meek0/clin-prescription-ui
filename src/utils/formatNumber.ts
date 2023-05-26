const regex = new RegExp(`\\B(?=(\\d{3})+(?!\\d))`, 'g');

export const formatNumber = (number: string | number) => {
  const stringNumber = number.toString();
  return stringNumber.replace(regex, ' ');
};
