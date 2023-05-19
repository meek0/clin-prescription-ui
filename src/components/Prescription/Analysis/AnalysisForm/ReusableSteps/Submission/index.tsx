/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router';
import { FormOutlined } from '@ant-design/icons';
import Collapse, { CollapsePanel } from '@ferlab/ui/core/components/Collapse';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import useDebounce from '@ferlab/ui/core/hooks/useDebounce';
import { Descriptions, Form, Input, Select, Tag } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import {
  findPractitionerRoleByOrganization,
  isPractitionerResident,
} from 'api/fhir/practitionerHelper';
import { PrescriptionFormApi } from 'api/form';

import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import {
  defaultCollapseProps,
  defaultFormItemsRules,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { SubmissionStepMapping } from 'components/Prescription/Analysis/stepMapping';
import { PATIENT_DATA_FI_KEY } from 'components/Prescription/components/PatientDataSearch';
import { getNamePath, setInitialValues } from 'components/Prescription/utils/form';
import { IGetNamePathParams } from 'components/Prescription/utils/type';
import { useAppDispatch } from 'store';
import { useGlobals } from 'store/global';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import { createPrescription } from 'store/prescription/thunk';
import { useUser } from 'store/user';
import { DYNAMIC_ROUTES } from 'utils/routes';

import styles from './index.module.scss';

export enum SUBMISSION_REVIEW_FI_KEY {
  RESPONSIBLE_DOCTOR = 'supervisor',
  GENERAL_COMMENT = 'general_comment',
}

export interface ISubmissionDataType {
  [SUBMISSION_REVIEW_FI_KEY.GENERAL_COMMENT]: string;
  [SUBMISSION_REVIEW_FI_KEY.RESPONSIBLE_DOCTOR]: string;
}

const Submission = () => {
  const FORM_NAME = STEPS_ID.SUBMISSION;
  const { user } = useUser();
  const history = useHistory();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { getAnalysisNameByCode } = useGlobals();
  const { analysisData, config, currentStep, analysisType } = usePrescriptionForm();
  const [supervisors, setSupervisors] = useState<DefaultOptionType[]>([]);
  const [generalComment, setGeneralComment] = useState('');
  const debouncedComment = useDebounce(generalComment, 300);

  const getName = (...key: IGetNamePathParams) => getNamePath(FORM_NAME, key);

  useEffect(() => {
    if (analysisData.analysis.resident_supervisor) {
      onSearch('d');
    }
    setInitialValues(
      form,
      getName,
      {
        [SUBMISSION_REVIEW_FI_KEY.GENERAL_COMMENT]: analysisData.analysis.comment,
        [SUBMISSION_REVIEW_FI_KEY.RESPONSIBLE_DOCTOR]: analysisData.analysis.resident_supervisor,
      },
      SUBMISSION_REVIEW_FI_KEY,
    );
  }, []);

  useEffect(() => {
    dispatch(
      prescriptionFormActions.saveSubmissionStepData({
        comment: debouncedComment,
      }),
    );
  }, [debouncedComment]);

  const needToSelectSupervisor = () => {
    const org = getPrescribingOrg()!;
    const role = findPractitionerRoleByOrganization(user.practitionerRoles, org);
    return isPractitionerResident(role!);
  };

  const getPrescribingOrg = () =>
    analysisData[STEPS_ID.PATIENT_IDENTIFICATION]?.[PATIENT_DATA_FI_KEY.PRESCRIBING_INSTITUTION];

  const onSearch = (searchText: string) => {
    if (searchText) {
      PrescriptionFormApi.searchSupervisor({
        ep: getPrescribingOrg()!,
        prefix: searchText,
      }).then((resp) =>
        setSupervisors(
          resp.data?.map((supervisor) => ({
            label: supervisor.name,
            value: supervisor.id,
          })) ?? [],
        ),
      );
    }
  };

  return (
    <>
      <AnalysisForm
        form={form}
        className={styles.submissionForm}
        name={FORM_NAME}
        layout="vertical"
        onFinish={() => {
          dispatch(createPrescription())
            .unwrap()
            .then(({ prescriptionId }) =>
              history.push(DYNAMIC_ROUTES.PRESCRIPTION_ENTITY.replace(':id', prescriptionId)),
            );
        }}
      >
        <div className={styles.supervisorCommentWrapper}>
          {needToSelectSupervisor() && (
            <Form.Item
              name={getName(SUBMISSION_REVIEW_FI_KEY.RESPONSIBLE_DOCTOR)}
              label={
                <ProLabel
                  title={intl.get('prescription.submission.responsable.doctor.label')}
                  colon
                />
              }
              rules={defaultFormItemsRules}
            >
              <Select
                showSearch
                placeholder={intl.get('prescription.submission.responsable.doctor.placeholder')}
                onSearch={onSearch}
                options={supervisors}
                onSelect={(value: string) => {
                  dispatch(
                    prescriptionFormActions.saveSubmissionStepData({
                      resident_supervisor: value,
                    }),
                  );
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
              />
            </Form.Item>
          )}
          <Form.Item
            name={getName(SUBMISSION_REVIEW_FI_KEY.GENERAL_COMMENT)}
            label={<ProLabel title={intl.get('prescription.submission.general.comment')} colon />}
          >
            <Input.TextArea rows={3} onChange={(value) => setGeneralComment(value.target.value)} />
          </Form.Item>
        </div>
      </AnalysisForm>
      <ProLabel
        className={styles.reviewLabel}
        title={intl.get('prescriptino.add.parent.submission.verify.info.title')}
      />
      <Collapse
        {...defaultCollapseProps}
        bordered
        defaultActiveKey={['analyse', ...(config?.steps.map(({ title }) => title) ?? [])]}
      >
        <CollapsePanel key="analyse" header={intl.get('prescription.submission.title')}>
          <Descriptions className="label-20" column={1} size="small">
            <Descriptions.Item label={intl.get('prescription.submission.item.analysis.title')}>
              <Tag color="geekblue">{getAnalysisNameByCode(analysisType!, true)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('prescription.submission.item.prescribing.org')}>
              {getPrescribingOrg()}
            </Descriptions.Item>
          </Descriptions>
        </CollapsePanel>
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
    </>
  );
};

export default Submission;
