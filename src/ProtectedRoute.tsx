import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import LoginWrapper from 'components/LoginWrapper';
import { Roles } from 'components/Roles/Rules';
import Spinner from 'components/uiKit/Spinner';
import { useUser } from 'store/user';

import ProtectedRouteWrapper from './ProtectedRouteWrapper';

type OwnProps = Omit<RouteProps, 'component' | 'render' | 'children'> & {
  layout?: (children: any) => React.ReactElement;
  roles?: Roles[];
  children: React.ReactNode;
};

const ProtectedRoute = ({ roles, children, layout, ...routeProps }: OwnProps) => {
  const { keycloak, initialized } = useKeycloak();
  const keycloakIsReady = keycloak && initialized;
  const showLogin = keycloakIsReady && !keycloak.authenticated;
  const { user } = useUser();

  if (showLogin) {
    return <LoginWrapper Component={<Spinner size={'large'} />} />;
  }

  if (!keycloakIsReady || user.practitionerRoles.length === 0) {
    return <Spinner size={'large'} />;
  }

  return (
    <ProtectedRouteWrapper roles={roles} layout={layout} practitionerRoles={user.practitionerRoles}>
      <Route {...routeProps}>{children}</Route>
    </ProtectedRouteWrapper>
  );
};

export default ProtectedRoute;
