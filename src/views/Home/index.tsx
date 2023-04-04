import { useDispatch } from 'react-redux';
import { HomeOutlined, MedicineBoxFilled } from '@ant-design/icons';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Col, Row } from 'antd';
import { getUserFullName } from 'auth/keycloak';

import FamilyRestroomIcon from 'components/icons/FamilyRestroomIcon';
import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import PrescriptionForm from 'components/Prescription';
import AddParentModal from 'components/Prescription/AddParentModal';
import AnalysisChoiceModal from 'components/Prescription/AnalysisChoiceModal';
import { LimitTo, Roles } from 'components/Roles/Rules';
import useFeatureToggle from 'hooks/useFeatureToggle';
import { prescriptionFormActions } from 'store/prescription/slice';

import ActionButton from './components/ActionButton';
import PrescriptionSearchBox from './components/PrescriptionSearchBox';
import VariantSearchBox from './components/VariantSearchBox';

import styles from './index.module.scss';

const Home = () => {
  const dispatch = useDispatch();
  const { isEnabled } = useFeatureToggle('prescriptionV4');

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
              <Row gutter={[48, 48]}>
                <LimitTo roles={[Roles.Practitioner]}>
                  <Col xxl={24} className={styles.contentCol}>
                    <PrescriptionSearchBox />
                  </Col>
                </LimitTo>
                <LimitTo roles={[Roles.Variants]}>
                  <Col xxl={24} className={styles.contentCol}>
                    <VariantSearchBox />
                  </Col>
                </LimitTo>
                {isEnabled && (
                  <LimitTo roles={[Roles.Prescriber]}>
                    <Col lg={12} className={styles.contentCol} data-cy="CreateNewPrescription">
                      <ActionButton
                        icon={<MedicineBoxFilled />}
                        title="Créer une nouvelle prescription"
                        description="Prescription d’analyse et requêtes pour un patient ou une famille"
                        onClick={() => dispatch(prescriptionFormActions.startAnalyseChoice())}
                      />
                    </Col>
                    <Col lg={12} className={styles.contentCol}>
                      <ActionButton
                        icon={<FamilyRestroomIcon />}
                        title="Ajouter un parent à une prescription existante"
                        description="Trouver une analyse en cours et rajouter un membre de la famille"
                        onClick={() => dispatch(prescriptionFormActions.startAddParentChoice())}
                      />
                    </Col>
                  </LimitTo>
                )}
              </Row>
            }
          />
        </div>
      </ScrollContentWithFooter>
      <PrescriptionForm />
      <AddParentModal />
      <AnalysisChoiceModal />
    </ContentWithHeader>
  );
};

export default Home;
