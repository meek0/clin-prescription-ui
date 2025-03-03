import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { ArrowLeftOutlined, ArrowRightOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tooltip } from 'antd';
import { isUndefined } from 'lodash';

import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import EnvironmentVariables from 'utils/EnvVariables';

export const PrescriptionButtons = () => {
  const dispatch = useDispatch();
  const {
    currentStep,
    currentFormRefs,
    lastStepIsNext,
    isCreatingPrescription,
    isDraft,
    analysisData,
  } = usePrescriptionForm();

  const showDraftButtons = EnvironmentVariables.configFor('USE_DRAFT') === 'true';

  const reviewButtons = (
    <>
      <Tooltip title={intl.get('prescriptionForm.review.cancelButtonTooltip')}>
        <Button
          data-cy="CancelReviewButton"
          onClick={() => {
            dispatch(prescriptionFormActions.goToLastStep());
          }}
        >
          {intl.get('cancel')}
        </Button>
      </Tooltip>
      <Button
        data-cy="SaveReviewButton"
        type={'primary'}
        onClick={async () => {
          const values = await currentFormRefs?.validateFields();
          dispatch(prescriptionFormActions.saveStepData(values));

          Modal.success({
            title: intl.get('prescriptionForm.review.savedModal.title'),
            okText: intl.get('prescriptionForm.review.savedModal.okButton'),
            content: intl.get('prescriptionForm.review.savedModal.content'),
            onOk: (close) => {
              close();
              dispatch(prescriptionFormActions.goToLastStep());
            },
          });
        }}
        loading={isCreatingPrescription && isDraft}
      >
        {intl.get('prescriptionForm.review.saveButton')}
      </Button>
    </>
  );

  const submitButton = (
    <Button
      type="primary"
      data-cy="SubmitButton"
      onClick={() => {
        dispatch(prescriptionFormActions.setDraft(false));
        currentFormRefs?.sumbit();
      }}
      loading={isCreatingPrescription && !isDraft}
    >
      {intl.get('submit')}
    </Button>
  );

  const saveButton = (
    <Tooltip title={intl.get('prescriptionForm.saveButtonTooltip')}>
      <Button
        data-cy="SaveButton"
        icon={<SaveOutlined />}
        onClick={() => {
          dispatch(prescriptionFormActions.setDraft(true));
          currentFormRefs?.sumbit();
        }}
        loading={isCreatingPrescription && isDraft}
      >
        {intl.get('save')}
      </Button>
    </Tooltip>
  );

  return (
    <>
      <Space>
        {!isUndefined(currentStep?.previousStepIndex) && !lastStepIsNext && (
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={async () => {
              try {
                if (currentStep?.id && analysisData.changed?.[currentStep?.id])
                  await currentFormRefs?.validateFields();
                dispatch(prescriptionFormActions.previousStep());
              } catch (e) {
                console.error('Failed:', e);
              }
            }}
          >
            {intl.get('previous')}
          </Button>
        )}
      </Space>
      <Space>
        {showDraftButtons ? (lastStepIsNext ? reviewButtons : saveButton) : null}
        {!currentStep?.nextStepIndex && submitButton}
        {currentStep?.nextStepIndex && !lastStepIsNext && (
          <Button
            icon={<ArrowRightOutlined />}
            type="primary"
            data-cy="NextButton"
            onClick={async () => {
              try {
                const values = await currentFormRefs?.validateFields();
                dispatch(prescriptionFormActions.saveStepData(values));
                lastStepIsNext
                  ? dispatch(prescriptionFormActions.goToLastStep())
                  : dispatch(prescriptionFormActions.nextStep());
              } catch (errorInfo) {
                console.error('Failed:', errorInfo);
              }
            }}
          >
            {intl.get('next')}
          </Button>
        )}
      </Space>
    </>
  );
};
