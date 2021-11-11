import defaultSettings from '../settings.json';

const defaultTheme = localStorage.getItem('arco-theme') || 'light';
const defaultScreen = localStorage.getItem('arco-screen') || false;

function changeTheme(newTheme?: 'string') {
  if ((newTheme || defaultTheme) === 'dark') {
    document.body.setAttribute('arco-theme', 'dark');
  } else {
    document.body.removeAttribute('arco-theme');
  }
}

// init page theme
changeTheme();

export interface GlobalState {
  theme?: string;
  screen?: string | boolean,
  settings?: typeof defaultSettings;
  token?: string,
  routes?: [],
  userInfo?: {
    name?: string;
    nickname?: string;
    realName?: string;
    roleName?: string,
    avatar?: string;
    headPortrait?: string,
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    token?: string,
    userName?: string
  };
}

const initialState: GlobalState = {
  theme: defaultTheme,
  settings: defaultSettings,
  userInfo: null,
  screen: defaultScreen,
  token: null,
  routes:[]
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'toggle-theme': {
      const { theme } = action.payload;
      if (theme === 'light' || theme === 'dark') {
        localStorage.setItem('arco-theme', theme);
        changeTheme(theme);
      }

      return {
        ...state,
        theme,
      };
    }
    case 'update-settings': {
      const { settings } = action.payload;
      localStorage.setItem('arco-settings', JSON.stringify(settings, null, 2));
      return {
        ...state,
        settings,
      };
    }
    case 'update-userInfo': {
      const { userInfo } = action.payload;
      return {
        ...state,
        userInfo,
      };
    }
    case 'update-token': {
      const { token } = action.payload;
      return {
        ...state,
        token,
      };
    }
    case 'update-routers': {
      const { routers } = action.payload;
      return {
        ...state,
        routes:routers,
      };
    }
    default:
      return state;
  }
}
