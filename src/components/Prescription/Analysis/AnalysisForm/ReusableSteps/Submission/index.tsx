/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { FormOutlined } from '@ant-design/icons';
import Collapse, { CollapsePanel } from '@ferlab/ui/core/components/Collapse';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Descriptions, Form, Input, Select, Tag } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import {
  findPractitionerRoleByOrganization,
  isPractitionerResident,
} from 'api/fhir/practitionerHelper';
import { HybridApi } from 'api/hybrid';
import { HybridAnalysis } from 'api/hybrid/models';

import AnalysisForm from 'components/Prescription/Analysis/AnalysisForm';
import {
  defaultCollapseProps,
  defaultFormItemsRules,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { SubmissionStepMapping } from 'components/Prescription/Analysis/stepMapping';
import { getNamePath, setInitialValues } from 'components/Prescription/utils/form';
import { IGetNamePathParams } from 'components/Prescription/utils/type';
import { useAppDispatch } from 'store';
import { useGlobals } from 'store/global';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import { useUser } from 'store/user';

import styles from './index.module.css';

const Submission = () => {
  const FORM_NAME = STEPS_ID.SUBMISSION;
  const { user } = useUser();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { getAnalysisNameByCode } = useGlobals();
  const { analysisFormData, config, currentStep, analysisType } = usePrescriptionForm();
  const [supervisors, setSupervisors] = useState<DefaultOptionType[]>([]);
  const [autoCompleteDropdownIsOpen, setAutoCompleteDropdownIsOpen] = useState(false);

  const getName = (...key: IGetNamePathParams) => getNamePath(FORM_NAME, key);

  useEffect(() => {
    if (analysisFormData.analysis.resident_supervisor_id) {
      HybridApi.searchSupervisors({
        organizationId: analysisFormData.proband?.organization_id!,
        prefix: analysisFormData.analysis.resident_supervisor_id,
      })
        .then(({ data }) => {
          form.setFieldValue(
            getName('resident_supervisor_id' satisfies keyof HybridAnalysis),
            data?.supervisors[0].name || analysisFormData.analysis.resident_supervisor_id,
          );
        })
        .catch(() => {
          form.setFieldValue(
            getName('resident_supervisor_id' satisfies keyof HybridAnalysis),
            analysisFormData.analysis.resident_supervisor_id,
          );
        });
    }
    setInitialValues(form, getName, {
      comment: analysisFormData.submission?.comment || analysisFormData.analysis.comment,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needToSelectSupervisor = () => {
    const role = findPractitionerRoleByOrganization(
      user.practitionerRoles,
      analysisFormData.proband?.organization_id!,
    );
    return isPractitionerResident(role!);
  };

  const onSearch = (searchText: string) => {
    if (searchText) {
      HybridApi.searchSupervisors({
        organizationId: analysisFormData.proband?.organization_id!,
        prefix: searchText,
      }).then(({ data }) => {
        setSupervisors(
          data?.supervisors.map((supervisor) => ({
            label: supervisor.license ? (
              <>
                {supervisor.name} &mdash; {supervisor.license}
              </>
            ) : (
              supervisor.name
            ),
            value: supervisor.id,
          })) ?? [],
        );
        setAutoCompleteDropdownIsOpen(true);
      });
    } else {
      setAutoCompleteDropdownIsOpen(false);
    }
  };

  return (
    <>
      <AnalysisForm
        form={form}
        className={styles.submissionForm}
        name={FORM_NAME}
        layout="vertical"
      >
        <div className={styles.supervisorCommentWrapper}>
          {needToSelectSupervisor() && (
            <Form.Item
              name={getName('resident_supervisor_id' satisfies keyof HybridAnalysis)}
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
                      resident_supervisor_id: value,
                    }),
                  );
                }}
                open={autoCompleteDropdownIsOpen}
                onBlur={() => setAutoCompleteDropdownIsOpen(false)}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
              />
            </Form.Item>
          )}
          <Form.Item
            name={getName('comment' satisfies keyof HybridAnalysis)}
            label={<ProLabel title={intl.get('prescription.submission.general.comment')} colon />}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>
      </AnalysisForm>
      <ProLabel
        className={styles.reviewLabel}
        title={intl.get('prescription.add.parent.submission.verify.info.title')}
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
              {analysisFormData.proband?.organization_id}
            </Descriptions.Item>
          </Descriptions>
        </CollapsePanel>
        {config?.steps
          .filter(({ id }) => id !== currentStep?.id)
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
