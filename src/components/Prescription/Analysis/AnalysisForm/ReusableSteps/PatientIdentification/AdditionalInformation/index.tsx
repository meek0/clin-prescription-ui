import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { Checkbox, Form, Input, Radio, Space } from 'antd';
import { HybridPatientFoetus } from 'api/hybrid/models';
import { isEmpty } from 'lodash';

import RadioDateFormItem from 'components/Form/RadioDateFormItem';
import RadioGroupSex from 'components/Form/RadioGroupSex';
import { STEPS_ID } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  dateNotEarlierThanTodayRule,
  dateNotLaterThanTodayRule,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  checkShouldUpdate,
  getNamePath,
  setFieldValue,
  setInitialValues,
} from 'components/Prescription/utils/form';
import { formatJhn, isJhnValid } from 'components/Prescription/utils/ramq';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';
import { calculateGestationalAgeFromDDM, calculateGestationalAgeFromDPA } from 'utils/age';

import { TProbandDataType } from '../types';

import GestationalAge from './GestationalAge';

import styles from './index.module.css';

type OwnProps = IAnalysisFormPart & {
  showNewBornSection?: boolean;
  initialData?: TProbandDataType['foetus'];
};

export enum GestationalAgeValues {
  DDM = 'DDM',
  DPA = 'DPA',
  DEAD_FOETUS = 'DECEASED',
}

export enum ADD_INFO_FI_KEY {
  PRENATAL_DIAGNOSIS = 'is_prenatal_diagnosis',
  NEW_BORN = 'is_new_born',
}

const FoetusInfos = ({ form, parentKey, showNewBornSection = false, initialData }: OwnProps) => {
  const [localShowNewBorn, setLocalShowNewBorn] = useState(showNewBornSection);
  const [gestationalAgeDPA, setGestationalAgeDPA] = useState<number | undefined>(undefined);
  const [gestationalAgeDDM, setGestationalAgeDDM] = useState<number | undefined>(undefined);
  const { isDraft } = usePrescriptionForm();

  const patientSexField = Form.useWatch(
    [STEPS_ID.PROBAND_IDENTIFICATION, 'sex' satisfies keyof TProbandDataType],
    form,
  );

  const getName = (...key: IGetNamePathParams) =>
    getNamePath([parentKey as string, 'foetus' satisfies keyof TProbandDataType], key);

  useEffect(() => {
    if (localShowNewBorn !== showNewBornSection) {
      setLocalShowNewBorn(showNewBornSection);
    }
    if (!showNewBornSection) {
      form.setFieldValue(getName(ADD_INFO_FI_KEY.NEW_BORN), false);
    }
    // eslint-disable-next-line
  }, [showNewBornSection]);

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      if (initialData.gestational_method)
        form.setFieldValue(getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS), true);
      if (initialData.gestational_method === GestationalAgeValues.DDM) {
        setGestationalAgeDDM(
          calculateGestationalAgeFromDDM(new Date(initialData.gestational_date)),
        );
      }

      if (initialData.gestational_method === GestationalAgeValues.DPA) {
        setGestationalAgeDPA(
          calculateGestationalAgeFromDPA(new Date(initialData.gestational_date)),
        );
      }

      setInitialValues(form, getName, initialData);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (patientSexField == 'MALE') {
      form.setFieldValue(getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS), false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientSexField]);

  return (
    <div className={styles.patientAddInfoWrapper}>
      <Form.Item
        label={intl.get('prescription.patient.identification.prenatal.diagnosis')}
        name={getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS)}
        valuePropName="checked"
      >
        <Checkbox
          disabled={
            form.getFieldValue(getName(ADD_INFO_FI_KEY.NEW_BORN)) || patientSexField == 'MALE'
          }
        >
          {intl.get('yes')}
        </Checkbox>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) =>
          checkShouldUpdate(prev, next, [getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS)])
        }
      >
        {({ getFieldValue, setFieldValue }) =>
          getFieldValue(getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS)) ? (
            <>
              <Form.Item
                name={getName('sex' satisfies keyof HybridPatientFoetus)}
                label={intl.get('prescription.patient.identification.sexe.foetus')}
                rules={[{ required: true }]}
              >
                <RadioGroupSex />
              </Form.Item>
              <Form.Item
                label={intl.get('prescription.patient.identification.gestational.age')}
                name={getName('gestational_method' satisfies keyof HybridPatientFoetus)}
                rules={[{ required: true }]}
              >
                <Radio.Group
                  onChange={(value) => {
                    if (value.target.name === GestationalAgeValues.DDM) {
                      setGestationalAgeDDM(undefined);
                      setGestationalAgeDPA(undefined);
                      setFieldValue(
                        getName('gestational_date' satisfies keyof HybridPatientFoetus),
                        undefined,
                      );
                    } else {
                      setGestationalAgeDPA(undefined);
                      setGestationalAgeDDM(undefined);
                      setFieldValue(
                        getName('gestational_date' satisfies keyof HybridPatientFoetus),
                        undefined,
                      );
                    }
                  }}
                >
                  <Space direction="vertical" className={styles.verticalRadioWrapper}>
                    <RadioDateFormItem
                      title={intl.get('prescription.patient.identification.last.ddm.date')}
                      radioProps={{
                        value: GestationalAgeValues.DDM,
                        name: GestationalAgeValues.DDM,
                      }}
                      dateInputProps={{
                        formItemProps: {
                          name: getName('gestational_date' satisfies keyof HybridPatientFoetus),
                          required: true,
                        },
                        extra: <GestationalAge value={gestationalAgeDDM} />,
                        onValidate: (valid, value) => {
                          if (!valid && gestationalAgeDDM) {
                            setGestationalAgeDDM(undefined);
                          } else {
                            setGestationalAgeDDM(calculateGestationalAgeFromDDM(value));
                          }
                        },
                      }}
                      moreDateRules={[dateNotLaterThanTodayRule]}
                      parentFormItemName={getName(
                        'gestational_method' satisfies keyof HybridPatientFoetus,
                      )}
                    />
                    <RadioDateFormItem
                      title={intl.get('prescription.patient.identification.last.dpa.date')}
                      radioProps={{
                        value: GestationalAgeValues.DPA,
                        name: GestationalAgeValues.DPA,
                      }}
                      dateInputProps={{
                        formItemProps: {
                          name: getName('gestational_date' satisfies keyof HybridPatientFoetus),
                          required: true,
                        },
                        extra: <GestationalAge value={gestationalAgeDPA} />,
                        onValidate: (valid, value) => {
                          if (!valid && gestationalAgeDPA) {
                            setGestationalAgeDPA(undefined);
                          } else {
                            setGestationalAgeDPA(calculateGestationalAgeFromDPA(value));
                          }
                        },
                      }}
                      moreDateRules={!isDraft ? [dateNotEarlierThanTodayRule] : []}
                      parentFormItemName={getName(
                        'gestational_method' satisfies keyof HybridPatientFoetus,
                      )}
                    />
                    <Radio value={GestationalAgeValues.DEAD_FOETUS}>
                      {intl.get('prescription.patient.identification.foetus.dead')}
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </>
          ) : null
        }
      </Form.Item>
      {localShowNewBorn && (
        <>
          <Form.Item
            label={intl.get('prescription.patient.identification.new.born')}
            name={getName(ADD_INFO_FI_KEY.NEW_BORN)}
            valuePropName="checked"
          >
            <Checkbox disabled={form.getFieldValue(getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS))}>
              {intl.get('yes')}
            </Checkbox>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, next) =>
              checkShouldUpdate(prev, next, [getName(ADD_INFO_FI_KEY.NEW_BORN)])
            }
          >
            {({ getFieldValue }) =>
              getFieldValue(getName(ADD_INFO_FI_KEY.NEW_BORN)) ? (
                <Form.Item
                  label={intl.get('prescription.patient.identification.mother.ramq')}
                  name={getName('mother_jhn' satisfies keyof HybridPatientFoetus)}
                  rules={[
                    {
                      required: true,
                      validateTrigger: 'onSumbit',
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject(new Error(intl.get('this.field.is.required')));
                        } else if (!isJhnValid(value)) {
                          return Promise.reject(new Error(intl.get('ramq.number.invalid')));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  wrapperCol={{ span: 10, sm: 12, xxl: 6 }}
                >
                  <Input
                    placeholder="AAAA 0000 0000"
                    onChange={(e) =>
                      setFieldValue(
                        form,
                        getName('mother_jhn' satisfies keyof HybridPatientFoetus),
                        formatJhn(e.currentTarget.value),
                      )
                    }
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </>
      )}
    </div>
  );
};

export default FoetusInfos;
