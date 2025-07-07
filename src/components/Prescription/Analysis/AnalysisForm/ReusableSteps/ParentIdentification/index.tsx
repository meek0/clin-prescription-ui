import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import Collapse, { CollapsePanel } from '@ferlab/ui/core/components/Collapse';
import { Form, Input, Radio, Space, Typography } from 'antd';
import cx from 'classnames';
import { isEmpty } from 'lodash';

import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import ClinicalSignsSelect from 'components/Prescription/components/ClinicalSignsSelect';
import PatientDataSearch from 'components/Prescription/components/PatientDataSearch';
import { PATIENT_DATA_FI_KEY } from 'components/Prescription/components/PatientDataSearch/types';
import {
  checkShouldUpdate,
  getNamePath,
  setFieldValue,
  setInitialValues,
} from 'components/Prescription/utils/form';
import { IAnalysisStepForm, IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';
import { SexValue } from 'utils/commonTypes';

import { defaultCollapseProps, defaultFormItemsRules, STEPS_ID } from '../constant';
import { additionalInfoKey } from '../PatientIdentification/AdditionalInformation';

import {
  ClinicalStatusValue,
  EnterInfoMomentValue,
  PARENT_DATA_FI_KEY,
  TParentDataType,
} from './types';

import styles from './index.module.css';

type OwnProps = IAnalysisStepForm & {
  parent: 'mother' | 'father';
};

const { Text } = Typography;

const ParentIdentification = ({ parent }: OwnProps) => {
  const FORM_NAME =
    parent === 'father' ? STEPS_ID.FATHER_IDENTIFICATION : STEPS_ID.MOTHER_IDENTIFICATION;

  const [form] = Form.useForm();
  const [ramqSearchDone, setRamqSearchDone] = useState(false);
  const { analysisData, isAddingParent } = usePrescriptionForm();

  const hideParentIdentificationForm =
    parent === 'mother' &&
    analysisData &&
    analysisData[STEPS_ID.PATIENT_IDENTIFICATION]?.[additionalInfoKey]?.is_prenatal_diagnosis;

  const getName = (...key: IGetNamePathParams) => getNamePath(FORM_NAME, key);
  const initialData = analysisData?.[FORM_NAME] as TParentDataType;
  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setInitialValues(form, getName, initialData, PARENT_DATA_FI_KEY);
    } else if (isAddingParent) {
      setFieldValue(form, getName(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT), EnterInfoMomentValue.NOW);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <AnalysisForm form={form} className={styles.parentIdentificationForm} name={FORM_NAME}>
      <div
        className={cx(styles.parentInfoChoiceWrapper, isAddingParent ? styles.hideMomentField : '')}
      >
        <Form.Item>
          <Text>{intl.get('prescription.parent.info.notice')}</Text>
        </Form.Item>
        <Form.Item
          name={getName(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT)}
          label={intl.get(`prescription.parent.info.moment.${parent}`)}
          rules={defaultFormItemsRules}
        >
          <Radio.Group>
            <Radio value={EnterInfoMomentValue.NOW}>
              {intl.get('prescription.parent.info.moment.options.now')}
            </Radio>
            <Radio value={EnterInfoMomentValue.LATER}>
              {intl.get('prescription.parent.info.moment.options.later')}
            </Radio>
            <Radio value={EnterInfoMomentValue.NEVER}>
              {intl.get('prescription.parent.info.moment.options.never')}
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const value = getFieldValue(getName(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT));
            return value && value !== EnterInfoMomentValue.NOW ? (
              <Form.Item
                label={intl.get('prescription.parent.info.moment.justify')}
                name={getName(PARENT_DATA_FI_KEY.NO_INFO_REASON)}
                rules={defaultFormItemsRules}
                className="noMarginBtm"
              >
                <Input.TextArea
                  rows={2}
                  placeholder={intl.get(`prescription.parent.info.moment.justify.${value}`)} // later / never
                />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
      </div>
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) =>
          checkShouldUpdate(prev, next, [getName(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT)])
        }
      >
        {({ getFieldValue }) => {
          const sex =
            initialData?.[PATIENT_DATA_FI_KEY.SEX] ||
            (parent === 'father' ? SexValue.MALE : SexValue.FEMALE);

          return getFieldValue(getName(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT)) ===
            EnterInfoMomentValue.NOW && !hideParentIdentificationForm ? (
            <Space direction="vertical" className={styles.formContentWrapper}>
              <Collapse {...defaultCollapseProps} defaultActiveKey={[parent]}>
                <CollapsePanel
                  key={parent}
                  header={intl.get(`prescription.parent.info.title.${parent}`)}
                >
                  <PatientDataSearch
                    form={form}
                    parentKey={FORM_NAME}
                    initialData={{
                      ...initialData,
                      [PATIENT_DATA_FI_KEY.SEX]: sex,
                    }}
                    onRamqSearchStateChange={setRamqSearchDone}
                    initialRamqSearchDone={ramqSearchDone}
                    onResetRamq={() => {}}
                    populateFromJhn={
                      parent === 'mother' && analysisData?.patient?.[additionalInfoKey]?.is_new_born
                        ? {
                            jhn: analysisData?.patient?.[additionalInfoKey]?.mother_ramq,
                            organization_id: analysisData?.patient?.ep,
                          }
                        : undefined
                    }
                  />
                </CollapsePanel>
              </Collapse>
            </Space>
          ) : null;
        }}
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) =>
          checkShouldUpdate(prev, next, [
            getName(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT),
            getName(PARENT_DATA_FI_KEY.CLINICAL_STATUS),
            getName(PATIENT_DATA_FI_KEY.NO_RAMQ),
          ])
        }
      >
        {({ getFieldValue }) =>
          getFieldValue(getName(PARENT_DATA_FI_KEY.ENTER_INFO_MOMENT)) ===
            EnterInfoMomentValue.NOW &&
          (hideParentIdentificationForm ||
            ramqSearchDone ||
            getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ))) ? (
            <Collapse {...defaultCollapseProps} defaultActiveKey={['clinical_information']}>
              <CollapsePanel
                key="clinical_information"
                header={intl.get(`prescription.parent.info.clinical.title.${parent}`)}
              >
                <Form.Item
                  name={getName(PARENT_DATA_FI_KEY.CLINICAL_STATUS)}
                  label={intl.get('status')}
                  rules={defaultFormItemsRules}
                >
                  <Radio.Group>
                    <Radio value={ClinicalStatusValue.AFFECTED}>
                      {intl.get('prescription.parent.info.clinicalstatus.options.affected')}
                    </Radio>
                    <Radio value={ClinicalStatusValue.NOT_AFFECTED}>
                      {intl.get('prescription.parent.info.clinicalstatus.options.notaffected')}
                    </Radio>
                    <Radio value={ClinicalStatusValue.UNKNOWN}>
                      {intl.get('prescription.parent.info.clinicalstatus.options.unknown')}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                {getFieldValue(getName(PARENT_DATA_FI_KEY.CLINICAL_STATUS)) ===
                  ClinicalStatusValue.AFFECTED && (
                  <ClinicalSignsSelect
                    form={form}
                    parentKey={FORM_NAME}
                    hpoIsOptional={true}
                    initialData={initialData}
                  />
                )}
              </CollapsePanel>
            </Collapse>
          ) : null
        }
      </Form.Item>
    </AnalysisForm>
  );
};

export default ParentIdentification;
