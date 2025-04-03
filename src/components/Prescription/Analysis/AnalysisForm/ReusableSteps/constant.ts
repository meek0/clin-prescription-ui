import intl from 'react-intl-universal';
import { TCollapseProps } from '@ferlab/ui/core/components/Collapse';
import { Rule } from 'antd/lib/form';

import { hasSpecialCharacters } from 'utils/helper';

export enum STEPS_ID {
  PATIENT_IDENTIFICATION = 'patient',
  CLINICAL_SIGNS = 'clinical_signs',
  HISTORY_AND_DIAGNOSIS = 'history_and_diagnosis',
  PARACLINICAL_EXAMS = 'paraclinical_exams',
  SUBMISSION = 'submission',
  MOTHER_IDENTIFICATION = 'mother',
  FATHER_IDENTIFICATION = 'father',
  ADD_PARENT_SUBMISSION = 'add_parent_submission',
}

export const EMPTY_FIELD = '--';

export const defaultFormItemsRules = [{ required: true, validateTrigger: 'onSumbit' }];

export const noSpecialCharactersRule: Rule = {
  validateTrigger: 'onSubmit',
  validator: (_, value) => {
    if (hasSpecialCharacters(value)) {
      return Promise.reject(intl.get('must.not.contain.special.characters'));
    }

    return Promise.resolve();
  },
};

export const defaultCollapseProps: TCollapseProps = {
  size: 'small',
  arrowIcon: 'caretFilled',
  bordered: false,
  theme: 'shade',
};

export const dateNotLaterThanTodayRule: Rule = {
  validateTrigger: 'onSubmit',
  validator: (_, value) => {
    if (value) {
      const today = new Date();
      const currentDate = new Date(value);

      const [todayYear, todayMonth, todayDay] = [
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
      ];
      const [currentDateYear, currentDateMonth, currentDateDay] = [
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
      ];

      if (
        new Date(currentDateYear, currentDateMonth, currentDateDay) >
        new Date(todayYear, todayMonth, todayDay)
      ) {
        return Promise.reject(intl.get('must.not.be.later.today'));
      }
    }
    return Promise.resolve();
  },
};

export const dateNotEarlierThanTodayRule: Rule = {
  validateTrigger: 'onSubmit',
  validator: (_, value) => {
    if (value) {
      const today = new Date();
      const currentDate = new Date(value);

      const [todayYear, todayMonth, todayDay] = [
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
      ];
      const [currentDateYear, currentDateMonth, currentDateDay] = [
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
      ];

      if (
        new Date(todayYear, todayMonth, todayDay) >
        new Date(currentDateYear, currentDateMonth, currentDateDay)
      ) {
        return Promise.reject(intl.get('must.not.be.earlier.today'));
      }
    }
    return Promise.resolve();
  },
};

export const minimumTwoNonEmptyCharacters: Rule = {
  validateTrigger: 'onSubmit',
  validator: async (_, value) => {
    if (value?.trim().length < 2) {
      return Promise.reject(intl.get('enter.at.least.character', { count: 2 }));
    }
    return Promise.resolve();
  },
};
