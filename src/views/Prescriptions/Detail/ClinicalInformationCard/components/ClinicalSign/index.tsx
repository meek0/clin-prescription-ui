import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { Descriptions, Space } from 'antd';
import { PhenotypeRequestEntity } from 'api/fhir/models';
import { HpoApi } from 'api/hpo';
import { IHpoNode } from 'api/hpo/models';
import {
  useGeneralObservationEntity,
  useObservationPhenotypeEntity,
  useValueSet,
} from 'graphql/prescriptions/actions';
import { filter, find, map } from 'lodash';

import { EMPTY_FIELD } from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import { useLang } from 'store/global';

type ClinicalSignOwnProps = {
  phenotypeIds: string[];
  generalObervationIds: string[];
  isPrenatal?: boolean;
  isParent?: boolean;
};

type IDOwnProps = {
  ids: string[];
  isParent?: boolean;
};

const Observation = ({ ids, isParent }: IDOwnProps) => {
  const { generalObervationValue } = useGeneralObservationEntity(ids);
  let value = generalObervationValue?.valueString;
  if (Array.isArray(generalObervationValue)) {
    value = generalObervationValue?.find((v) => (isParent ? !v.focus : v.focus)).valueString;
  }
  return <>{value}</>;
};

const handleHpoSearchTerm = (
  term: string,
  setCurrentOptions: Dispatch<SetStateAction<IHpoNode[]>>,
) => {
  term
    ? HpoApi.searchHpos(term.toLowerCase().trim()).then(({ data, error }) => {
        if (!error) {
          const results = map(data?.hits, '_source');
          setCurrentOptions((prevList) => [...prevList, results[0] || {}]);
        }
      })
    : null;
};

export const ClinicalSign = ({
  phenotypeIds,
  generalObervationIds,
  isPrenatal,
  isParent,
}: ClinicalSignOwnProps) => {
  const [hpoList, setHpoList] = useState<IHpoNode[]>([]);
  const [ageList, setAgeList] = useState<IHpoNode[]>([
    {
      hpo_id: 'unknown',
      name: 'Unknown',
      is_leaf: false,
      parents: [],
    },
  ]);
  const { phenotypeValue } = useObservationPhenotypeEntity(phenotypeIds);
  const { valueSet } = useValueSet('age-at-onset');
  const lang = useLang();
  const getHpoValue = (element: PhenotypeRequestEntity) => {
    handleHpoSearchTerm(element.valueCodeableConcept?.coding?.code, setHpoList);
    element.extension ? handleHpoSearchTerm(element.extension.valueCoding?.code, setAgeList) : null;
  };

  useEffect(() => {
    if (phenotypeValue) {
      if (Array.isArray(phenotypeValue)) {
        phenotypeValue.forEach((element: PhenotypeRequestEntity) => {
          getHpoValue(element);
        });
      } else {
        getHpoValue(phenotypeValue);
      }
    }
  }, [phenotypeValue]);

  const filterPhenotype =
    isPrenatal && Array.isArray(phenotypeValue)
      ? phenotypeValue?.filter((p: PhenotypeRequestEntity) => (isParent ? !p.focus : p.focus))
      : phenotypeValue;

  let positive = [];
  let negative = [];
  if (Array.isArray(filterPhenotype)) {
    positive = filter(filterPhenotype, (o) => o?.interpretation?.coding?.code === 'POS');

    negative = filter(filterPhenotype, (o) => o?.interpretation?.coding?.code === 'NEG');
  } else {
    positive = [filterPhenotype];
  }

  const displayHpo = (hpo: string, age: string = '') => {
    const hpoInfo = find(hpoList, (h: IHpoNode) => h.hpo_id === hpo);
    const ageInfo = find(ageList, (h: IHpoNode) => h.hpo_id === age);
    const ageValue = find(valueSet?.concept, (o) => o.code === ageInfo?.hpo_id);
    const hpoValue = find(valueSet?.concept, (o) => o.code === hpoInfo?.hpo_id);
    const ageDisplay = ageValue
      ? ` - ${
          find(ageValue?.designation, (o) => o.language === lang)
            ? find(ageValue?.designation, (o) => o.language === lang)?.value
            : ageValue.display
        }`
      : ` - ${ageInfo?.name}`;

    const hpoDisplay = hpoValue
      ? `${
          find(hpoValue?.designation, (o) => o.language === lang)
            ? find(hpoValue?.designation, (o) => o.language === lang)?.value
            : hpoValue.display
        }`
      : `${hpoInfo?.name}`;

    return `${hpoInfo ? hpoDisplay : ''} (${hpo})${ageInfo ? ageDisplay : ''}`;
  };

  return (
    <Descriptions column={1} size="small" className="label-20">
      <Descriptions.Item label={intl.get('screen.prescription.entity.observed')}>
        <Space direction="vertical">
          {positive.map((p: PhenotypeRequestEntity) =>
            displayHpo(p?.valueCodeableConcept?.coding.code, p?.extension?.valueCoding.code),
          )}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('screen.prescription.entity.not.observed')}>
        {' '}
        <Space direction="vertical">
          {negative.length > 0
            ? negative.map((p: PhenotypeRequestEntity) =>
                displayHpo(p?.valueCodeableConcept?.coding.code),
              )
            : EMPTY_FIELD}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('screen.prescription.entity.hpo.note')}>
        {generalObervationIds.length > 0 ? (
          <Observation ids={generalObervationIds} isParent={isParent} />
        ) : (
          EMPTY_FIELD
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};
