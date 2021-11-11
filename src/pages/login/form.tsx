import { Form, Input, Checkbox, Link, Button, Space, Message } from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import styles from './style/index.module.less';
import history from '../../history';
import { getUserMenu, loginByAccount } from '../../api';
import { useDispatch } from 'react-redux';
export default function LoginForm() {
  const dispatch = useDispatch();
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  async function afterLoginSuccess(params, data) {
    // 记住密码
    if (rememberPassword) {
      localStorage.setItem('loginParams', JSON.stringify(params));
    } else {
      localStorage.removeItem('loginParams');
    }
    // 请求用户菜单
    const res = await getUserMenu(data.id);
    const { umsRoleMenuVOList } = res.data;
    if (umsRoleMenuVOList.length != 0) {
      localStorage.setItem('arco-routers', JSON.stringify(umsRoleMenuVOList));
    }

    dispatch({ type: 'update-userInfo', payload: { userInfo: data } });
    localStorage.setItem('arco-userinfo', JSON.stringify(data));

    // 记录登录状态
    localStorage.setItem('userStatus', 'login');
    Message.success('登录成功');
    // 跳转首页
    setTimeout(() => {
      window.location.href = history.createHref({
        pathname: '/',
      });
    }, 700);
  }

  function login(params) {
    setErrorMessage('');
    setLoading(true);
    loginByAccount(params)
      .then((res) => {
        const { code, message, data } = res;
        if (code == 200) {
          afterLoginSuccess(params, data);
        } else {
          setErrorMessage(message || '登录出错，请刷新重试');
          Message.error(message || '登录出错，请刷新重试');
        }
      })
      .finally(() => {
        setLoading(false);
      });
    // axios
    //   .post('/api/user/login', params)
    //   .then((res) => {
    //     const { status, msg } = res.data;
    //     if (status === 'ok') {
    //       afterLoginSuccess(params);
    //     } else {
    //       setErrorMessage(msg || '登录出错，请刷新重试');
    //     }
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      login(values);
    });
  }

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const params = localStorage.getItem('loginParams');
    const rememberPassword = !!params;
    setRememberPassword(rememberPassword);
    if (formRef.current && rememberPassword) {
      const parseParams = JSON.parse(params);
      formRef.current.setFieldsValue(parseParams);
    }
  }, []);
  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>登录 Arco Design Pro</div>
      <div className={styles['login-form-sub-title']}>登录 Arco Design Pro</div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form size={'large'} className={styles['login-form']} layout="vertical" ref={formRef}>
        <Form.Item field="account" rules={[{ required: true, message: '用户名不能为空' }]}>
          <Input
            prefix={<IconUser />}
            placeholder="用户名"
            autoComplete={'off'}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item field="password" rules={[{ required: true, message: '密码不能为空' }]}>
          <Input.Password
            placeholder="密码"
            autoComplete={'off'}
            prefix={<IconLock />}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} direction="vertical">
          <div className={styles['login-form-password-actions']}>
            <Checkbox checked={rememberPassword} onChange={setRememberPassword}>
              记住密码
            </Checkbox>
            <Link>忘记密码？</Link>
          </div>
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            登录
          </Button>
          <Button type="text" long className={styles['login-form-register-btn']}>
            注册账号
          </Button>
        </Space>
      </Form>
    </div>
  );
}
