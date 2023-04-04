import { ServiceRequestEntity } from 'api/fhir/models';

import PositionTag from 'components/uiKit/PositionTag';

const isParent = (prescription: ServiceRequestEntity | undefined, patientid: string) =>
  prescription?.extensions?.some(function (o) {
    return o.extension?.[1].valueReference?.reference.includes(patientid);
  });

export const getPositionTag = (
  prescription: ServiceRequestEntity | undefined,
  patientid: string,
) => <PositionTag key="type-tag" isParent={isParent(prescription, patientid)} />;
