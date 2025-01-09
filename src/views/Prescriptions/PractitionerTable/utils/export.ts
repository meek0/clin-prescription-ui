import { TPractitionnerInfo } from '@ferlab/ui/core/components/Assignments/types';
import { Practitioner, PractitionerBundleType, PractitionerRole } from 'api/fhir/models';
import { orderBy } from 'lodash';

export const getEmailfromPractionnerRole = (practitionerRole: PractitionerRole) =>
  practitionerRole?.telecom.find((t) => t.system === 'email');

export const getPractitionerInfoList = (
  practitionerRolesBundle?: PractitionerBundleType,
): TPractitionnerInfo[] => {
  const practitionerRoles: PractitionerRole[] = practitionerRolesBundle?.filter(
    (p) => p.resourceType === 'PractitionerRole',
  ) as PractitionerRole[];
  const infoList = practitionerRoles?.map((pr: PractitionerRole) => {
    const practitionerInfo: Practitioner = practitionerRolesBundle?.find(
      (p) => p.resourceType === 'Practitioner' && p.id === pr.practitioner.reference.split('/')[1],
    ) as Practitioner;
    const email = getEmailfromPractionnerRole(pr);
    const obj: TPractitionnerInfo = {
      practitionerRoles_Id: pr.id,
      practitioner: practitionerInfo?.id,
      name: practitionerInfo?.name,
      email: email?.value,
      ldm: pr.organization.reference.split('/')[1],
    };
    return obj;
  });

  return orderBy(infoList, (p: TPractitionnerInfo) => p.name[0].family);
};
