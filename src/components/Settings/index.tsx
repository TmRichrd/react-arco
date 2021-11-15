import React, { useState } from 'react';
import { Drawer,Message } from '@arco-design/web-react';
import { IconSettings } from '@arco-design/web-react/icon';
import copy from 'copy-to-clipboard';
import { useSelector } from 'react-redux';
import { ReducerState } from '../../redux';
import Block from './block';
import ColorPanel from './color';
import useLocale from '../../utils/useLocale';
import styles from './style/index.module.less';
import MenuType from './type';
function Setting() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();
  const settings = useSelector((state: ReducerState) => state.global.settings);

  function onCopySettings() {
    copy(JSON.stringify(settings, null, 2))
    Message.success(locale['settings.copySuccess']);
    setVisible(false)
  }

  return (
    <div>
      <div className={styles.btn} onClick={() => setVisible(true)}>
        <IconSettings />
      </div>
      <Drawer
        width={300}
        title={
          <>
            <IconSettings />
            {locale['settings.title']}
          </>
        }
        visible={visible}
        okText={locale['settings.copySettings']}
        cancelText={locale['settings.close']}
        onOk={onCopySettings}
        onCancel={() => setVisible(false)}
      >
        <Block title={locale['settings.themeColor']}>
          <ColorPanel />
        </Block>
        <MenuType
          title={locale['settings.sider']}
          options={[
            { name: 'settings.vertical', value: 0 },
            { name: 'settings.pop', value: 1 },
            // { name: 'settings.popButton', value: 2 },
          ]}
        />
        <Block
          title={locale['settings.content']}
          options={[
            { name: 'settings.navbar', value: 'navbar' },
            { name: 'settings.menu', value: 'menu' },
            { name: 'settings.footer', value: 'footer' },
            { name: 'settings.accordion', value: 'menuAccordion' },
            { name: 'settings.menuWidth', value: 'menuWidth', type: 'number' },
          ]}
        />
        <Block
          title={locale['settings.otherSettings']}
          options={[{ name: 'settings.colorWeek', value: 'colorWeek' }]}
        />
        {/* <Alert content={locale['settings.alertContent']} /> */}
      </Drawer>
    </div>
  );
}

export default Setting;
