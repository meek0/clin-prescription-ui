import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { HomeOutlined, MedicineBoxFilled } from '@ant-design/icons';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Col, Row } from 'antd';
import { getUserFullName } from 'auth/keycloak';
import PractitionerTable from 'views/Prescriptions/PractitionerTable';

import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import PrescriptionForm from 'components/Prescription';
import AddParentModal from 'components/Prescription/AddParentModal';
import AnalysisChoiceModal from 'components/Prescription/AnalysisChoiceModal';
import { LimitTo, Roles } from 'components/Roles/Rules';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';

import ActionButton from './components/ActionButton';
import AddParentButton from './components/AddParent';

import styles from './index.module.css';

const Home = () => {
  const dispatch = useDispatch();
  const { prescriptionVisible, displayActionModal } = usePrescriptionForm();

  const isVisibleTable = !prescriptionVisible && !displayActionModal;

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
                  {isVisibleTable && <AddParentButton />}
                </LimitTo>
              </Row>
            }
          />
          {isVisibleTable && <PractitionerTable />}
        </div>
      </ScrollContentWithFooter>
      <PrescriptionForm />
      <AddParentModal />
      <AnalysisChoiceModal />
    </ContentWithHeader>
  );
};

export default Home;
