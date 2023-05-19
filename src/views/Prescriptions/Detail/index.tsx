import intl from 'react-intl-universal';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import { useServiceRequestEntity } from 'graphql/prescriptions/actions';
import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/ApolloProvider';

import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import Forbidden from 'components/Results/Forbidden';

import AnalysisCard from './AnalysisCard';
import ClinicalInformationCard from './ClinicalInformationCard';
import ParentCard from './ParentCard';
import PatientCard from './PatientCard';

import styles from './index.module.scss';

interface OwnProps {
  prescriptionId: string;
}

const PrescriptionDetail = ({ prescriptionId }: OwnProps) => {
  const { prescription, loading } = useServiceRequestEntity(prescriptionId);

  if (!loading && !prescription) {
    return <Forbidden />;
  }

  return (
    <ContentWithHeader
      headerProps={{
        icon: <MedicineBoxOutlined />,
        title: intl.get('screen.prescription.entity.title', { id: prescriptionId }),
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
              <ParentCard loading={loading} extension={extension} />
            </Col>
          ))}
        </Row>
      </ScrollContentWithFooter>
    </ContentWithHeader>
  );
};

const PrescriptionEntityWrapper = (props: OwnProps) => (
  <ApolloProvider backend={GraphqlBackend.FHIR}>
    <PrescriptionDetail {...props} />
  </ApolloProvider>
);

export default PrescriptionEntityWrapper;
