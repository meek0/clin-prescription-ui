import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { CheckCircleFilled, CloseCircleFilled, FormOutlined, SaveFilled } from '@ant-design/icons';
import { Button, Collapse, Modal, Space } from 'antd';
import DownloadButton from 'views/Prescriptions/components/DownloadDocument';

import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import EnvironmentVariables from 'utils/EnvVariables';
import { DYNAMIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

const SaveModal = () => {
  const dispatch = useDispatch();
  const { prescriptionId, isDraft, displayActionModal, submissionError } = usePrescriptionForm();

  function closeModal() {
    dispatch(prescriptionFormActions.clearForm());
    dispatch(prescriptionFormActions.saveCreatedPrescription(null));
    dispatch(
      prescriptionFormActions.setDisplayActionModal({
        displayActionModal: undefined,
        prescriptionVisible: false,
      }),
    );
  }

  let modalData: {
    title?: string;
    text?: React.ReactNode;
    icon?: React.ReactNode;
    buttons?: React.ReactNode;
    errorMessage?: {
      context: string;
      message: string;
    } | null;
  } = {};

  let errorMessage: (typeof modalData)['errorMessage'] | null = null;

  switch (displayActionModal) {
    case 'submitted':
      modalData = {
        icon: <CheckCircleFilled />,
        title: intl.get('prescriptionForm.submitted.success.title'),
        text: (
          <>
            {intl.getHTML('prescriptionForm.submitted.success.content', { id: prescriptionId })}
            <a href={DYNAMIC_ROUTES.PRESCRIPTION_ENTITY.replace(':id', prescriptionId!)}>
              {intl.get('prescriptionForm.submitted.success.link')}
            </a>
          </>
        ),
        buttons: (
          <>
            <DownloadButton
              prescriptionId={prescriptionId!}
              text={intl.get('prescriptionForm.submitted.actions.download')}
            />
            <Button key="close" onClick={closeModal}>
              {intl.get('close')}
            </Button>
          </>
        ),
      };
      break;
    case 'saved':
      modalData = {
        icon: <SaveFilled />,
        title: intl.get('prescriptionForm.saved.success.title'),
        text: intl.getHTML('prescriptionForm.saved.success.content', { id: prescriptionId }),
        buttons: (
          <>
            <Button
              key="continue"
              onClick={() => {
                dispatch(
                  prescriptionFormActions.setDisplayActionModal({
                    displayActionModal: undefined,
                    prescriptionVisible: true,
                  }),
                );
              }}
              icon={<FormOutlined />}
              type="primary"
            >
              {intl.get('prescriptionForm.continueEditionButton')}
            </Button>
            <Button key="close" onClick={closeModal}>
              {intl.get('close')}
            </Button>
          </>
        ),
      };
      break;
    case 'error':
      if (EnvironmentVariables.configFor('DRAFT_SHOW_ERROR') === 'true' && submissionError) {
        try {
          // Error from clin-forms
          if (Array.isArray(submissionError.response?.data)) {
            errorMessage = {
              context: 'clin-portal-forms error',
              message: submissionError.response.data.join('\n'),
            };
          } else if (submissionError.response?.data?.errors) {
            // Error from clin-qlin-me-hybrid
            const match = JSON.stringify(submissionError.response.data.errors, null, 4).match(
              /\{\s([^}]+)\s+}/,
            );
            if (match) {
              errorMessage = {
                context: 'clin-qlin-me-hybrid error',
                message: match[1],
              };
            }
          } else {
            errorMessage = {
              context: submissionError.name,
              message: submissionError.message,
            };
          }
        } catch (e) {
          /* empty */
        }
      }

      modalData = {
        icon: <CloseCircleFilled style={{ color: 'var(--red-7)' }} />,
        title: intl.get(`prescriptionForm.${isDraft ? 'saved' : 'submitted'}.error.title`),
        text: intl.getHTML(`prescriptionForm.${isDraft ? 'saved' : 'submitted'}.error.content`),
        errorMessage: errorMessage,
        buttons: (
          <>
            <Button
              key="continue"
              onClick={() =>
                dispatch(
                  prescriptionFormActions.setDisplayActionModal({
                    displayActionModal: undefined,
                    prescriptionVisible: true,
                  }),
                )
              }
              type="primary"
            >
              {intl.get('close')}
            </Button>
          </>
        ),
      };
      break;
  }

  return (
    <Modal zIndex={1100} width={828} open={!!displayActionModal} closable={false} footer={null}>
      <div className={styles.actionModal}>
        {modalData?.icon}
        <Space direction={'vertical'} align={'center'}>
          <h3 className="ant-typography">{modalData.title}</h3>
          <p>{modalData.text}&nbsp;</p>
          {modalData.errorMessage && (
            <Collapse ghost>
              <Collapse.Panel header="error info" key="1" style={{ width: '420px' }}>
                <h4>{modalData.errorMessage.context}</h4>
                <p style={{ whiteSpace: 'pre-wrap', color: 'LightCoral' }}>
                  {modalData.errorMessage.message}
                </p>
              </Collapse.Panel>
            </Collapse>
          )}
        </Space>
        <Space>{modalData.buttons}</Space>
      </div>
    </Modal>
  );
};

export default SaveModal;
