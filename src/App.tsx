import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import Empty from '@ferlab/ui/core/components/Empty';
import loadable from '@loadable/component';
import { useKeycloak } from '@react-keycloak/web';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import frFR from 'antd/lib/locale/fr_FR';
import ContextProvider from 'providers/ContextProvider';
import ErrorPage from 'views/Error';
import Landing from 'views/Landing';

import ErrorBoundary from 'components/ErrorBoundary';
import PageLayout from 'components/Layout';
import NotificationContextHolder from 'components/NotificationContextHolder';
import { Roles } from 'components/Roles/Rules';
import ProtectedRoute from 'components/Routes/ProtectedRoute';
import Spinner from 'components/uiKit/Spinner';
import { useLang } from 'store/global';
import { fetchFhirServiceRequestCodes } from 'store/global/thunks';
import { fetchConfig, fetchPractitionerRole } from 'store/user/thunks';
import { LANG } from 'utils/constants';
import EnvironmentVariables from 'utils/EnvVariables';
import { DYNAMIC_ROUTES, STATIC_ROUTES } from 'utils/routes';

const loadableProps = { fallback: <Spinner size="large" /> };
const PrescriptionDetailPage = loadable(() => import('views/Prescriptions/Detail'), loadableProps);
// const PrescriptionSearch = loadable(() => import('views/Prescriptions/Search'), loadableProps);

const HomePage = loadable(() => import('views/Home'), loadableProps);

const App = () => {
  const lang = useLang();
  const dispatch = useDispatch();
  // const params = useQueryParams();
  const { keycloak, initialized } = useKeycloak();
  const keycloakIsReady = keycloak && initialized;

  useEffect(() => {
    if (keycloakIsReady && keycloak.authenticated) {
      const script = document.createElement('script');
      document.body.appendChild(script);
      const idByLang = lang === LANG.FR ? 'pD6A3kMjCfERq52yyEZYg8' : '57UqYYjNEqnTnVV3qf97Yz';
      script.innerHTML = `
        var releasecat = {
          id: '${idByLang}',
          production: ${EnvironmentVariables.configFor(
            'SHOW_ONLY_NEW_INFO_POPUP',
          )} // Change to 'true' for production. keep false for QA
        };
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.releasecat.io/embed/index.js';
        script.defer = true;
        document.head.appendChild(script);
      `;
      // Nettoyer le script à la désinstallation du composant
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [lang, keycloakIsReady, keycloak]);

  useEffect(() => {
    if (keycloakIsReady && keycloak.authenticated) {
      dispatch(fetchPractitionerRole());
      dispatch(fetchFhirServiceRequestCodes());
      dispatch(fetchConfig());

      // const sharedFilterId = params.get(SHARED_FILTER_ID_QUERY_PARAM_KEY);
      // if (sharedFilterId) {
      //   dispatch(fetchSharedSavedFilter(sharedFilterId));
      // }
    }
    // eslint-disable-next-line
  }, [keycloakIsReady, keycloak]);

  return (
    <ConfigProvider
      locale={lang === LANG.FR ? frFR : enUS}
      renderEmpty={() => <Empty imageType="grid" description={intl.get('no.data.available')} />}
    >
      <div className="App" id="appContainer">
        {keycloakIsReady ? (
          <Router>
            <Switch>
              <Route exact path={STATIC_ROUTES.LANDING}>
                <Landing />
              </Route>
              <ProtectedRoute exact path={STATIC_ROUTES.HOME} layout={PageLayout}>
                <HomePage />
              </ProtectedRoute>
              <ProtectedRoute
                exact
                path={DYNAMIC_ROUTES.PRESCRIPTION_ENTITY}
                layout={PageLayout}
                roles={[Roles.Practitioner]}
              >
                <PrescriptionDetailPage />
              </ProtectedRoute>
              <Route
                path={DYNAMIC_ROUTES.ERROR}
                render={(props: RouteComponentProps<{ status?: any }>) => (
                  <ErrorPage status={props.match.params.status} />
                )}
              />
              <Redirect from="*" to={STATIC_ROUTES.HOME} />
            </Switch>
            <NotificationContextHolder />
          </Router>
        ) : (
          <Spinner size={'large'} />
        )}
      </div>
    </ConfigProvider>
  );
};

const EnhanceApp = () => (
  <ErrorBoundary>
    <ContextProvider>
      <App />
    </ContextProvider>
  </ErrorBoundary>
);

export default EnhanceApp;
