import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { PractitionerRole } from 'api/fhir/models';

import ConditionalWrapper from 'components/containers/ConditionalWrapper';
import Forbidden from 'components/Results/Forbidden';
import { Roles, validate } from 'components/Roles/Rules';
import { useRpt } from 'hooks/useRpt';

type OwnProps = Omit<RouteProps, 'component' | 'render' | 'children'> & {
  layout?: (children: any) => React.ReactElement;
  roles?: Roles[];
  children: React.ReactNode;
  practitionerRoles: PractitionerRole[];
};

const ProtectedRouteWrapper = ({
  roles,
  children,
  layout,
  practitionerRoles,
  ...routeProps
}: OwnProps) => {
  const RouteLayout = layout!;
  const { decodedRpt } = useRpt();

  const code = !!practitionerRoles?.find(
    (role) =>
      !!role.code?.find(
        (code) =>
          !!code.coding?.find((coding) => coding.code === '405277009' || coding.code === 'doctor'),
      ),
  );

  if ((roles && decodedRpt && !validate(roles, decodedRpt, false)) || !code) {
    children = <Forbidden />;
  }

  return (
    <ConditionalWrapper
      condition={!!RouteLayout}
      wrapper={(children) => <RouteLayout>{children}</RouteLayout>}
    >
      <Route {...routeProps}>{children}</Route>
    </ConditionalWrapper>
  );
};

export default ProtectedRouteWrapper;
