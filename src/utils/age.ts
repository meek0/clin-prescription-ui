import { differenceInDays } from 'date-fns';

export const calculateGestationalAgeFromDDM = (value: Date) =>
  new Date() >= value ? Math.round(differenceInDays(new Date(), value) / 7) : undefined;

export const calculateGestationalAgeFromDPA = (value: Date) =>
  value >= new Date() && differenceInDays(value, new Date()) <= 40 * 7
    ? Math.round((40 * 7 - differenceInDays(value, new Date())) / 7)
    : undefined;
