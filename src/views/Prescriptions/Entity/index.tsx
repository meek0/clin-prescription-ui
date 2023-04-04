import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import { extractPatientId } from 'api/fhir/helper';
import { useServiceRequestEntity } from 'graphql/prescriptions/actions';
import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/ApolloProvider';

import LineStyleIcon from 'components/icons/LineStyleIcon';
import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import Forbidden from 'components/Results/Forbidden';
import { LimitTo, Roles } from 'components/Roles/Rules';

import AnalysisCard from './AnalysisCard';
import ClinicalInformationCard from './ClinicalInformationCard';
import ParentCard from './ParentCard';
import PatientCard from './PatientCard';

import styles from './index.module.scss';

interface OwnProps {
  prescriptionId: string;
}

const PrescriptionEntity = ({ prescriptionId }: OwnProps) => {
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
          <LimitTo key="variants" roles={[Roles.Variants]}>
            <Link
              key="variants"
              to={`/snv/exploration/patient/${extractPatientId(
                prescription?.subject?.resource?.id!,
              )}/${prescriptionId}`}
            >
              <Button type="primary" icon={<LineStyleIcon height="14" width="14" />}>
                {intl.get('screen.prescription.entity.see.variant')}
              </Button>
            </Link>
          </LimitTo>,
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
    <PrescriptionEntity {...props} />
  </ApolloProvider>
);

export default PrescriptionEntityWrapper;
