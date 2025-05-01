import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { Form, FormInstance, Input, Radio } from 'antd';
import { HybridApi } from 'api/hybrid';
import { IHybridPatientForm } from 'api/hybrid/models';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';

import InputDateFormItem from 'components/Form/InputDateFormItem';
import { INPUT_DATE_OUTPUT_FORMAT } from 'components/Form/MaskedDateInput';
import RadioGroupSex from 'components/Form/RadioGroupSex';
import SearchOrNoneFormItem from 'components/Form/SearchOrNoneFormItem';
import {
  dateNotLaterThanTodayRule,
  defaultFormItemsRules,
  minimumTwoNonEmptyCharacters,
  noSpecialCharactersRule,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { TParentDataType } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/ParentIdentification/types';
import {
  getNamePath,
  resetFieldError,
  setFieldError,
  setFieldValue,
  setInitialValues,
} from 'components/Prescription/utils/form';
import {
  extractBirthDateAndSexFromRamq,
  formatRamq,
  isRamqValid,
} from 'components/Prescription/utils/ramq';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { useAppDispatch } from 'store';
import { usePrescriptionForm, usePrescriptionFormConfig } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import { hasSpecialCharacters } from 'utils/helper';

import { IPatientDataType } from './types';

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  onRamqSearchStateChange?: (done: boolean) => void;
  onFileSearchStateChange?: (done: boolean) => void;
  onResetRamq?: () => void;
  initialFileSearchDone?: boolean;
  initialRamqSearchDone?: boolean;
  initialData?: IPatientDataType | TParentDataType;
  populateFromJhn?: {
    jhn: string;
    organization_id: string;
  };
};

const TIME = ' 00:00:00';

const PatientDataSearch = ({
  form,
  parentKey,
  onRamqSearchStateChange,
  onFileSearchStateChange,
  onResetRamq,
  initialFileSearchDone = false,
  initialRamqSearchDone = false,
  initialData,
  populateFromJhn = undefined,
}: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const { prescriptionId } = usePrescriptionForm();
  const dispatch = useAppDispatch();
  const [isNewFileNumber, setIsNewFileNumber] = useState(false);
  const [fileSearchDone, setFileSearchDone] = useState(initialFileSearchDone);
  const [ramqSearchDone, setRamqSearchDone] = useState(initialRamqSearchDone);
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  const updateFormFromPatient = (form: FormInstance, patient?: IHybridPatientForm) => {
    if (patient && !isEmpty(patient)) {
      const fields = [
        {
          name: getName('first_name' satisfies keyof IPatientDataType),
          value: patient.first_name,
        },
        {
          name: getName('last_name' satisfies keyof IPatientDataType),
          value: patient.last_name,
        },
        {
          name: getName('birth_date' satisfies keyof IPatientDataType),
          value: format(new Date(patient.birth_date + TIME), INPUT_DATE_OUTPUT_FORMAT),
        },
        {
          name: getName('sex' satisfies keyof IPatientDataType),
          value: patient?.sex?.toUpperCase(),
        },
      ];

      if (patient.jhn)
        fields.push({
          name: getName('jhn' satisfies keyof IPatientDataType),
          value: formatRamq(patient.jhn),
        });

      if (patient.mrn && populateFromJhn?.organization_id === patient.organization_id) {
        fields.push({
          name: getName('mrn' satisfies keyof IPatientDataType),
          value: formatRamq(patient.mrn),
        });
      }

      form.setFields(fields);
    }
  };
  useEffect(() => setFileSearchDone(initialFileSearchDone), [initialFileSearchDone]);

  useEffect(() => setRamqSearchDone(initialRamqSearchDone), [initialRamqSearchDone]);

  useEffect(
    () => onRamqSearchStateChange?.(ramqSearchDone),
    // eslint-disable-next-line
    [ramqSearchDone],
  );

  useEffect(
    () => onFileSearchStateChange?.(fileSearchDone),
    // eslint-disable-next-line
    [fileSearchDone],
  );

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setFileSearchDone(!!(initialData.no_mrn || initialData.mrn));
      setRamqSearchDone(!!(initialData.no_jhn || initialData.jhn));
      setInitialValues(
        form,
        getName,
        initialData,
        Object.keys(initialData).filter((key) => !['status', 'reason'].includes(key)),
      );

      // Populate from JHN if available
      if (populateFromJhn) {
        setFieldValue(
          form,
          getName('organization_id' satisfies keyof IPatientDataType),
          populateFromJhn.organization_id,
        );
        setFieldValue(form, getName('jhn' satisfies keyof IPatientDataType), populateFromJhn.jhn);
        const jhnData = extractBirthDateAndSexFromRamq(
          populateFromJhn.jhn.replace(/\s/g, ''),
          INPUT_DATE_OUTPUT_FORMAT,
        );
        if (jhnData.birthDate) {
          setFieldValue(
            form,
            getName('birth_date' satisfies keyof IPatientDataType),
            jhnData.birthDate,
          );
          setFieldValue(form, getName('sex' satisfies keyof IPatientDataType), jhnData.sex);
        }
        HybridApi.searchPatients({ jhn: populateFromJhn.jhn.replace(/\s/g, '') }).then(
          ({ data }) => {
            const motherData = data?.patients?.[0];
            setRamqSearchDone(true);
            if (!motherData) return;
            updateFormFromPatient(form, motherData);
          },
        );
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.patientDataSearchWrapper}>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => (
          <Form.Item
            name={getName('organization_id' satisfies keyof IPatientDataType)}
            label={intl.get('prescribing.institution')}
            rules={defaultFormItemsRules}
          >
            <Radio.Group
              disabled={
                getFieldValue(getName('no_mrn' satisfies keyof IPatientDataType)) ||
                getFieldValue(getName('no_jhn' satisfies keyof IPatientDataType)) ||
                fileSearchDone
              }
            >
              {formConfig?.prescribing_institutions.map((institution) => (
                <Radio key={institution.value} value={institution.value}>
                  {institution.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        )}
      </Form.Item>
      {populateFromJhn && (
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => (
            <>
              <SearchOrNoneFormItem<{ patients: IHybridPatientForm[] }>
                disableReset
                form={form}
                noReset
                inputFormItemProps={{
                  name: getName('jhn' satisfies keyof IPatientDataType),
                  rules: [
                    {
                      required: true,
                      validateTrigger: 'onSubmit',
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject(new Error(intl.get('this.field.is.required')));
                        } else if (!isRamqValid(value)) {
                          return Promise.reject(new Error(intl.get('ramq.number.invalid')));
                        } else if (!ramqSearchDone) {
                          return Promise.reject(new Error(intl.get('click.on.search')));
                        }

                        return Promise.resolve();
                      },
                    },
                  ],
                  label: 'RAMQ',
                  required: true,
                }}
                checkboxProps={{
                  onChange: (e) => {
                    const checked = e.target.checked;
                    if (!checked) {
                      onResetRamq && onResetRamq();
                    }
                  },
                }}
                inputProps={{
                  placeholder: 'AAAA 0000 0000',
                  onSearch: (value, search) => {
                    const fixedRamq = value.replace(/\s/g, '');
                    resetFieldError(form, getName('jhn' satisfies keyof IPatientDataType));
                    if (
                      extractBirthDateAndSexFromRamq(fixedRamq, INPUT_DATE_OUTPUT_FORMAT)
                        .birthDate &&
                      isRamqValid(fixedRamq)
                    ) {
                      (search as Function)(fixedRamq);
                    } else {
                      setFieldError(
                        form,
                        getName('jhn' satisfies keyof IPatientDataType),
                        intl.get('ramq.number.invalid'),
                      );
                    }
                  },
                  onChange: (event) =>
                    setFieldValue(
                      form,
                      getName('jhn' satisfies keyof IPatientDataType),
                      formatRamq(event.currentTarget.value),
                    ),
                }}
                checkboxFormItemProps={{
                  name: getName('no_jhn' satisfies keyof IPatientDataType),
                  title:
                    parentKey === 'patient' ? intl.get('no.ramq.or.new.born') : intl.get('no.ramq'),
                }}
                onReset={() => {
                  onResetRamq && onResetRamq();
                  setRamqSearchDone(false);
                  form.resetFields([
                    getName('first_name' satisfies keyof IPatientDataType),
                    getName('last_name' satisfies keyof IPatientDataType),
                    getName('sex' satisfies keyof IPatientDataType),
                  ]);
                  dispatch(prescriptionFormActions.saveStepData({ patient: { id: null } }));
                }}
                onSearchDone={(value, searchValue) => {
                  const patients = value?.patients;
                  if (!patients) return;
                  if (!patients.length && searchValue) {
                    const ramqData = extractBirthDateAndSexFromRamq(
                      searchValue,
                      INPUT_DATE_OUTPUT_FORMAT,
                    );

                    if (ramqData.birthDate) {
                      setFieldValue(
                        form,
                        getName('birth_date' satisfies keyof IPatientDataType),
                        ramqData.birthDate,
                      );
                      setFieldValue(
                        form,
                        getName('sex' satisfies keyof IPatientDataType),
                        ramqData.sex?.toUpperCase(),
                      );
                    }
                  }
                  if (
                    isNewFileNumber &&
                    patients.find(
                      (p) =>
                        p.organization_id ===
                        getFieldValue(getName('organization_id' satisfies keyof IPatientDataType)),
                    )
                  ) {
                    setFieldError(
                      form,
                      getName('jhn' satisfies keyof IPatientDataType),
                      intl.get('cant.have.two.file.number.same.patient'),
                    );
                  } else {
                    updateFormFromPatient(form, patients[0]);
                    setRamqSearchDone(true);
                  }
                }}
                apiPromise={(value) =>
                  HybridApi.searchPatients({
                    jhn: value,
                  })
                }
                disabled
              />
            </>
          )}
        </Form.Item>
      )}
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName('organization_id' satisfies keyof IPatientDataType)) ? (
            <SearchOrNoneFormItem<IHybridPatientForm>
              disableReset={!!prescriptionId && !!initialData?.mrn}
              form={form}
              inputFormItemProps={{
                name: getName('mrn' satisfies keyof IPatientDataType),
                rules: [
                  {
                    required: true,
                    validateTrigger: 'onSubmit',
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error(intl.get('this.field.is.required')));
                      }

                      if (!fileSearchDone) {
                        return Promise.reject(new Error(intl.get('click.on.search')));
                      }

                      return Promise.resolve();
                    },
                  },
                ],
                required: true,
                label: intl.get('folder'),
              }}
              inputProps={{
                placeholder: '000000',
                'data-cy': 'InputMRN',
                onSearch: (value, search) => {
                  const fixedFileNumber = value.replace(/\s/g, '');

                  if (hasSpecialCharacters(fixedFileNumber)) {
                    setFieldError(
                      form,
                      getName('mrn' satisfies keyof IPatientDataType),
                      intl.get('must.not.contain.special.characters'),
                    );
                  } else {
                    (search as Function)(fixedFileNumber);
                  }
                },
              }}
              checkboxFormItemProps={{
                name: getName('no_mrn' satisfies keyof IPatientDataType),
                title: intl.get('no.folder.number'),
              }}
              checkboxProps={{
                onChange: (e) => setFileSearchDone(e.target.checked),
              }}
              onReset={() => {
                if (populateFromJhn) {
                  setFileSearchDone(false);
                  form.resetFields([getName('no_mrn' satisfies keyof IPatientDataType)]);
                } else {
                  setFileSearchDone(false);
                  setRamqSearchDone(false);
                  form.resetFields([
                    getName('first_name' satisfies keyof IPatientDataType),
                    getName('last_name' satisfies keyof IPatientDataType),
                    getName('sex' satisfies keyof IPatientDataType),
                    getName('jhn' satisfies keyof IPatientDataType),
                    getName('no_jhn' satisfies keyof IPatientDataType),
                    getName('no_mrn' satisfies keyof IPatientDataType),
                    getName('birth_date' satisfies keyof IPatientDataType),
                  ]);
                }
              }}
              onSearchDone={(patientFound) => {
                if (populateFromJhn && patientFound && patientFound?.jhn !== populateFromJhn?.jhn) {
                  setFieldError(
                    form,
                    getName('mrn' satisfies keyof IPatientDataType),
                    intl.get('cant.have.two.file.number.same.patient'),
                  );
                } else {
                  updateFormFromPatient(form, patientFound);
                  setFileSearchDone(true);
                  setIsNewFileNumber(isEmpty(patientFound));

                  if (patientFound && patientFound.jhn) {
                    setRamqSearchDone(true);
                  } else if (patientFound && !patientFound.jhn) {
                    setFieldValue(form, getName('no_jhn' satisfies keyof IPatientDataType), 'true');
                  }
                }
              }}
              apiPromise={(value) =>
                HybridApi.searchPatient({
                  organization_id: getFieldValue(
                    getName('organization_id' satisfies keyof IPatientDataType),
                  ),
                  mrn: value,
                })
              }
              disabled={
                populateFromJhn
                  ? fileSearchDone &&
                    !getFieldValue(getName('no_mrn' satisfies keyof IPatientDataType))
                  : ramqSearchDone ||
                    getFieldValue(getName('no_jhn' satisfies keyof IPatientDataType)) ||
                    (fileSearchDone &&
                      !getFieldValue(getName('no_mrn' satisfies keyof IPatientDataType)))
              }
            />
          ) : null
        }
      </Form.Item>
      {!populateFromJhn && (
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue(getName('no_mrn' satisfies keyof IPatientDataType)) || fileSearchDone ? (
              <>
                <SearchOrNoneFormItem<{ patients: IHybridPatientForm[] }>
                  disableReset={
                    !!prescriptionId &&
                    ((!isNewFileNumber && ramqSearchDone) ||
                      !!initialData?.['jhn' satisfies keyof IPatientDataType])
                  }
                  form={form}
                  inputFormItemProps={{
                    name: getName('jhn' satisfies keyof IPatientDataType),
                    rules: [
                      {
                        required: true,
                        validateTrigger: 'onSubmit',
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject(new Error(intl.get('this.field.is.required')));
                          } else if (!isRamqValid(value)) {
                            return Promise.reject(new Error(intl.get('ramq.number.invalid')));
                          } else if (!ramqSearchDone) {
                            return Promise.reject(new Error(intl.get('click.on.search')));
                          }

                          return Promise.resolve();
                        },
                      },
                    ],
                    label: 'RAMQ',
                    required: true,
                  }}
                  checkboxProps={{
                    onChange: (e) => {
                      const checked = e.target.checked;
                      if (!checked) {
                        onResetRamq && onResetRamq();
                      }
                    },
                  }}
                  inputProps={{
                    placeholder: 'AAAA 0000 0000',
                    onSearch: (value, search) => {
                      const fixedRamq = value.replace(/\s/g, '');
                      resetFieldError(form, getName('jhn' satisfies keyof IPatientDataType));
                      if (
                        extractBirthDateAndSexFromRamq(fixedRamq, INPUT_DATE_OUTPUT_FORMAT)
                          .birthDate &&
                        isRamqValid(fixedRamq)
                      ) {
                        (search as Function)(fixedRamq);
                      } else {
                        setFieldError(
                          form,
                          getName('jhn' satisfies keyof IPatientDataType),
                          intl.get('ramq.number.invalid'),
                        );
                      }
                    },
                    onChange: (event) =>
                      setFieldValue(
                        form,
                        getName('jhn' satisfies keyof IPatientDataType),
                        formatRamq(event.currentTarget.value),
                      ),
                  }}
                  checkboxFormItemProps={{
                    name: getName('no_jhn' satisfies keyof IPatientDataType),
                    className: getFieldValue(getName('no_mrn' satisfies keyof IPatientDataType))
                      ? styles.checkboxHidden
                      : '',
                    title:
                      parentKey === STEPS_ID.PROBAND_IDENTIFICATION
                        ? intl.get('no.ramq.or.new.born')
                        : intl.get('no.ramq'),
                  }}
                  onReset={() => {
                    onResetRamq && onResetRamq();
                    setRamqSearchDone(false);
                    form.resetFields([
                      getName('first_name' satisfies keyof IPatientDataType),
                      getName('last_name' satisfies keyof IPatientDataType),
                      getName('sex' satisfies keyof IPatientDataType),
                      getName('no_jhn' satisfies keyof IPatientDataType),
                      getName('birth_date' satisfies keyof IPatientDataType),
                    ]);
                    if (parentKey === STEPS_ID.PROBAND_IDENTIFICATION)
                      dispatch(prescriptionFormActions.saveStepData({ patient: { id: null } }));
                  }}
                  onSearchDone={(values, searchValue) => {
                    if (values?.patients && Array.isArray(values?.patients)) {
                      if (values.patients.length === 0 && searchValue) {
                        const ramqData = extractBirthDateAndSexFromRamq(
                          searchValue,
                          INPUT_DATE_OUTPUT_FORMAT,
                        );

                        if (ramqData.birthDate) {
                          setFieldValue(
                            form,
                            getName('birth_date' satisfies keyof IPatientDataType),
                            ramqData.birthDate,
                          );
                          setFieldValue(
                            form,
                            getName('sex' satisfies keyof IPatientDataType),
                            ramqData.sex,
                          );
                        }
                      }
                      if (
                        isNewFileNumber &&
                        values.patients.filter(
                          (v) =>
                            v.organization_id ===
                            getFieldValue(
                              getName('organization_id' satisfies keyof IPatientDataType),
                            ),
                        ).length > 0
                      ) {
                        setFieldError(
                          form,
                          getName('jhn' satisfies keyof IPatientDataType),
                          intl.get('cant.have.two.file.number.same.patient'),
                        );
                      } else {
                        updateFormFromPatient(form, values.patients[0]);
                        setRamqSearchDone(true);
                      }
                    }
                  }}
                  apiPromise={(value) =>
                    HybridApi.searchPatients({
                      jhn: value,
                    })
                  }
                  disabled={
                    (ramqSearchDone &&
                      !getFieldValue(getName('no_jhn' satisfies keyof IPatientDataType))) ||
                    (prescriptionId &&
                      getFieldValue(getName('no_jhn' satisfies keyof IPatientDataType)))
                  }
                />
              </>
            ) : null
          }
        </Form.Item>
      )}

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName('no_jhn' satisfies keyof IPatientDataType)) || ramqSearchDone ? (
            <>
              <Form.Item
                name={getName('last_name' satisfies keyof IPatientDataType)}
                label={intl.get('last.name')}
                rules={[
                  ...defaultFormItemsRules,
                  minimumTwoNonEmptyCharacters,
                  noSpecialCharactersRule,
                ]}
                wrapperCol={{ span: 10, sm: 12, xxl: 6 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={getName('first_name' satisfies keyof IPatientDataType)}
                label={intl.get('first.name')}
                rules={[
                  ...defaultFormItemsRules,
                  minimumTwoNonEmptyCharacters,
                  noSpecialCharactersRule,
                ]}
                wrapperCol={{ span: 10, sm: 12, xxl: 6 }}
              >
                <Input />
              </Form.Item>
              <InputDateFormItem
                formItemProps={{
                  label: intl.get('birthdate'),
                  name: getName('birth_date' satisfies keyof IPatientDataType),
                  required: true,
                }}
                moreRules={[dateNotLaterThanTodayRule]}
              />
              <Form.Item
                name={getName('sex' satisfies keyof IPatientDataType)}
                label={intl.get('sex')}
                rules={defaultFormItemsRules}
                className="noMarginBtm"
              >
                <RadioGroupSex />
              </Form.Item>
            </>
          ) : null
        }
      </Form.Item>
    </div>
  );
};

export default PatientDataSearch;
