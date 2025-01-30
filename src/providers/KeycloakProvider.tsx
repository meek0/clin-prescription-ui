import React, { ReactElement, StrictMode } from 'react';
import { AuthClientError, AuthClientEvent } from '@react-keycloak/core/lib/types';
import { ReactKeycloakProvider as KeycloakProvider } from '@react-keycloak/web';
import keycloak from 'auth/keycloak';

import EnvVariables from 'utils/EnvVariables';

export interface IProvider {
  children: React.ReactNode;
}

const eventLogger = (eventType: AuthClientEvent, error?: AuthClientError) => {
  if (EnvVariables.configFor('ENV') === 'development' && error) {
    console.error('eventLogger ', 'eventType ', eventType);
    console.error('eventLogger ', error);
  }
};

const Keycloak = ({ children }: IProvider): ReactElement => (
  /* Stric Mode should be place inside the KeycloakProvider to avoid issues with the KeycloakProvider,
    there is no fix available (https://github.com/react-keycloak/react-keycloak/issues/182) */
  <KeycloakProvider authClient={keycloak} onEvent={eventLogger}>
    <StrictMode>{children}</StrictMode>
  </KeycloakProvider>
);

export default Keycloak;
