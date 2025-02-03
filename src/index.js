/* eslint-disable simple-import-sort/imports */
// required for the theme to be correctly applied
import 'clin-portal-theme/themes/clin/main.css';
import './index.css';

import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/browser';
import { localStorageIntegration } from '@ferlab/ui/core/utils/sentry/localStorageIntegration';
import EnvironmentVariables from 'utils/EnvVariables';

// Import App after the style to make sure styles is apply correctly!
import App from './App';
import reportWebVitals from './reportWebVitals';
/*eslint-env node*/

const reactAppWebRoot = process.env.REACT_APP_WEB_ROOT;
const SentryDSN = EnvironmentVariables.configFor('SENTRY_API');

Sentry.init({
  dsn: SentryDSN,
  integrations: [
    Sentry.browserTracingIntegration({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', reactAppWebRoot],
    }),
    Sentry.contextLinesIntegration(),
    Sentry.browserProfilingIntegration(),
    localStorageIntegration('LocalStorage'),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
});

const container = document.getElementById('clin-ui');
const root = createRoot(container);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line no-console
reportWebVitals(console.log);
