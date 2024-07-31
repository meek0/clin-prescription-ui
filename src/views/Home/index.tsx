import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { CheckCircleFilled, HomeOutlined, MedicineBoxFilled } from '@ant-design/icons';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Button, Col, Row, Space } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { getUserFullName } from 'auth/keycloak';
import DownloadButton from 'views/Prescriptions/components/DownloadDocument';
import PractitionerTable from 'views/Prescriptions/PractitionerTable';

import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import PrescriptionForm from 'components/Prescription';
import AddParentModal from 'components/Prescription/AddParentModal';
import AnalysisChoiceModal from 'components/Prescription/AnalysisChoiceModal';
import { LimitTo, Roles } from 'components/Roles/Rules';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';
import { DYNAMIC_ROUTES } from 'utils/routes';

import ActionButton from './components/ActionButton';
import AddParentButton from './components/AddParent';

import styles from './index.module.css';

const Home = () => {
  const dispatch = useDispatch();

  const { prescriptionId, prescriptionVisible, isCreatingPrescription } = usePrescriptionForm();
  const [isVisible, setIsVisible] = useState(!!prescriptionId);
  const [visibleTable, setVisibleTable] = useState(true);
  const [newPrescriptionCreated, setNewPrescriptionCreated] = useState(false);
  const handleClose = () => {
    setIsVisible(false);
    clearPrescriptionId();
    setNewPrescriptionCreated(false);
    setVisibleTable(true);
  };

  useEffect(() => {
    if (prescriptionVisible) {
      setVisibleTable(false);
    }
    if (isCreatingPrescription) {
      setNewPrescriptionCreated(true);
    }
    if (!prescriptionVisible && !newPrescriptionCreated) {
      setVisibleTable(true);
    }
  }, [prescriptionVisible, newPrescriptionCreated, isCreatingPrescription]);

  useEffect(() => {
    setIsVisible(!!prescriptionId);
  }, [prescriptionId]);

  const clearPrescriptionId = () =>
    dispatch(prescriptionFormActions.saveCreatedPrescription(undefined));

  useEffect(() => {
    window.addEventListener('beforeunload', clearPrescriptionId);
    return () => {
      window.removeEventListener('beforeunload', clearPrescriptionId);
    };
  }, []);

  return (
    <ContentWithHeader
      headerProps={{
        icon: <HomeOutlined />,
        title: getUserFullName(),
      }}
    >
      <ScrollContentWithFooter className={styles.homePageWrapper} container>
        <div className={styles.contentWrapper}>
          <GridCard
            bordered={false}
            className={styles.contentCard}
            wrapperClassName={styles.contentCardWrapper}
            content={
              <Row gutter={[24, 24]}>
                <LimitTo roles={[Roles.Prescriber, Roles.Practitioner]}>
                  <Col flex="auto" data-cy="CreateNewPrescription">
                    <ActionButton
                      icon={<MedicineBoxFilled />}
                      title={intl.get('create.new.prescription')}
                      description={intl.get('analysis.prescription.and.request.for.patient')}
                      onClick={() => dispatch(prescriptionFormActions.startAnalyseChoice())}
                    />
                  </Col>
                  {visibleTable && <AddParentButton />}
                </LimitTo>
              </Row>
            }
          />
          {visibleTable && <PractitionerTable />}
        </div>
      </ScrollContentWithFooter>
      <PrescriptionForm />
      <AddParentModal />
      <AnalysisChoiceModal />
      <Modal width={828} visible={isVisible} closable={false} footer={null}>
        <div className={styles.successModal}>
          <CheckCircleFilled />
          <Space direction={'vertical'} align={'center'}>
            <h3 className="ant-typography">{intl.get('prescription.submitted.success.title')}</h3>
            <p>
              {intl.getHTML('prescription.submitted.success.message', { id: prescriptionId })}&nbsp;
              <a href={DYNAMIC_ROUTES.PRESCRIPTION_ENTITY.replace(':id', prescriptionId!)}>
                {intl.get('prescription.submitted.success.link')}
              </a>
            </p>
          </Space>
          <Space>
            <DownloadButton
              prescriptionId={prescriptionId!}
              text={intl.get('prescription.submitted.actions.download')}
            />
            <Button key="close" onClick={handleClose}>
              {intl.get('close')}
            </Button>
          </Space>
        </div>
      </Modal>
    </ContentWithHeader>
  );
};

export default Home;
