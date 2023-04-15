import React from 'react';
import { useHistory } from 'react-router';
import { Radio } from 'antd';

import ROUTES from 'utils/routes';

import styles from './index.module.scss';

export enum PageType {
  PATIENT = 'patient',
  SEARCH = 'search',
}

export enum VariantType {
  SNV = 'snv',
  CNV = 'cnv',
}

export interface OwnProps {
  pageType: PageType;
  variantType: VariantType;
  patientId?: string;
  prescriptionId?: string;
}

const getPatientUrl = (route: string, patientId?: string, prescriptionId?: string) =>
  route.replace(':patientid?', patientId || '').replace(':prescriptionid?', prescriptionId || '');

const VariantTypeNav = ({
  pageType,
  variantType,
  patientId,
  prescriptionId,
}: OwnProps): React.ReactElement => {
  const history = useHistory();

  switch (pageType) {
    case PageType.PATIENT:
      return (
        <Radio.Group
          defaultValue={variantType}
          className={styles.typeNav}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value={VariantType.SNV} onClick={() => {}}>
            SNV
          </Radio.Button>
          <Radio.Button value={VariantType.CNV} onClick={() => {}}>
            CNV
          </Radio.Button>
        </Radio.Group>
      );
    case PageType.SEARCH:
      return (
        <Radio.Group
          defaultValue={variantType}
          className={styles.typeNav}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button
            value={VariantType.SNV}
            onClick={() => {
              history.push(ROUTES.HOME);
            }}
          >
            SNV
        </Radio.Button>
          <Radio.Button
            value={VariantType.CNV}
            onClick={() => {
              history.push(ROUTES.HOME);
            }}
          >
            CNV
          </Radio.Button>
        </Radio.Group>
      );
  }
};

export default VariantTypeNav;
