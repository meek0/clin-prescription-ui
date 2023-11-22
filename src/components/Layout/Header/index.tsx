import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import Gravatar from '@ferlab/ui/core/components/Gravatar';
import { useKeycloak } from '@react-keycloak/web';
import { Button, Dropdown, Menu, PageHeader, Space, Tag } from 'antd';
import { getUserFirstName } from 'auth/keycloak';

import HeaderLink from 'components/Layout/Header/HeaderLink';
import useFeatureToggle from 'hooks/useFeatureToggle';
import { globalActions, useLang } from 'store/global';
import { LANG } from 'utils/constants';
import EnvironmentVariables from 'utils/EnvVariables';
import { STATIC_ROUTES } from 'utils/routes';
import { IncludeKeycloakTokenParsed } from 'utils/tokenTypes';

import styles from './index.module.scss';

const Header = () => {
  const { keycloak } = useKeycloak();
  const { isEnabled } = useFeatureToggle('beta');
  const lang = useLang();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentPathName = history.location.pathname;
  const tokenParsed = keycloak.tokenParsed as IncludeKeycloakTokenParsed;
  const targetLang = lang === LANG.FR ? LANG.EN : LANG.FR;

  return (
    <PageHeader
      title={
        <Space size={10} direction="horizontal">
          <img className={styles.logo} alt={'Clin Portal UI'} src="/assets/logos/cqgc-white.svg" />
          {isEnabled && (
            <Tag className={styles.betaTag} color="blue">
              Beta
            </Tag>
          )}
        </Space>
      }
      subTitle={
        <nav className={styles.headerList}>
          <HeaderLink
            key="home"
            currentPathName={currentPathName}
            to={STATIC_ROUTES.HOME}
            icon={<HomeOutlined />}
            title={intl.get('layout.main.menu.home')}
          />
        </nav>
      }
      extra={
        <Space className={styles.extras} size={12}>
          {/* <HeaderButton
            key="panels"
            icon={<DownloadOutlined />}
            title={intl.get('layout.main.menu.panels')}
            tooltip={intl.get('layout.main.menu.panels.tooltip')}
            onClick={() => handlePanelsFileDownload()}
            loading={downloadPanelsFile.fetching}
          /> */}
          <Dropdown
            key="user-menu"
            trigger={['click']}
            overlay={
              <Menu
                onClick={async ({ key }) => (key === 'logout' ? await keycloak.logout() : null)}
                items={[{ label: intl.get('logout'), key: 'logout' }]}
              />
            }
          >
            <a className={styles.userMenuTrigger} onClick={(e) => e.preventDefault()} href="">
              <Gravatar
                className={styles.userGravatar}
                circle
                email={tokenParsed.email || tokenParsed.identity_provider_identity}
              />
              <span className={styles.userName}>{getUserFirstName()}</span>
              <DownOutlined />
            </a>
          </Dropdown>
          {EnvironmentVariables.configFor('SHOW_TRANSLATION_BTN') === 'true' && (
            <Button
              size="small"
              className={styles.langBtn}
              type="text"
              onClick={() => dispatch(globalActions.changeLang(targetLang))}
            >
              {targetLang.toUpperCase()}
            </Button>
          )}
        </Space>
      }
      className={styles.mainHeader}
    />
  );
};

export default Header;
