import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { Form, FormInstance, Input, Radio } from 'antd';
import {
  hybridToFormPatient,
  IFormPatient,
  IHybridFormPatient,
  IHybridFormPatients,
} from 'api/form/models';
import { HybridApi } from 'api/hybrid';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { FieldData } from 'rc-field-form/lib/interface';

import InputDateFormItem from 'components/Form/InputDateFormItem';
import { INPUT_DATE_OUTPUT_FORMAT } from 'components/Form/MaskedDateInput';
import RadioGroupSex from 'components/Form/RadioGroupSex';
import SearchOrNoneFormItem from 'components/Form/SearchOrNoneFormItem';
import {
  dateNotLaterThanTodayRule,
  defaultFormItemsRules,
  minimumTwoNonEmptyCharacters,
  noSpecialCharactersRule,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
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

import { IPatientDataType, PATIENT_DATA_FI_KEY } from '../PatientDataSearch/types';

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  onRamqSearchStateChange?: (done: boolean) => void;
  onFileSearchStateChange?: (done: boolean) => void;
  onResetRamq?: () => void;
  initialFileSearchDone?: boolean;
  initialRamqSearchDone?: boolean;
  initialData?: IPatientDataType;
  motherRamq?: string;
};

const TIME = ' 00:00:00';

const MotherDataSearch = ({
  form,
  parentKey,
  onRamqSearchStateChange,
  onFileSearchStateChange,
  onResetRamq,
  initialFileSearchDone = false,
  initialRamqSearchDone = false,
  initialData,
}: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const { prescriptionId } = usePrescriptionForm();
  const dispatch = useAppDispatch();
  const [isNewFileNumber, setIsNewFileNumber] = useState(false);
  const [fileSearchDone, setFileSearchDone] = useState(initialFileSearchDone);
  const [ramqSearchDone, setRamqSearchDone] = useState(initialRamqSearchDone);
  const [disbledEP, setDisabledEP] = useState(true);
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);
  const hasMotherRamq = initialData && initialData?.[PATIENT_DATA_FI_KEY.RAMQ_NUMBER] !== '';

  const updateFormFromPatient = (
    form: FormInstance,
    patient?: IFormPatient,
    field?: PATIENT_DATA_FI_KEY,
  ) => {
    if (patient && !isEmpty(patient)) {
      const fields: FieldData[] = [];
      if (
        field === PATIENT_DATA_FI_KEY.FILE_NUMBER &&
        patient.ramq !== initialData?.[PATIENT_DATA_FI_KEY.RAMQ_NUMBER] &&
        patient.mrn !== initialData?.[PATIENT_DATA_FI_KEY.FILE_NUMBER]
      ) {
        setFieldError(
          form,
          getName(PATIENT_DATA_FI_KEY.FILE_NUMBER),
          intl.get('cant.have.two.file.number.same.patient'),
        );
      } else {
        if (patient.ramq) {
          fields.push({
            name: getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
            value: formatRamq(patient.ramq),
          });
        }
        if (
          patient.mrn &&
          initialData?.[PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION] === patient.mrn
        ) {
          fields.push({
            name: getName(PATIENT_DATA_FI_KEY.FILE_NUMBER),
            value: formatRamq(patient.mrn),
          });
        }

        if (patient.first_name) {
          fields.push({
            name: getName(PATIENT_DATA_FI_KEY.FIRST_NAME),
            value: patient.first_name,
          });
        }

        if (patient.last_name) {
          fields.push({
            name: getName(PATIENT_DATA_FI_KEY.LAST_NAME),
            value: patient.last_name,
          });
        }
        fields.push({
          name: getName(PATIENT_DATA_FI_KEY.BIRTH_DATE),
          value: format(new Date(patient.birth_date + TIME), INPUT_DATE_OUTPUT_FORMAT),
        });
      }

      form.setFields(fields);
    }
  };

  useEffect(() => setFileSearchDone(initialFileSearchDone), [initialFileSearchDone]);

  useEffect(() => setRamqSearchDone(initialRamqSearchDone), [initialRamqSearchDone]);

  useEffect(
    () => onRamqSearchStateChange && onRamqSearchStateChange(ramqSearchDone),
    // eslint-disable-next-line
    [ramqSearchDone],
  );

  useEffect(
    () => onFileSearchStateChange && onFileSearchStateChange(fileSearchDone),
    // eslint-disable-next-line
    [fileSearchDone],
  );

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setFileSearchDone(!!(initialData.no_mrn || initialData.mrn));
      setInitialValues(form, getName, initialData, PATIENT_DATA_FI_KEY);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.patientDataSearchWrapper}>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => (
          <Form.Item
            name={getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION)}
            label={intl.get('prescribing.institution')}
            rules={defaultFormItemsRules}
          >
            <Radio.Group
              disabled={
                disbledEP ||
                getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_FILE)) ||
                getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ)) ||
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
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          hasMotherRamq ? (
            <>
              <SearchOrNoneFormItem<IHybridFormPatients>
                disableReset
                form={form}
                noReset
                autoTriggerSearch={initialData?.[PATIENT_DATA_FI_KEY.RAMQ_NUMBER]}
                inputFormItemProps={{
                  name: getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
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
                    resetFieldError(form, getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER));
                    if (
                      extractBirthDateAndSexFromRamq(fixedRamq, INPUT_DATE_OUTPUT_FORMAT)
                        .birthDate &&
                      isRamqValid(fixedRamq)
                    ) {
                      (search as Function)(fixedRamq);
                    } else {
                      setFieldError(
                        form,
                        getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                        intl.get('ramq.number.invalid'),
                      );
                    }
                  },
                  onChange: (event) =>
                    setFieldValue(
                      form,
                      getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                      formatRamq(event.currentTarget.value),
                    ),
                }}
                checkboxFormItemProps={{
                  name: getName(PATIENT_DATA_FI_KEY.NO_RAMQ),
                  title:
                    parentKey === 'patient' ? intl.get('no.ramq.or.new.born') : intl.get('no.ramq'),
                }}
                onReset={() => {
                  onResetRamq && onResetRamq();
                  setRamqSearchDone(false);
                  form.resetFields([
                    getName(PATIENT_DATA_FI_KEY.FIRST_NAME),
                    getName(PATIENT_DATA_FI_KEY.LAST_NAME),
                    getName(PATIENT_DATA_FI_KEY.SEX),
                  ]);
                  dispatch(prescriptionFormActions.saveStepData({ patient: { id: null } }));
                }}
                onSearchDone={(values, searchValue) => {
                  setDisabledEP(true);
                  if (values?.patients && Array.isArray(values?.patients)) {
                    if (values.patients.length === 0 && searchValue) {
                      const ramqData = extractBirthDateAndSexFromRamq(
                        searchValue,
                        INPUT_DATE_OUTPUT_FORMAT,
                      );

                      if (ramqData.birthDate) {
                        setFieldValue(
                          form,
                          getName(PATIENT_DATA_FI_KEY.BIRTH_DATE),
                          ramqData.birthDate,
                        );
                        setFieldValue(form, getName(PATIENT_DATA_FI_KEY.SEX), ramqData.sex);
                      }
                    }
                    if (
                      isNewFileNumber &&
                      values.patients.filter(
                        (v) =>
                          v.organization_id ===
                          getFieldValue(getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION)),
                      ).length > 0
                    ) {
                      setFieldError(
                        form,
                        getName(PATIENT_DATA_FI_KEY.RAMQ_NUMBER),
                        intl.get('cant.have.two.file.number.same.patient'),
                      );
                    } else {
                      updateFormFromPatient(
                        form,
                        hybridToFormPatient(values.patients[0]),
                        PATIENT_DATA_FI_KEY.RAMQ_NUMBER,
                      );
                      setRamqSearchDone(true);
                    }
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
          ) : null
        }
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION)) ? (
            <SearchOrNoneFormItem<IHybridFormPatient>
              disableReset={!!prescriptionId && !!initialData?.[PATIENT_DATA_FI_KEY.FILE_NUMBER]}
              form={form}
              inputFormItemProps={{
                name: getName(PATIENT_DATA_FI_KEY.FILE_NUMBER),
                rules: [
                  {
                    required: true,
                    validateTrigger: 'onSubmit',
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error(intl.get('this.field.is.required')));
                      }

                      if (!fileSearchDone) {
                        return Promise.reject(new Error('Cliquer sur rechercher'));
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
                      getName(PATIENT_DATA_FI_KEY.FILE_NUMBER),
                      intl.get('must.not.contain.special.characters'),
                    );
                  } else {
                    (search as Function)(fixedFileNumber);
                  }
                },
              }}
              checkboxFormItemProps={{
                name: getName(PATIENT_DATA_FI_KEY.NO_FILE),
                title: intl.get('no.folder.number'),
              }}
              checkboxProps={{
                onChange: (e) => setFileSearchDone(e.target.checked),
              }}
              onReset={() => {
                setDisabledEP(false);
                setFileSearchDone(false);
                form.resetFields([getName(PATIENT_DATA_FI_KEY.NO_FILE)]);
              }}
              onSearchDone={(value) => {
                updateFormFromPatient(
                  form,
                  hybridToFormPatient(value),
                  PATIENT_DATA_FI_KEY.FILE_NUMBER,
                );
                setFileSearchDone(true);
                setIsNewFileNumber(isEmpty(value));
              }}
              apiPromise={(value) =>
                HybridApi.searchPatient({
                  organization_id: getFieldValue(
                    getName(PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION),
                  ),
                  mrn: value,
                })
              }
              disabled={fileSearchDone && !getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_FILE))}
            />
          ) : null
        }
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ)) || ramqSearchDone ? (
            <>
              <Form.Item
                name={getName(PATIENT_DATA_FI_KEY.LAST_NAME)}
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
                name={getName(PATIENT_DATA_FI_KEY.FIRST_NAME)}
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
                  name: getName(PATIENT_DATA_FI_KEY.BIRTH_DATE),
                  required: true,
                }}
                moreRules={[dateNotLaterThanTodayRule]}
              />
              <Form.Item
                name={getName(PATIENT_DATA_FI_KEY.SEX)}
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

export default MotherDataSearch;
