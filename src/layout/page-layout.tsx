import React, { useState, useRef, useMemo } from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { Layout, Menu, BackTop } from '@arco-design/web-react';
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';
import { useSelector, useStore } from 'react-redux';
import * as IconList from '@arco-design/web-react/icon/index.js';

// import { createStore } from 'redux';
// import rootReducer from '../redux';
import qs from 'query-string';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import LoadingBar from '../components/LoadingBar';
import { routers, defaultRoute } from '../routes';
import { isArray } from '../utils/is';
import history from '../history';
import useLocale from '../utils/useLocale';
import { ReducerState } from '../redux';
import getUrlParams from '../utils/getUrlParams';
import lazyload from '../utils/lazyload';
import styles from './style/layout.module.less';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const Sider = Layout.Sider;
const Content = Layout.Content;
// const store = createStore(rootReducer);
const menu = JSON.parse(localStorage.getItem('arco-routers') || '[]');
const routes = FormatMenu(menu);


function getFlattenRoutes() {
  const res = [];
  function travel(_routes) {
    _routes.forEach((route) => {
      if (route.componentPath) {
        route.component = lazyload(() => import(`../pages/${route.componentPath}`));
        res.push(route);
      } else if (isArray(route.children) && route.children.length) {
        travel(route.children);
      }
    });
  }
  travel(routes);
  return res;
}

function FormatMenu(menu) {
  function travelMenu(route) {
    route.forEach((m) => {
      if (m.parentId == '0') {
        m.key = m.router
        m.name = `menu.${m.router}`
        m.icon = React.createElement(IconList[m.icon])
        m.children = m.children
      } else if (m.parentId !== '0') {
        m.key =m.parentRouter +'/'+m.router;
        m.name = `menu.${m.parentRouter}.${m.router}`;
        m.componentPath = `${m.parentRouter}-${m.router}`;
        m.icon=''
      }
      if (isArray(m.children) && m.children.length) {
        travelMenu(m.children);
      }
    });
  }
  travelMenu(menu);
  console.log("🚀 ~ file: page-layout.tsx ~ line 68 ~ FormatMenu ~ menu", menu);
  const routerMenuArr = routers.concat(menu)
  return routerMenuArr
  //路由标准结构
  // return [
  //   {
  //     name: 'menu.setting',
  //     key: 'setting',
  //     icon: <IconSettings />,
  //     children: [
  //       {
  //         name: 'menu.setting.roles',
  //         key: 'setting/roles',
  //         componentPath: 'setting-roles',
  //       },
  //     ],
  //   },
  // ];
}

function renderRoutes(locale) {
  const nodes = [];
  function travel(_routes, level) {
    return _routes.map((route) => {
      const titleDom = (
        <>
          {route.icon} {locale[route.name] || route.name}
        </>
      );
      if (
        route.component &&
        (!isArray(route.children) || (isArray(route.children) && !route.children.length))
      ) {
        if (level > 1) {
          return <MenuItem key={route.key}>{titleDom}</MenuItem>;
        }
        if (!route.hidden) {
          nodes.push(
            <MenuItem key={route.key}>
              <Link to={`/${route.key}`}>{titleDom}</Link>
            </MenuItem>
          );
        }
      }
      if (isArray(route.children) && route.children.length) {
        if (level > 1) {
          return (
            <SubMenu key={route.key} title={titleDom}>
              {travel(route.children, level + 1)}
            </SubMenu>
          );
        }
        nodes.push(
          <SubMenu key={route.key} title={titleDom}>
            {travel(route.children, level + 1)}
          </SubMenu>
        );
      }
    });
  }
  travel(routes, 1);
  return nodes;
}

function PageLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const urlParams = getUrlParams();
  const pathname = history.location.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const defaultSelectedKeys = [currentComponent || defaultRoute];

  const store = useStore();
  store.subscribe(() => {
    if (store.getState().global.settings.menuMode == 2) setCollapsed(true);
  });

  const locale = useLocale();
  const settings = useSelector((state: ReducerState) => state.global.settings);

  const [selectedKeys, setSelectedKeys] = useState<string[]>(defaultSelectedKeys);
  const loadingBarRef = useRef(null);

  const navbarHeight = 60;
  const menuWidth = collapsed ? 48 : settings.menuWidth;

  const showNavbar = settings.navbar && urlParams.navbar !== false;
  const showMenu = settings.menu && urlParams.menu !== false;
  const showFooter = settings.footer && urlParams.footer !== false;
  const showAccordion = settings.menuAccordion && urlParams.menuAccordion !== false;
  const showMode = settings.menuMode;

  const flattenRoutes = useMemo(() => getFlattenRoutes() || [], []);

  function onClickMenuItem(key) {
    const currentRoute = flattenRoutes.find((r) => r.key === key);
    const component = currentRoute.component;
    const preload = component.preload();
    loadingBarRef.current.loading();
    preload.then(() => {
      setSelectedKeys([key]);
      history.push(currentRoute.path ? currentRoute.path : `/${key}`);
      loadingBarRef.current.success();
    });
  }

  function toggleCollapse() {
    setCollapsed((collapsed) => !collapsed);
  }

  const paddingLeft = showMenu ? { paddingLeft: menuWidth } : {};
  const paddingTop = showNavbar ? { paddingTop: navbarHeight } : {};
  const paddingStyle = { ...paddingLeft, ...paddingTop, height: '200px' };

  return (
    <Layout className={styles.layout}>
      <LoadingBar ref={loadingBarRef} />
      {showNavbar && (
        <div className={styles.layoutNavbar}>
          <Navbar />
        </div>
      )}
      <Layout>
        {showMenu && (
          <Sider
            className={styles.layoutSider}
            width={menuWidth}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            collapsible
            breakpoint="xl"
            style={paddingTop}
          >
            <div className={styles.menuWrapper}>
              <Menu
                hasCollapseButton={false}
                collapse={collapsed}
                onClickMenuItem={onClickMenuItem}
                selectedKeys={selectedKeys}
                accordion={showAccordion}
                mode={
                  showMode == 0
                    ? 'vertical'
                    : showMode == 1
                    ? 'pop'
                    : showMode == 2
                    ? 'popButton'
                    : 'vertical'
                }
              >
                {renderRoutes(locale)}
              </Menu>
            </div>
            <div className={styles.collapseBtn} onClick={toggleCollapse}>
              {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
            </div>
          </Sider>
        )}
        <Layout id={'arco-layout'} className={styles.layoutContent} style={paddingStyle}>
          <Content>
            {/* tag导航 */}

            <Switch>
              {flattenRoutes.map((route, index) => {
                return <Route key={index} path={`/${route.key}`} component={route.component} />;
              })}
              <Redirect push to={`/${defaultRoute}`} />
            </Switch>
            <BackTop
              visibleHeight={30}
              style={{ position: 'absolute' }}
              target={() => document.getElementById('arco-layout')}
            />
          </Content>
          {showFooter && <Footer />}
        </Layout>
      </Layout>
    </Layout>
  );
}

export default PageLayout;
