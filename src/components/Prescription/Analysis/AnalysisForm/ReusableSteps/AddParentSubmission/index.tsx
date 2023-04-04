/* eslint-disable */
import { useDispatch } from 'react-redux';
import { FormOutlined } from '@ant-design/icons';
import Collapse, { CollapsePanel } from '@ferlab/ui/core/components/Collapse';
import { Form } from 'antd';

import PrescriptionSummary from 'components/Prescription/AddParentModal/PrescriptionSummary';
import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import {
  defaultCollapseProps,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { SubmissionStepMapping } from 'components/Prescription/Analysis/stepMapping';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import intl from 'react-intl-universal';

import styles from './index.module.scss';

export enum SUBMISSION_REVIEW_FI_KEY {
  RESPONSIBLE_DOCTOR = 'responsible_doctor',
  GENERAL_COMMENT = 'general_comment',
}

const AddParentSubmission = () => {
  const FORM_NAME = STEPS_ID.SUBMISSION;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { config, currentStep } = usePrescriptionForm();

  return (
    <AnalysisForm
      form={form}
      className={styles.addParentSubmissionForm}
      name={FORM_NAME}
      layout="vertical"
      onFinish={() => {
        console.log('Format and send data to backend');
      }}
    >
      <Form.Item>
        <Collapse {...defaultCollapseProps} defaultActiveKey={['prescription_summary']}>
          <CollapsePanel
            key={'prescription_summary'}
            header={intl.get('prescriptino.add.parent.submission.analysis.info.title')}
          >
            <PrescriptionSummary />
          </CollapsePanel>
        </Collapse>
      </Form.Item>
      <Form.Item
        label={intl.get('prescriptino.add.parent.submission.verify.info.title')}
        className="noMarginBtm"
      >
        <Collapse
          {...defaultCollapseProps}
          defaultActiveKey={[...(config?.steps.map(({ title }) => title) ?? [])]}
        >
          {config?.steps
            .filter(({ title }) => title !== currentStep?.title)
            .map((step) => (
              <CollapsePanel
                key={step.title}
                header={step.title}
                extra={
                  <FormOutlined
                    onClick={(event) => {
                      event.stopPropagation();
                      dispatch(
                        prescriptionFormActions.goTo({
                          index: step.index!,
                          lastStepIsNext: true,
                        }),
                      );
                    }}
                  />
                }
              >
                {SubmissionStepMapping[step.id]}
              </CollapsePanel>
            ))}
        </Collapse>
      </Form.Item>
    </AnalysisForm>
  );
};

export default AddParentSubmission;
