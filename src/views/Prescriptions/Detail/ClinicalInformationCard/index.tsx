import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Card, Descriptions, Space, Typography } from 'antd';
import { extractPatientId } from 'api/fhir/helper';
import { ServiceRequestEntity } from 'api/fhir/models';

import CollapsePanel from 'components/containers/collapse';
import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { useAppDispatch } from 'store';
import { fetchFormConfig } from 'store/prescription/thunk';

import RequestTable from '../RequestTable';

import { ClinicalSign } from './components/ClinicalSign';
import { Consanguinity } from './components/Consanguinity';
import { Ethnicity } from './components/Ethnicity';
import { FamilyHistory } from './components/FMH';
import { Indication } from './components/Indication';
import { Paraclinique } from './components/Paraclinique';

import styles from './index.module.css';

const { Title } = Typography;
type OwnProps = {
  prescription?: ServiceRequestEntity;
  loading: boolean;
};

const ClinicalInformation = ({ prescription, loading }: OwnProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (prescription) {
      dispatch(fetchFormConfig(prescription));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prescription]);

  let ethnValue = undefined;
  const phenotype: string[] = [];
  const generalObservation: any[] = [];
  let consanguinity = undefined;
  let indication = undefined;
  const paraclinique: string[] = [];
  const complexParaclinique: string[] = [];
  const familyHistory: string[] = [];
  prescription?.observation?.investigation.item.forEach((e) => {
    if (e.resourceType === 'Observation') {
      if (e.category?.[0]?.coding?.[0]?.code === 'procedure') {
        if (e.coding.code === 'BMUS' || e.coding.code === 'EMG' || e.coding.code === 'CGH') {
          complexParaclinique.push(e.id[0]);
        } else {
          paraclinique.push(e.id[0]);
        }
      } else {
        switch (e.coding.code) {
          case 'ETHN':
            ethnValue = e.id[0].split('/')[1];
            break;
          case 'PHEN':
            phenotype.push(e.id[0]);
            break;
          case 'OBSG':
            generalObservation.push(e.id);
            break;
          case 'CONS':
            consanguinity = e.id;
            break;
          case 'INDIC':
            indication = e.id;
            break;
          case 'INVES':
            paraclinique.push(e.id[0]);
            break;
          case '11778-8':
            break;
          default:
            break;
        }
      }
    } else if (e.resourceType === 'FamilyMemberHistory') {
      familyHistory.push(e.id[0]);
    }
  });
  return (
    <CollapsePanel
      header={<Title level={4}>{intl.get('screen.prescription.entity.clinicalInformation')}</Title>}
      loading={loading}
      datacy="ClinicalInformation"
    >
      {prescription ? (
        <Space direction="vertical" size="middle">
          <div>
            {(phenotype.length > 0 || generalObservation.length) && (
              <Card.Grid className={styles.cardGrid} hoverable={false}>
                {
                  <ClinicalSign
                    phenotypeIds={phenotype}
                    generalObervationIds={generalObservation}
                    isPrenatal={prescription?.category?.[0]?.coding?.[0].code === 'Prenatal'}
                  />
                }
              </Card.Grid>
            )}
            {(paraclinique.length > 0 || complexParaclinique.length > 0) && (
              <Card.Grid className={styles.cardGrid} hoverable={false}>
                {
                  <Paraclinique
                    ids={paraclinique.length > 0 ? paraclinique : null}
                    complexIds={complexParaclinique.length > 0 ? complexParaclinique : null}
                  />
                }
              </Card.Grid>
            )}
            <Card.Grid className={styles.cardGrid} hoverable={false}>
              <Descriptions column={1} size="small" className="label-20">
                <Descriptions.Item label={intl.get('screen.prescription.entity.familyHistory')}>
                  {familyHistory.length > 0 ? <FamilyHistory ids={familyHistory} /> : EMPTY_FIELD}
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('screen.prescription.entity.inbreeding')}>
                  {consanguinity ? <Consanguinity id={consanguinity} /> : EMPTY_FIELD}
                </Descriptions.Item>
                {
                  <Descriptions.Item label={intl.get('screen.prescription.entity.ethnicity')}>
                    {ethnValue ? <Ethnicity id={ethnValue} /> : EMPTY_FIELD}
                  </Descriptions.Item>
                }
                <Descriptions.Item label={intl.get('screen.prescription.entity.hypothesis')}>
                  {indication ? <Indication id={indication} /> : EMPTY_FIELD}
                </Descriptions.Item>
              </Descriptions>
            </Card.Grid>
          </div>
          <RequestTable
            patientId={extractPatientId(prescription?.subject?.reference)}
            data={prescription?.subject?.resource?.requests}
          />
        </Space>
      ) : (
        <></>
      )}
    </CollapsePanel>
  );
};

export default ClinicalInformation;
