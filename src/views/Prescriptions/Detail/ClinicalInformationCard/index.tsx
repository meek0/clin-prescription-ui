import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Card, Descriptions, Space, Typography } from 'antd';
import { TFormConfig } from 'api/form/models';
import { getProband, HybridAnalysis } from 'api/hybrid/models';

import CollapsePanel from 'components/containers/collapse';
import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';

import RequestTable from '../RequestTable';

import { ClinicalSign } from './components/ClinicalSign';
import { Consanguinity } from './components/Consanguinity';
import { Ethnicity } from './components/Ethnicity';
import { FamilyHistory } from './components/FMH';
import { Paraclinique } from './components/Paraclinique';

import styles from './index.module.css';

const { Title } = Typography;
type OwnProps = {
  hybridPrescription?: HybridAnalysis;
  prescriptionConfig?: TFormConfig;
  loading: boolean;
  isFoetus?: boolean;
};

const ClinicalInformation = ({ hybridPrescription, prescriptionConfig, loading }: OwnProps) => {
  const proband = getProband(hybridPrescription);

  useEffect(() => {}, [prescriptionConfig]);

  return (
    <CollapsePanel
      header={<Title level={4}>{intl.get('screen.prescription.entity.clinicalInformation')}</Title>}
      loading={loading}
      datacy="ClinicalInformation"
    >
      {hybridPrescription ? (
        <Space direction="vertical" size="middle">
          <div>
            {proband.clinical && (
              <Card.Grid className={styles.cardGrid} hoverable={false}>
                {
                  <ClinicalSign
                    clinical={proband.clinical}
                    prescriptionConfig={prescriptionConfig}
                  />
                }
              </Card.Grid>
            )}
            {proband.para_clinical && (
              <Card.Grid className={styles.cardGrid} hoverable={false}>
                {
                  <Paraclinique
                    paraClinical={proband.para_clinical}
                    prescriptionConfig={prescriptionConfig}
                  />
                }
              </Card.Grid>
            )}
            <Card.Grid className={styles.cardGrid} hoverable={false}>
              <Descriptions column={1} size="small" className="label-20">
                <Descriptions.Item label={intl.get('screen.prescription.entity.familyHistory')}>
                  <FamilyHistory
                    history={hybridPrescription.history}
                    prescriptionConfig={prescriptionConfig}
                  />
                </Descriptions.Item>
                <Descriptions.Item label={intl.get('screen.prescription.entity.inbreeding')}>
                  <Consanguinity inbreeding={hybridPrescription.inbreeding} />
                </Descriptions.Item>
                {
                  <Descriptions.Item label={intl.get('screen.prescription.entity.ethnicity')}>
                    <Ethnicity
                      ethnicityCodes={hybridPrescription.ethnicity_codes}
                      prescriptionConfig={prescriptionConfig}
                    />
                  </Descriptions.Item>
                }
                <Descriptions.Item label={intl.get('screen.prescription.entity.hypothesis')}>
                  {hybridPrescription.diagnosis_hypothesis || EMPTY_FIELD}
                </Descriptions.Item>
              </Descriptions>
            </Card.Grid>
          </div>
          <RequestTable
            patient={proband}
            analysisType={hybridPrescription.type}
            loading={loading}
          />
        </Space>
      ) : (
        <></>
      )}
    </CollapsePanel>
  );
};

export default ClinicalInformation;
