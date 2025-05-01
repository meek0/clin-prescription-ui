import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Button, Col, Modal, Row, Space, Typography } from 'antd';

import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';

import PrescriptionAnalysis from './Analysis';
import { PrescriptionButtons } from './PrescriptionButtons';
import SaveModal from './SaveModal';
import StepsPanel from './StepsPanel';

import styles from './index.module.css';

const { Title } = Typography;

const PrescriptionForm = () => {
  const dispatch = useDispatch();
  const { prescriptionVisible, currentStep, isAddingParent, prescriptionId, analysisFormData } =
    usePrescriptionForm();

  useEffect(() => {
    const clearPrescriptionId = () =>
      dispatch(prescriptionFormActions.saveCreatedPrescription(null));
    window.addEventListener('beforeunload', clearPrescriptionId);
    return () => window.removeEventListener('beforeunload', clearPrescriptionId);
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
              {prescriptionId
                ? intl.getHTML('prescriptionForm.header.edition', { prescriptionId })
                : intl.get('prescriptionForm.header.creation')}
            </Title>
            <Button
              className={styles.customCloseBtn}
              type="link"
              icon={<CloseOutlined />}
              danger
              size="small"
              onClick={() => {
                if (!analysisFormData.changed) {
                  dispatch(prescriptionFormActions.cancel());
                  return;
                }
                const modalConfig = isAddingParent
                  ? {
                      title: intl.get('prescription.form.cancel.add.parent.modal.title'),
                      content: intl.get('prescription.form.cancel.add.parent.modal.content'),
                      okText: intl.get('prescription.form.cancel.add.parent.modal.cancel.btn'),
                    }
                  : {
                      title: intl.get('prescriptionForm.cancelModal.title'),
                      content: intl.get('prescriptionForm.cancelModal.content'),
                      okText: intl.get('close'),
                    };
                Modal.confirm({
                  ...modalConfig,
                  icon: <ExclamationCircleOutlined />,
                  cancelText: intl.get('prescriptionForm.continueEditionButton'),
                  okButtonProps: { danger: true },
                  onOk: (close) => {
                    close();
                    dispatch(prescriptionFormActions.cancel());
                  },
                });
              }}
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
                    <PrescriptionButtons />
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
