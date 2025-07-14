import { capitalize } from 'lodash';

import { Name } from './models';

export const JHN_NUMBER_LENGTH = 12;

export type AffectedStatusCode = 'POS' | 'NEG' | 'IND';

export const AFFECTED_STATUS_CODE = {
  POS: 'affected',
  NEG: 'not_affected',
  IND: 'unknown',
};

export const formatJhn = (value: string) =>
  value
    ? value
        .toUpperCase()
        .replace(/\s/g, '')
        .split('')
        .splice(0, JHN_NUMBER_LENGTH)
        .reduce(
          (acc, char, index) =>
            char !== ' ' && [3, 7].includes(index) ? `${acc}${char} ` : `${acc}${char}`,
          '',
        )
        .trimEnd()
    : value;

export const formatName = (name: Name) =>
  `${name.family?.toUpperCase()} ${capitalize(name.given)} `;
