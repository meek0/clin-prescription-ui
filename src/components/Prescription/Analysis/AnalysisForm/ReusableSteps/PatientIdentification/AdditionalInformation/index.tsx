import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { Checkbox, Form, Input, Radio, Space } from 'antd';
import { isEmpty } from 'lodash';

import {
  checkShouldUpdate,
  getNamePath,
  setFieldValue,
  setInitialValues,
} from 'components/Prescription/utils/form';
import { formatRamq, RAMQ_PATTERN } from 'components/Prescription/utils/ramq';
import { IAnalysisFormPart, IGetNamePathParams } from 'components/Prescription/utils/type';
import RadioDateFormItem from 'components/uiKit/form/RadioDateFormItem';
import RadioGroupSex from 'components/uiKit/form/RadioGroupSex';
import { calculateGestationalAgeFromDDM, calculateGestationalAgeFromDPA } from 'utils/age';
import { SexValue } from 'utils/commonTypes';

import GestationalAge from './GestationalAge';

import styles from './index.module.scss';

type OwnProps = IAnalysisFormPart & {
  showNewBornSection?: boolean;
  initialData?: IAddInfoDataContent;
};

export enum GestationalAgeValues {
  DDM = 'ddm',
  DPA = 'dpa',
  DEAD_FOETUS = 'deceased',
}

export enum ADD_INFO_FI_KEY {
  GESTATIONAL_AGE = 'gestational_age',
  GESTATIONAL_DATE_DDM = 'gestational_date',
  GESTATIONAL_DATE_DPA = 'gestational_date',
  PRENATAL_DIAGNOSIS = 'is_prenatal_diagnosis',
  FOETUS_SEX = 'foetus_gender',
  NEW_BORN = 'is_new_born',
  MOTHER_RAMQ_NUMBER = 'mother_ramq',
}

export const additionalInfoKey = 'additional_info';

export interface IAddInfoDataType {
  [additionalInfoKey]: IAddInfoDataContent;
}

export interface IAddInfoDataContent {
  [ADD_INFO_FI_KEY.GESTATIONAL_AGE]: GestationalAgeValues;
  [ADD_INFO_FI_KEY.GESTATIONAL_DATE_DDM]: string;
  [ADD_INFO_FI_KEY.GESTATIONAL_DATE_DPA]: string;
  [ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS]: boolean;
  [ADD_INFO_FI_KEY.FOETUS_SEX]: SexValue;
  [ADD_INFO_FI_KEY.NEW_BORN]: boolean;
  [ADD_INFO_FI_KEY.MOTHER_RAMQ_NUMBER]: string;
}

const AdditionalInformation = ({
  form,
  parentKey,
  showNewBornSection = false,
  initialData,
}: OwnProps) => {
  const [localShowNewBorn, setLocalShowNewBorn] = useState(showNewBornSection);
  const [gestationalAgeDPA, setGestationalAgeDPA] = useState<number | undefined>(undefined);
  const [gestationalAgeDDM, setGestationalAgeDDM] = useState<number | undefined>(undefined);

  const getName = (...key: IGetNamePathParams) =>
    getNamePath([parentKey as string, additionalInfoKey], key);

  useEffect(() => {
    if (localShowNewBorn !== showNewBornSection) {
      setLocalShowNewBorn(showNewBornSection);
    }
    // eslint-disable-next-line
  }, [showNewBornSection]);

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      if (initialData.gestational_age === GestationalAgeValues.DDM) {
        setGestationalAgeDDM(
          calculateGestationalAgeFromDDM(new Date(initialData.gestational_date)),
        );
      }

      if (initialData.gestational_age === GestationalAgeValues.DPA) {
        setGestationalAgeDPA(
          calculateGestationalAgeFromDPA(new Date(initialData.gestational_date)),
        );
      }

      setInitialValues(form, getName, initialData, ADD_INFO_FI_KEY);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.patientAddInfoWrapper}>
      <Form.Item
        label={intl.get('prescription.patient.identification.prenatal.diagnosis')}
        name={getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS)}
        valuePropName="checked"
      >
        <Checkbox disabled={form.getFieldValue(getName(ADD_INFO_FI_KEY.NEW_BORN))}>Oui</Checkbox>
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
                name={getName(ADD_INFO_FI_KEY.FOETUS_SEX)}
                label={intl.get('prescription.patient.identification.sexe.foetus')}
                rules={[{ required: true }]}
              >
                <RadioGroupSex />
              </Form.Item>
              <Form.Item
                label={intl.get('prescription.patient.identification.gestational.age')}
                name={getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE)}
                rules={[{ required: true }]}
              >
                <Radio.Group
                  onChange={(value) => {
                    if (value.target.name === GestationalAgeValues.DDM) {
                      setGestationalAgeDDM(undefined);
                      setFieldValue(getName(ADD_INFO_FI_KEY.GESTATIONAL_DATE_DDM), undefined);
                    } else {
                      setGestationalAgeDPA(undefined);
                      setFieldValue(getName(ADD_INFO_FI_KEY.GESTATIONAL_DATE_DPA), undefined);
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
                          name: getName(ADD_INFO_FI_KEY.GESTATIONAL_DATE_DDM),
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
                      parentFormItemName={getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE)}
                    />
                    <RadioDateFormItem
                      title={intl.get('prescription.patient.identification.last.dpa.date')}
                      radioProps={{
                        value: GestationalAgeValues.DPA,
                        name: GestationalAgeValues.DPA,
                      }}
                      dateInputProps={{
                        formItemProps: {
                          name: getName(ADD_INFO_FI_KEY.GESTATIONAL_DATE_DPA),
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
                      parentFormItemName={getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE)}
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
                  name={getName(ADD_INFO_FI_KEY.MOTHER_RAMQ_NUMBER)}
                  rules={[{ type: 'regexp', pattern: RAMQ_PATTERN, required: true }]}
                  wrapperCol={{ span: 10, sm: 12, xxl: 6 }}
                >
                  <Input
                    placeholder="AAAA 0000 0000"
                    onChange={(e) =>
                      setFieldValue(
                        form,
                        getName(ADD_INFO_FI_KEY.MOTHER_RAMQ_NUMBER),
                        formatRamq(e.currentTarget.value),
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

export default AdditionalInformation;
