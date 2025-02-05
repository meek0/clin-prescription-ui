export default class EnvironmentVariables {
  static vars: Record<string, string | undefined> = {
    // GENERAL
    ENV: process.env.NODE_ENV,
    SHOW_TRANSLATION_BTN: process.env.REACT_APP_SHOW_TRANSLATION_BTN,
    KEYCLOAK_CONFIG: process.env.REACT_APP_KEYCLOAK_CONFIG,
    WEB_ROOT: process.env.REACT_APP_WEB_ROOT,
    // APIS
    ARRANGER_API: process.env.REACT_APP_ARRANGER_API,
    ARRANGER_PROJECT_ID: process.env.REACT_APP_ARRANGER_PROJECT_ID,
    FHIR_API: process.env.REACT_APP_FHIR_SERVICE_URL,
    USERS_API_URL: process.env.REACT_APP_USERS_API_URL,
    FORM_API_URL: process.env.REACT_APP_FORM_API_URL,
    HYBRID_API_URL: process.env.REACT_APP_HYBRID_API_URL,
    PANELS_FILE: process.env.REACT_APP_PANELS_FILE,
    SENTRY_API: process.env.REACT_APP_SENTRY_API,
    // FEATURES
    USE_DRAFT: process.env.REACT_APP_USE_DRAFT,
  };

  static configFor(key: string): string {
    return EnvironmentVariables.vars[key] || '';
  }
}

export const getEnvVarByKey = <T>(key: string, defaultValue?: T): T =>
  (process.env[`REACT_APP_${key}`] as any) || defaultValue;

export const getFTEnvVarByKey = <T>(key: string, defaultValue?: T): T =>
  (process.env[`REACT_APP_FT_${key}`] as any) || defaultValue;
