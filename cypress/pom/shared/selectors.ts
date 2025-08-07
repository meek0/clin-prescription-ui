// Sélecteurs partagées

const ageValue = (age: string) => {
    const mapping: Record<string, string> = {
      antenatal: '0030674',
      childhood: '0011463',
      youngAdult: '0011462',
    };
    return mapping[age];
};

export const sharedSelectors = {
  buttonAddClinicalSign: '[class*="ClinicalSignsSelect_addClinicalSignBtn"]',
  buttonNext: '[data-cy="NextButton"]',
  buttonSave: '[data-cy="SaveButton"]',
  buttonSubmit: '[data-cy="SubmitButton"]',
  dropdownAge: (age: string) => `[class="rc-virtual-list"] [data-cy="SelectOptionHP:${ageValue(age)}"]`,
  dropdownClinicalSign: '[class="rc-virtual-list"] [class="ant-select-item-option-content"]',
  inputClinicalSign: '[class*="ClinicalSignsSelect_phenotype-search"] input[class*="ant-select-selection-search-input"]',
  inputMrn: '[data-cy="InputMRN"]',
  radioEp: (ep: string) => `input[type="radio"][value="${ep}"]`,
  selectAge: '[class*="ClinicalSignsSelect_ageSelectInput"]',
};