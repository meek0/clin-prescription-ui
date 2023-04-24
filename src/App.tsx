import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteChildrenProps,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import Empty from '@ferlab/ui/core/components/Empty';
import loadable from '@loadable/component';
import { useKeycloak } from '@react-keycloak/web';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import frFR from 'antd/lib/locale/fr_FR';
import ProtectedRoute from 'ProtectedRoute';
import ContextProvider from 'providers/ContextProvider';
import ErrorPage from 'views/Error';

import ErrorBoundary from 'components/ErrorBoundary';
import PageLayout from 'components/Layout';
import { Roles } from 'components/Roles/Rules';
import Spinner from 'components/uiKit/Spinner';
import NotificationContextHolder from 'components/utils/GenericModal/NotificationContextHolder';
import { useLang } from 'store/global';
import { fetchFhirServiceRequestCodes } from 'store/global/thunks';
import { fetchConfig, fetchPractitionerRole } from 'store/user/thunks';
import { LANG } from 'utils/constants';
import ROUTES from 'utils/routes';

const loadableProps = { fallback: <Spinner size="large" /> };
const PrescriptionEntity = loadable(() => import('views/Prescriptions/Entity'), loadableProps);
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
              <ProtectedRoute
                exact
                path={ROUTES.HOME}
                layout={PageLayout}
                roles={[Roles.Prescriber]}
              >
                <HomePage />
              </ProtectedRoute>
              <ProtectedRoute
                exact
                path={ROUTES.PRESCRIPTION_ENTITY}
                layout={PageLayout}
                roles={[Roles.Prescriber]}
              >
                {(
                  props: RouteChildrenProps<{
                    id: string;
                  }>,
                ) => <PrescriptionEntity prescriptionId={props.match?.params.id!} />}
              </ProtectedRoute>
              <Route
                path={ROUTES.ERROR_STATUS}
                render={(props: RouteComponentProps<{ status?: any }>) => (
                  <ErrorPage status={props.match.params.status} />
                )}
              />
              <Redirect from="*" to={ROUTES.HOME} />
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
