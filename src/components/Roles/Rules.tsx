import React from 'react';

import { useRpt } from 'hooks/useRpt';

import { DecodedRpt } from '../../auth/types';

export enum Roles {
  Practitioner,
  Prescriber,
  Variants,
  Download,
  Links,
}

type LimitToProps = {
  children: React.ReactNode;
  roles: Roles[];
  shouldMatchAll?: boolean;
};

const canDownload = (rptToken: DecodedRpt) =>
  !!rptToken.authorization?.permissions.find((x) => x.rsname === 'download');

const canSeeLinks = (rptToken: DecodedRpt) =>
  !!rptToken.realm_access?.roles?.find((x) => x === 'clin_administrator');

const isPractitioner = (rptToken: DecodedRpt) =>
  !!rptToken.authorization?.permissions.find(
    (x) => x.rsname === 'ServiceRequest' && x.scopes?.some((s) => s === 'read'),
  );

const isPrescriber = (rptToken: DecodedRpt) =>
  !!rptToken.authorization?.permissions.find(
    (x) => x.rsname === 'ServiceRequest' && x.scopes?.some((s) => s === 'create'),
  );

const isGenetician = (rptToken: DecodedRpt) =>
  !!rptToken.authorization?.permissions.find((x) => x.rsname === 'Variants');

const hasRole = (role: Roles, rpt: DecodedRpt) => {
  switch (role) {
    case Roles.Practitioner:
      return isPractitioner(rpt);
    case Roles.Prescriber:
      return isPrescriber(rpt);
    case Roles.Variants:
      return isGenetician(rpt);
    case Roles.Download:
      return canDownload(rpt);
    case Roles.Links:
      return canSeeLinks(rpt);
    default:
      return false;
  }
};

export const validate = (
  roles: Roles[],
  rptToken: DecodedRpt | undefined,
  shouldMatchAll: boolean,
) => {
  const matchRoles = rptToken ? !!roles.filter((x) => hasRole(x, rptToken)).length : 0;
  return shouldMatchAll ? matchRoles === roles.length : !!matchRoles;
};

export const LimitTo = ({
  children,
  roles,
  shouldMatchAll = false,
}: LimitToProps): React.ReactElement => {
  const { decodedRpt } = useRpt();
  return validate(roles, decodedRpt, shouldMatchAll) ? <>{children}</> : <></>;
};
