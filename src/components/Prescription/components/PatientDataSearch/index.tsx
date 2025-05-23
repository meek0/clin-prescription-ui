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
  extractBirthDateAndSexFromJhn,
  formatJhn,
  isJhnValid,
} from 'components/Prescription/utils/ramq';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { useAppDispatch } from 'store';
import { usePrescriptionForm, usePrescriptionFormConfig } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import { hasSpecialCharacters } from 'utils/helper';

import { IPatientDataType } from './types';

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  onJhnSearchStateChange?: (done: boolean) => void;
  onFileSearchStateChange?: (done: boolean) => void;
  onResetJhn?: () => void;
  initialFileSearchDone?: boolean;
  initialjhnSearchDone?: boolean;
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
  onJhnSearchStateChange,
  onFileSearchStateChange,
  onResetJhn,
  initialData,
  populateFromJhn,
}: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const { prescriptionId } = usePrescriptionForm();
  const dispatch = useAppDispatch();
  const [isNewFileNumber, setIsNewFileNumber] = useState(false);
  const [fileSearchDone, setFileSearchDone] = useState(false);
  const [jhnSearchDone, setJhnSearchDone] = useState(false);
  const getName = (...key: IGetNamePathParams) => getNamePath(parentKey, key);

  function updateFormFromPatient(form: FormInstance, patient?: IHybridPatientForm) {
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
          value: formatJhn(patient.jhn),
        });

      if (patient.mrn && populateFromJhn?.organization_id === patient.organization_id) {
        fields.push({
          name: getName('mrn' satisfies keyof IPatientDataType),
          value: patient.mrn,
        });
      } else if (!form.getFieldValue(getName('mrn' satisfies keyof IPatientDataType))) {
        fields.push({
          name: getName('no_mrn' satisfies keyof IPatientDataType),
          value: 'true',
        });
      }

      form.setFields(fields);
    }
  }

  // JHN logic change if populateFromJhn is provided (new born)
  function getJhnFormItem(getFieldValue: FormInstance['getFieldValue']) {
    return (
      <SearchOrNoneFormItem<{ patients: IHybridPatientForm[] }>
        disableReset={
          !!populateFromJhn ||
          (!!prescriptionId &&
            ((!isNewFileNumber && jhnSearchDone) ||
              !!initialData?.['jhn' satisfies keyof IPatientDataType]))
        }
        form={form}
        noReset={!!populateFromJhn}
        inputFormItemProps={{
          name: getName('jhn' satisfies keyof IPatientDataType),
          rules: [
            {
              required: true,
              validateTrigger: 'onSubmit',
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error(intl.get('this.field.is.required')));
                } else if (!isJhnValid(value)) {
                  return Promise.reject(new Error(intl.get('ramq.number.invalid')));
                } else if (!jhnSearchDone) {
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
              onResetJhn && onResetJhn();
            }
          },
        }}
        inputProps={{
          placeholder: 'AAAA 0000 0000',
          onSearch: (value, search) => {
            const fixedJhn = value.replace(/\s/g, '');
            resetFieldError(form, getName('jhn' satisfies keyof IPatientDataType));
            if (
              extractBirthDateAndSexFromJhn(fixedJhn, INPUT_DATE_OUTPUT_FORMAT).birthDate &&
              isJhnValid(fixedJhn)
            ) {
              (search as Function)(fixedJhn);
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
              formatJhn(event.currentTarget.value),
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
          onResetJhn && onResetJhn();
          setJhnSearchDone(false);
          form.resetFields([
            getName('first_name' satisfies keyof IPatientDataType),
            getName('last_name' satisfies keyof IPatientDataType),
            getName('sex' satisfies keyof IPatientDataType),
          ]);
          if (!populateFromJhn)
            form.resetFields([
              getName('no_jhn' satisfies keyof IPatientDataType),
              getName('birth_date' satisfies keyof IPatientDataType),
            ]);
          if (parentKey === STEPS_ID.PROBAND_IDENTIFICATION)
            dispatch(prescriptionFormActions.saveStepData({ patient: { id: null } }));
        }}
        onSearchDone={(value, searchValue) => {
          const patients = value?.patients;
          if (!patients) return;
          if (!patients.length && searchValue) {
            const jhnData = extractBirthDateAndSexFromJhn(searchValue, INPUT_DATE_OUTPUT_FORMAT);

            if (jhnData.birthDate) {
              setFieldValue(
                form,
                getName('birth_date' satisfies keyof IPatientDataType),
                jhnData.birthDate,
              );
              setFieldValue(form, getName('sex' satisfies keyof IPatientDataType), jhnData.sex);
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
            setJhnSearchDone(true);
          }
        }}
        apiPromise={(value) =>
          HybridApi.searchPatients({
            jhn: value,
          })
        }
        disabled={
          !!populateFromJhn ||
          (jhnSearchDone && !getFieldValue(getName('no_jhn' satisfies keyof IPatientDataType))) ||
          (prescriptionId && getFieldValue(getName('no_jhn' satisfies keyof IPatientDataType)))
        }
      />
    );
  }

  useEffect(
    () => onJhnSearchStateChange?.(jhnSearchDone),
    // eslint-disable-next-line
    [jhnSearchDone],
  );
  useEffect(
    () => onFileSearchStateChange?.(fileSearchDone),
    // eslint-disable-next-line
    [fileSearchDone],
  );
  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setFileSearchDone(!!(initialData.no_mrn || initialData.mrn));
      setJhnSearchDone(!!(initialData.no_jhn || initialData.jhn));
      setInitialValues(
        form,
        getName,
        initialData,
        Object.keys(initialData).filter((key) => !['status', 'reason'].includes(key)),
      );
    }
    // Populate from JHN if available
    if (populateFromJhn) {
      setFieldValue(
        form,
        getName('organization_id' satisfies keyof IPatientDataType),
        populateFromJhn.organization_id,
      );
      setFieldValue(form, getName('jhn' satisfies keyof IPatientDataType), populateFromJhn.jhn);
      const jhnData = extractBirthDateAndSexFromJhn(
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
      HybridApi.searchPatients({ jhn: populateFromJhn.jhn.replace(/\s/g, '') }).then(({ data }) => {
        const motherData = data?.patients?.[0];
        setJhnSearchDone(true);
        if (!motherData) return;
        updateFormFromPatient(form, motherData);
      });
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
          {({ getFieldValue }) => getJhnFormItem(getFieldValue)}
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
                  setJhnSearchDone(false);
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
                    setJhnSearchDone(true);
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
                  : jhnSearchDone ||
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
            getFieldValue(getName('no_mrn' satisfies keyof IPatientDataType)) || fileSearchDone
              ? getJhnFormItem(getFieldValue)
              : null
          }
        </Form.Item>
      )}

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue(getName('no_jhn' satisfies keyof IPatientDataType)) || jhnSearchDone ? (
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
