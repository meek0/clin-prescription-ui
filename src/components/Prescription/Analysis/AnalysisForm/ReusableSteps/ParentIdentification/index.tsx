import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import Collapse, { CollapsePanel } from '@ferlab/ui/core/components/Collapse';
import { Form, Input, Radio, Space, Typography } from 'antd';
import cx from 'classnames';
import { isEmpty } from 'lodash';

import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import ClinicalSignsSelect from 'components/Prescription/components/ClinicalSignsSelect';
import PatientDataSearch from 'components/Prescription/components/PatientDataSearch';
import {
  checkShouldUpdate,
  getNamePath,
  setFieldValue,
  setInitialValues,
} from 'components/Prescription/utils/form';
import { IAnalysisStepForm, IGetNamePathParams } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';
import { GenomeAnalysisType } from 'store/prescription/types';
import { SexValue } from 'utils/commonTypes';

import { defaultCollapseProps, defaultFormItemsRules, STEPS_ID } from '../constant';

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
  const [jhnSearchDone, setJhnSearchDone] = useState(false);
  const { analysisFormData, isAddingParent } = usePrescriptionForm();

  const hideParentIdentificationForm =
    parent === 'mother' && analysisFormData?.proband?.foetus?.is_prenatal_diagnosis;

  const getName = (...key: IGetNamePathParams) => getNamePath(FORM_NAME, key);
  const initialData = analysisFormData[FORM_NAME];

  useEffect(() => {
    if (initialData && !isEmpty(initialData)) {
      setInitialValues(form, getName, initialData);
    } else if (isAddingParent) {
      setFieldValue(
        form,
        getName('status' satisfies keyof TParentDataType),
        EnterInfoMomentValue.NOW,
      );
    }

    // eslint-disable-next-line
  }, []);

  return (
    <AnalysisForm form={form} className={styles.parentIdentificationForm} name={FORM_NAME}>
      <div
        className={cx(styles.parentInfoChoiceWrapper, isAddingParent ? styles.hideMomentField : '')}
      >
        <Form.Item>
          <Text>
            {intl.get(
              Object.values(GenomeAnalysisType).includes(
                analysisFormData.analysis.panel_code as GenomeAnalysisType,
              )
                ? 'prescription.parent.info.notice.genome'
                : 'prescription.parent.info.notice',
            )}
          </Text>
        </Form.Item>
        <Form.Item
          name={getName('status' satisfies keyof TParentDataType)}
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
            const value = getFieldValue(getName('status' satisfies keyof TParentDataType));
            return value && value !== EnterInfoMomentValue.NOW ? (
              <Form.Item
                label={intl.get('prescription.parent.info.moment.justify')}
                name={getName('reason' satisfies keyof TParentDataType)}
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
          checkShouldUpdate(prev, next, [getName('status' satisfies keyof TParentDataType)])
        }
      >
        {({ getFieldValue }) =>
          getFieldValue(getName('status' satisfies keyof TParentDataType)) ===
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
                    initialData={
                      initialData
                        ? {
                            ...initialData,
                            sex:
                              initialData.sex ||
                              (parent === 'father' ? SexValue.MALE : SexValue.FEMALE),
                          }
                        : undefined
                    }
                    onJhnSearchStateChange={setJhnSearchDone}
                    initialjhnSearchDone={jhnSearchDone}
                    onResetJhn={() => {}}
                    populateFromJhn={
                      parent === 'mother' && analysisFormData?.proband?.foetus?.is_new_born
                        ? {
                            jhn: analysisFormData?.proband?.foetus?.mother_jhn,
                            organization_id: analysisFormData?.proband?.organization_id,
                          }
                        : undefined
                    }
                  />
                </CollapsePanel>
              </Collapse>
            </Space>
          ) : null
        }
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) =>
          checkShouldUpdate(prev, next, [
            getName('status' satisfies keyof TParentDataType),
            getName(PARENT_DATA_FI_KEY.CLINICAL_STATUS),
            getName('no_jhn'),
          ])
        }
      >
        {({ getFieldValue }) =>
          getFieldValue(getName('status' satisfies keyof TParentDataType)) ===
            EnterInfoMomentValue.NOW &&
          (hideParentIdentificationForm || jhnSearchDone || getFieldValue(getName('no_jhn'))) ? (
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
