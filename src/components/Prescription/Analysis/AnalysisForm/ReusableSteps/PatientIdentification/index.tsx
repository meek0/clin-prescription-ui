/* eslint-disable */
import Collapse, { CollapsePanel } from '@ferlab/ui/core/components/Collapse';
import { Form, Space } from 'antd';
import { useState } from 'react';

import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import PatientDataSearch from 'components/Prescription/components/PatientDataSearch';
import { getNamePath } from 'components/Prescription/utils/form';
import { IAnalysisStepForm } from 'components/Prescription/utils/type';
import { usePrescriptionForm } from 'store/prescription';

import { defaultCollapseProps, STEPS_ID } from '../constant';

import AdditionalInformation, {
  additionalInfoKey, ADD_INFO_FI_KEY, IAddInfoDataType
} from './AdditionalInformation';

import styles from './index.module.css';
import { IPatientDataType, PATIENT_DATA_FI_KEY } from 'components/Prescription/components/PatientDataSearch/types';

export type TPatientFormDataType = IPatientDataType & IAddInfoDataType;

const PatientIdentification = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.PATIENT_IDENTIFICATION;
  const [form] = Form.useForm();
  const { analysisData } = usePrescriptionForm();
  const [ramqSearchDone, setRamqSearchDone] = useState(false);

  const getName = (...key: string[]) => getNamePath(FORM_NAME, key);
  const initialData = analysisData ? analysisData[FORM_NAME] : undefined;

  return (
    <AnalysisForm form={form} className={styles.patientIdentificationForm} name={FORM_NAME}>
      <Space direction="vertical" className={styles.formContentWrapper}>
        <Collapse {...defaultCollapseProps} defaultActiveKey={['patient']}>
          <CollapsePanel key="patient" header="Patient">
            <PatientDataSearch
              form={form}
              parentKey={FORM_NAME}
              onRamqSearchStateChange={setRamqSearchDone}
              initialRamqSearchDone={ramqSearchDone}
              initialData={initialData}
              onResetRamq={() => {
                form.resetFields([
                  getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS),
                  getName(ADD_INFO_FI_KEY.FOETUS_SEX),
                  getName(ADD_INFO_FI_KEY.GESTATIONAL_AGE),
                  getName(ADD_INFO_FI_KEY.NEW_BORN),
                ]);
              }}
            />
          </CollapsePanel>
        </Collapse>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ)) || ramqSearchDone ? (
              <Collapse {...defaultCollapseProps} defaultActiveKey={['additional_information']}>
                <CollapsePanel key="additional_information" header="Informations supplémentaires">
                  <AdditionalInformation
                    form={form}
                    parentKey={FORM_NAME}
                    showNewBornSection={getFieldValue(getName(PATIENT_DATA_FI_KEY.NO_RAMQ))}
                    initialData={initialData?.[additionalInfoKey]}
                  />
                </CollapsePanel>
              </Collapse>
            ) : null
          }
        </Form.Item>
      </Space>
    </AnalysisForm>
  );
};

export default PatientIdentification;
