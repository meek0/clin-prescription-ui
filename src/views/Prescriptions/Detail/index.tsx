import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import { useServiceRequestEntity } from 'graphql/prescriptions/actions';
import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/ApolloProvider';

import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import Forbidden from 'components/Results/Forbidden';

import DownloadButton from '../components/DownloadDocument';

import AbsentParentCard from './AbsentParentCard';
import AnalysisCard from './AnalysisCard';
import ClinicalInformationCard from './ClinicalInformationCard';
import ParentCard from './ParentCard';
import PatientCard from './PatientCard';

import styles from './index.module.scss';

const PrescriptionDetail = () => {
  const { id: prescriptionId } = useParams<{ id: string }>();
  const { prescription, loading } = useServiceRequestEntity(prescriptionId);

  if (!loading && !prescription) {
    return <Forbidden />;
  }

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
            <AnalysisCard prescription={prescription} loading={loading} />
          </Col>
          <Col span={12}>
            <PatientCard prescription={prescription} loading={loading} />
          </Col>
          {prescription?.note && (
            <Col span={24}>
              <Card title={intl.get('screen.prescription.entity.comment.card.title')}>
                {prescription?.note.text}
              </Card>
            </Col>
          )}
          <Col span={24}>
            <ClinicalInformationCard prescription={prescription} loading={loading} />
          </Col>
          {prescription?.extensions?.map((extension, index) => (
            <Col key={index} span={24}>
              <ParentCard prescription={prescription} loading={loading} extension={extension} />
            </Col>
          ))}
          {prescription?.observation.investigation.item
            .filter(
              (item) =>
                item.resourceType === 'Observation' &&
                ['MMTH', 'MFTH'].indexOf(item.coding.code) > -1,
            )
            .map((item, index) => (
              <Col key={index} span={24}>
                <AbsentParentCard
                  observationId={item.id[0]}
                  loading={loading}
                  code={item.coding.code}
                />
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
