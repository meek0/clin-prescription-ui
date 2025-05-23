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

import FoetusInfos, { ADD_INFO_FI_KEY } from './AdditionalInformation';

import styles from './index.module.css';
import { HybridPatientFoetus } from 'api/hybrid/models';

const PatientIdentification = ({}: IAnalysisStepForm) => {
  const FORM_NAME = STEPS_ID.PROBAND_IDENTIFICATION;
  const [form] = Form.useForm();
  const { analysisFormData } = usePrescriptionForm();
  const [jhnSearchDone, setJhnSearchDone] = useState(false);

  const getName = (...key: string[]) => getNamePath(FORM_NAME, key);
  const initialData = analysisFormData ? analysisFormData[FORM_NAME] : undefined;

  return (
    <AnalysisForm form={form} className={styles.patientIdentificationForm} name={FORM_NAME}>
      <Space direction="vertical" className={styles.formContentWrapper}>
        <Collapse {...defaultCollapseProps} defaultActiveKey={['patient']}>
          <CollapsePanel key="patient" header="Patient">
            <PatientDataSearch
              form={form}
              parentKey={FORM_NAME}
              onJhnSearchStateChange={setJhnSearchDone}
              initialjhnSearchDone={jhnSearchDone}
              initialData={initialData}
              onResetJhn={() => {
                form.resetFields([
                  getName(ADD_INFO_FI_KEY.PRENATAL_DIAGNOSIS),
                  getName('sex' satisfies keyof HybridPatientFoetus),
                  getName('gestational_method' satisfies keyof HybridPatientFoetus),
                  getName(ADD_INFO_FI_KEY.NEW_BORN),
                ]);
              }}
            />
          </CollapsePanel>
        </Collapse>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue(getName('no_jhn')) || jhnSearchDone ? (
              <Collapse {...defaultCollapseProps} defaultActiveKey={['additional_information']}>
                <CollapsePanel key="additional_information" header="Informations supplémentaires">
                  <FoetusInfos
                    form={form}
                    parentKey={FORM_NAME}
                    showNewBornSection={getFieldValue(getName('no_jhn'))}
                    initialData={initialData?.foetus}
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
