import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import { PrescriptionFormApi } from 'api/form';
import { TFormConfig } from 'api/form/models';
import { HybridApi } from 'api/hybrid';
import {
  getProband,
  HybridAnalysis,
  HybridPatientNotPresent,
  HybridPatientPresent,
} from 'api/hybrid/models';
import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/ApolloProvider';

import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import Forbidden from 'components/Results/Forbidden';
import { orderPatients } from 'store/prescription/utils';

import DownloadButton from '../components/DownloadDocument';

import AbsentParentCard from './AbsentParentCard';
import AnalysisCard from './AnalysisCard';
import ClinicalInformationCard from './ClinicalInformationCard';
import FoetusClinicalInformation from './FoetusClinicalInformationCard';
import ParentCard from './ParentCard';
import PatientCard from './PatientCard';

import styles from './index.module.css';

const PrescriptionDetail = () => {
  const { id: prescriptionId } = useParams<{ id: string }>();

  const [hybridPrescription, setHybridPrescription] = useState<HybridAnalysis>();
  const [prescriptionConfig, setPrescriptionConfig] = useState<TFormConfig>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    HybridApi.getPrescription(prescriptionId)
      .then(({ data }) => {
        setHybridPrescription(data);

        if (!data) throw new Error('prescription data not found');

        PrescriptionFormApi.fetchConfig(data.analysis_code)
          .then(({ data, error }) => {
            if (!error && data) setPrescriptionConfig(data.config);
          })
          .finally(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, [prescriptionId]);

  if (!loading && !hybridPrescription) {
    return <Forbidden />;
  }

  const proband = getProband(hybridPrescription);
  const familyMembers = hybridPrescription?.patients.slice(1);
  const isFoetusPrescription = proband?.foetus;

  return (
    <ContentWithHeader
      headerProps={{
        icon: <MedicineBoxOutlined />,
        title: intl.get('screen.prescription.entity.title', { id: prescriptionId }),
        actions: [
          <DownloadButton key="download-docs" prescriptionId={prescriptionId} loading={loading} />,
        ],
      }}
    >
      <ScrollContentWithFooter className={styles.prescriptionEntityWrapper} container>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <AnalysisCard prescription={hybridPrescription} loading={loading} />
          </Col>
          <Col span={12}>
            <PatientCard
              patient={proband}
              loading={loading}
              organizationId={proband?.organization_id}
            />
          </Col>
          {hybridPrescription?.comment && (
            <Col span={24}>
              <Card title={intl.get('screen.prescription.entity.comment.card.title')}>
                {hybridPrescription?.comment}
              </Card>
            </Col>
          )}
          <Col span={24}>
            {isFoetusPrescription ? (
              <FoetusClinicalInformation
                hybridPrescription={hybridPrescription}
                prescriptionConfig={prescriptionConfig}
                loading={loading}
              />
            ) : (
              <ClinicalInformationCard
                hybridPrescription={hybridPrescription}
                prescriptionConfig={prescriptionConfig}
                loading={loading}
              />
            )}
          </Col>
          {familyMembers?.sort(orderPatients).map((patient, index) => (
            <Col key={index} span={24}>
              {!(patient as HybridPatientNotPresent).reason ? (
                <ParentCard
                  patient={patient}
                  prescriptionConfig={prescriptionConfig}
                  loading={loading}
                  organizationId={(patient as HybridPatientPresent).organization_id}
                  analysisType={hybridPrescription?.type}
                />
              ) : (
                <AbsentParentCard patient={patient as HybridPatientNotPresent} loading={loading} />
              )}
            </Col>
          ))}
        </Row>
      </ScrollContentWithFooter>
    </ContentWithHeader>
  );
};

const PrescriptionEntityWrapper = () => (
  <ApolloProvider backend={GraphqlBackend.FHIR}>
    <PrescriptionDetail />
  </ApolloProvider>
);

export default PrescriptionEntityWrapper;
