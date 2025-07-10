import intl from 'react-intl-universal';
import { Card, Descriptions, Tag } from 'antd';
import { extractOrganizationId, extractServiceRequestId } from 'api/fhir/helper';
import { getProband, HybridAnalysis } from 'api/hybrid/models';
import PriorityTag from 'views/Prescriptions/components/PriorityTag';
import StatusTag from 'views/Prescriptions/components/StatusTag';
import { getPrescriptionStatusDictionnary } from 'views/Prescriptions/utils/constant';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import ParagraphLoader from 'components/uiKit/ParagraphLoader';
import { useGlobals } from 'store/global';
import { formatDate } from 'utils/date';

interface OwnProps {
  prescription?: HybridAnalysis;
  loading: boolean;
}

const AnalysisCard = ({ prescription, loading }: OwnProps) => {
  const { getAnalysisNameByCode } = useGlobals();
  const proband = getProband(prescription);

  return (
    <Card title={intl.get(`screen.prescription.entity.analyse.card.title`)} data-cy="AnalysisCard">
      <ParagraphLoader loading={loading} paragraph={{ rows: 5 }}>
        {prescription && (
          <Descriptions column={1} size="small" className="label-35">
            <Descriptions.Item label={intl.get('screen.prescription.entity.identifier')}>
              {extractServiceRequestId(prescription?.analysis_id!)}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('screen.prescription.entity.request.priority')}>
              {prescription?.priority ? (
                <PriorityTag priority={prescription?.priority?.toLowerCase()} />
              ) : (
                EMPTY_FIELD
              )}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('status')}>
              <StatusTag
                dictionary={getPrescriptionStatusDictionnary()}
                status={prescription?.status?.toLowerCase() || 'unknown'}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get('screen.prescription.entity.analysisCard.askedAnalysis')}
            >
              <Tag color="geekblue">{getAnalysisNameByCode(prescription.analysis_code)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get('screen.prescription.entity.analysisCard.reflexpanel')}
            >
              {prescription.is_reflex ? 'Global Muscular diseases' : '--'}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('screen.patientsearch.table.createdOn')}>
              {formatDate(prescription?.authored_on || '')}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get('screen.prescription.entity.patient.card.requester')}
            >
              {prescription?.requester || EMPTY_FIELD}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('prescribing.institution')}>
              {extractOrganizationId(proband?.organization_id)}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('screen.patientsearch.table.ldm')}>
              {prescription?.performer || EMPTY_FIELD}
            </Descriptions.Item>
          </Descriptions>
        )}
      </ParagraphLoader>
    </Card>
  );
};

export default AnalysisCard;
