import EnvironmentVariables from './EnvVariables';

export const keycloakConfig = JSON.parse(EnvironmentVariables.configFor('KEYCLOAK_CONFIG'));
