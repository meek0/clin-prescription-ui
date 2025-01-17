import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Button, Col, Modal, Row, Space, Typography } from 'antd';
import { isUndefined } from 'lodash';

import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import EnvironmentVariables from 'utils/EnvVariables';

import PrescriptionAnalysis from './Analysis';
import SaveModal from './SaveModal';
import StepsPanel from './StepsPanel';

import styles from './index.module.css';

const { Title } = Typography;

const PrescriptionForm = () => {
  const dispatch = useDispatch();
  const {
    prescriptionVisible,
    currentStep,
    currentFormRefs,
    lastStepIsNext,
    isAddingParent,
    isCreatingPrescription,
    prescriptionId,
  } = usePrescriptionForm();

  useEffect(() => {
    const clearPrescriptionId = () =>
      dispatch(prescriptionFormActions.saveCreatedPrescription(null));
    window.addEventListener('beforeunload', clearPrescriptionId);
    return () => {
      window.removeEventListener('beforeunload', clearPrescriptionId);
    };
  }, [dispatch]);

  return (
    <>
      <Modal
        className={styles.createPrescriptionModal}
        open={prescriptionVisible}
        zIndex={1000}
        title={
          <Space className={styles.modalHeader} align="center">
            <Title level={4}>
              {prescriptionId ? `Prescription ID: ${prescriptionId}` : "Prescription d'analyse"}
            </Title>
            <Button
              className={styles.customCloseBtn}
              type="link"
              icon={<CloseOutlined />}
              danger
              size="small"
              onClick={() =>
                Modal.confirm({
                  title: isAddingParent
                    ? intl.get('prescription.form.cancel.add.parent.modal.title')
                    : intl.get('prescription.form.cancel.modal.title'),
                  icon: <ExclamationCircleOutlined />,
                  okText: isAddingParent
                    ? intl.get('prescription.form.cancel.add.parent.modal.cancel.btn')
                    : intl.get('close'),
                  content: isAddingParent
                    ? intl.get('prescription.form.cancel.add.parent.modal.content')
                    : intl.get('prescription.form.cancel.modal.content'),
                  cancelText: intl.get('prescription.saved.success.continue'),
                  okButtonProps: { danger: true },
                  onOk: (close) => {
                    close();
                    dispatch(prescriptionFormActions.cancel());
                  },
                })
              }
            >
              {intl.get('close')}
            </Button>
          </Space>
        }
        footer={false}
        destroyOnClose
        closable={false}
      >
        <Row gutter={[24, 24]} className={styles.modalContentRow}>
          <Col span={6} className={styles.siderCol}>
            <StepsPanel />
          </Col>
          <Col span={18} className={styles.contentCol}>
            <ScrollContent className={styles.contentScroller}>
              <GridCard
                title={<Title level={3}>{currentStep?.title}</Title>}
                content={<PrescriptionAnalysis />}
                className={styles.prescriptionFormCard}
                bordered={false}
                footer={
                  <div className={styles.prescriptionContentFooter}>
                    <Space className={styles.footerLeftSide}>
                      {!isUndefined(currentStep?.previousStepIndex) && (
                        <Button
                          icon={<ArrowLeftOutlined />}
                          onClick={() => dispatch(prescriptionFormActions.previousStep())}
                        >
                          {intl.get('previous')}
                        </Button>
                      )}
                    </Space>
                    <Space className={styles.footerRightSide}>
                      {EnvironmentVariables.configFor('USE_DRAFT') === 'true' && (
                        <Button
                          type="primary"
                          data-cy="SaveButton"
                          onClick={() => {
                            dispatch(prescriptionFormActions.setDraft(true));
                            currentFormRefs?.sumbit();
                          }}
                          loading={isCreatingPrescription}
                        >
                          {intl.get('save')}
                        </Button>
                      )}
                      {!currentStep?.nextStepIndex && (
                        <Button
                          type="primary"
                          data-cy="SubmitButton"
                          onClick={() => {
                            dispatch(prescriptionFormActions.setDraft(false));
                            currentFormRefs?.sumbit();
                          }}
                          loading={isCreatingPrescription}
                        >
                          {intl.get('submit')}
                        </Button>
                      )}
                      {currentStep?.nextStepIndex && (
                        <Button
                          icon={<ArrowRightOutlined />}
                          type="primary"
                          data-cy="NextButton"
                          onClick={async () => {
                            try {
                              const values = await currentFormRefs?.validateFields();
                              dispatch(prescriptionFormActions.saveStepData(values));
                              dispatch(
                                lastStepIsNext
                                  ? prescriptionFormActions.goToLastStep()
                                  : prescriptionFormActions.nextStep(),
                              );
                            } catch (errorInfo) {
                              console.error('Failed:', errorInfo);
                            }
                          }}
                          loading={isCreatingPrescription}
                        >
                          {intl.get('next')}
                        </Button>
                      )}
                    </Space>
                  </div>
                }
              />
            </ScrollContent>
          </Col>
        </Row>
      </Modal>
      <SaveModal />
    </>
  );
};

export default PrescriptionForm;
