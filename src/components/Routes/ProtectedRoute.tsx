import React from 'react';
import intl from 'react-intl-universal';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import { Roles } from 'components/Roles/Rules';
import Spinner from 'components/uiKit/Spinner';
import { useUser } from 'store/user';
import { REDIRECT_URI_KEY } from 'utils/constants';
import { STATIC_ROUTES } from 'utils/routes';

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

  const search = `${REDIRECT_URI_KEY}=${routeProps.location?.pathname}${routeProps.location?.search}`;

  if (showLogin) {
    return (
      <Redirect
        to={{
          pathname: STATIC_ROUTES.LANDING,
          search,
        }}
      />
    );
  }

  if (!keycloakIsReady || user.practitionerRoles.length === 0) {
    return <Spinner size={'large'} />;
  }

  if (!keycloak.tokenParsed?.fhir_practitioner_id) {
    const locale = intl.getInitOptions().currentLocale;
    keycloak.register({
      redirectUri: `${STATIC_ROUTES.HOME}`,
      locale,
    });
    return <div></div>;
  }

  return (
    <ProtectedRouteWrapper roles={roles} layout={layout} practitionerRoles={user.practitionerRoles}>
      <Route {...routeProps}>{children}</Route>
    </ProtectedRouteWrapper>
  );
};

export default ProtectedRoute;
