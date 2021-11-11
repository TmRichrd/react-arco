import React, { useState, useEffect } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import rootReducer from './redux';
import history from './history';
import { generate, getRgbStr } from '@arco-design/color';
import PageLayout from './layout/page-layout';
import Setting from './components/Settings';
import { GlobalContext } from './context';
import './style/index.less';
import './mock';
import Login from './pages/login';
import checkLogin from './utils/checkLogin';
// 获取全部图标
// import * as IconList from '@arco-design/web-react/icon/index.js';

const store = createStore(rootReducer);

function Index() {
  const localeName = localStorage.getItem('arco-lang') || 'zh-CN';
  const theme = document.querySelector('body').getAttribute('arco-theme') || 'light';
  if (!localStorage.getItem('arco-lang')) {
    localStorage.setItem('arco-lang', localeName);
  }

  const [locale, setLocale] = useState();
  async function fetchLocale(ln?: string) {
    const locale = (await import(`./locale/${ln || localeName}`)).default;
    setLocale(locale);
  }

  function getArcoLocale() {
    switch (localeName) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  }

  async function fetchUserInfo() {
    const data = JSON.parse(localStorage.getItem('arco-userinfo') || '[]');
    store.dispatch({
      type: 'update-userInfo',
      payload: { userInfo: data },
    });
    store.dispatch({
      type: 'update-token',
      payload: { token: data.token },
    });
  }


  function setTheme() {
    const themeSettings = JSON.parse(localStorage.getItem('arco-settings')) || null;
    if (themeSettings) {
      store.dispatch({ type: 'update-settings', payload: { settings: themeSettings } });
      const newList = generate(themeSettings.themeColor, { list: true, dark: theme === 'dark' });
      newList.forEach((l, index) => {
        const rgbStr = getRgbStr(l);
        document.body.style.setProperty(`--arcoblue-${index + 1}`, rgbStr);
      });
      themeSettings.colorWeek
        ? (document.body.style.filter = 'invert(80%)')
        : (document.body.style.filter = 'none');
    }
  }

  useEffect(() => {
    fetchLocale();
  }, []);

  useEffect(() => {
    setTheme();
  }, []);

  useEffect(() => {
    if (checkLogin()) {
      fetchUserInfo();
    } else {
      history.push('/user/login');
    }
  }, []);

  const contextValue = {
    locale,
  };

  return locale ? (
    <Router history={history}>
      <ConfigProvider locale={getArcoLocale()}>
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <Switch>
              <Route path="/user/login" component={Login} />
              <Route path="/" component={PageLayout} />
            </Switch>
            <Setting />
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </Router>
  ) : null;
}

ReactDOM.render(<Index />, document.getElementById('root'));
