import { format, parse } from 'date-fns';

import { SexValue } from 'utils/commonTypes';

export const RAMQ_PATTERN = RegExp(
  /^[a-zA-Z-]{4}\d{2}(?:(?:[05][1-9])|[16][012])(?:(?:0[1-9])|(?:[12][0-9])|(?:3[01]))\d{2}$/,
);
export const RAMQ_NUMBER_LENGTH = 12;

export const isRamqValid = (ramq: string) => RAMQ_PATTERN.test(ramq.replaceAll(' ', ''));

export const formatRamq = (value: string) =>
  value
    .toUpperCase()
    .replace(/\s/g, '')
    .split('')
    .splice(0, RAMQ_NUMBER_LENGTH)
    .reduce(
      (acc, char, index) =>
        char !== ' ' && [3, 7].includes(index) ? `${acc}${char} ` : `${acc}${char}`,
      '',
    )
    .trimEnd();

export const extractBirthDateAndSexFromRamq = (ramq: string, dateFormat: string) => {
  let sex = SexValue.MALE;
  const dateString = ramq.substring(4, 10);
  const year = dateString.substring(0, 2);
  let month = parseInt(dateString.substring(2, 4));
  const day = dateString.substring(4, 6);

  if (month > 12) {
    sex = SexValue.FEMALE;
    month = month - 50;
  }

  let birthDate;

  try {
    const date = parse(year + month.toString().padStart(2, '0') + day, 'yyMMdd', new Date());
    if (date > new Date()) {
      const newYears = Number(date.getFullYear()) - 100;
      date.setFullYear(Number(newYears));
    }
    birthDate = format(date, dateFormat);
  } catch {
    birthDate = undefined;
  }
  return {
    sex,
    birthDate,
  };
};
