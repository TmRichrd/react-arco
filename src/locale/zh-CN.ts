import localeSettings from './zh-CN/settings';
import localeMessageBox from '../components/MessageBox/locale/zh-CN';
import localeWorkplace from '../pages/workplace/locale/zh-CN';
import localeSearchTable from '../pages/search-table/locale/zh-CN';
import localeSuccess from '../pages/success/locale/zh-CN';
import locale403 from '../pages/403/locale/zh-CN';
import locale404 from '../pages/404/locale/zh-CN';
import locale500 from '../pages/500/locale/zh-CN';
import localeStepForm from '../pages/step-form/locale/zh-CN';
import localeDataAnalysis from '../pages/data-analysis/locale/zh-CN';
import localeMultiDAnalysis from '../pages/multi-dimension-data-analysis/locale/zh-CN';
import localeCardList from '../pages/card-list/locale/zh-CN';
import localeError from '../pages/error/locale/zh-CN';
import localeGroupForm from '../pages/group-form/locale/zh-CN';
import localeUserInfo from '../pages/user-info/locale/zh-CN';
import localeUserSetting from '../pages/user-setting/locale/zh-CN';
import localeMonitor from '../pages/monitor/locale/zh-CN';
import localeBasicProfile from '../pages/basic-profile/locale/zh-CN';
import localeSettingRoles from '../pages/setting-roles/locale/zh-CN';
import localeSettingMenuList from "../pages/setting-menulist/locale/zh-CN"
import localeSettingUser from "../pages/setting-user/locale/zh-CN"
export default {
  'menu.dashboard': '仪表盘',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.setting': '系统设置',
  'menu.add':"新增",
  'menu.view':"查看",
  'menu.edit':"编辑",
  'menu.delete':"删除",
  'menu.Operations':"操作",
  "menu.deletetip":"是否确认删除?",
  "menu.Creator":"创建人",
  "menu.please":"请输入",
  "menu.man":"男",
  "menu.woman":"女",
  ...localeSettings,
  ...localeMessageBox,
  ...localeWorkplace,
  ...localeSearchTable,
  ...localeSuccess,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeStepForm,
  ...localeDataAnalysis,
  ...localeMultiDAnalysis,
  ...localeCardList,
  ...localeError,
  ...localeGroupForm,
  ...localeUserInfo,
  ...localeUserSetting,
  ...localeMonitor,
  ...localeBasicProfile,
  ...localeSettingRoles,
  ...localeSettingMenuList,
  ...localeSettingUser
};
