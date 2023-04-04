import EnvironmentVariables from './EnvVariables';

export const keycloakConfig = JSON.parse(EnvironmentVariables.configFor('KEYCLOAK_CONFIG'));
export const showTranslationBtn = EnvironmentVariables.configFor('SHOW_TRANSLATION_BTN') === 'true';
export const avatarPlaceholderUrl =
  EnvironmentVariables.configFor('ENV') !== 'development'
    ? `${EnvironmentVariables.configFor('WEB_ROOT')}/assets/avatar-placeholder.png`
    : '';
