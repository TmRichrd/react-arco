import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Breadcrumb, Card, Avatar, Tag } from '@arco-design/web-react';
import { useDispatch, useSelector } from 'react-redux';
import { IconMan, IconPlus, IconRefresh, IconWoman } from '@arco-design/web-react/icon';
import useLocale from '../../utils/useLocale';
import style from './style/index.module.less';
import { ReducerState } from '../../redux';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';

import { userPage } from './api';

function SettingRoles() {
  const locale = useLocale();
  const rolesState = useSelector((state: ReducerState) => state.roles);
  const dispatch = useDispatch();
  const [page, setPage] = useState({ current: 1, size: 10 });
  const [query, setQuery] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { data, pagination, loading } = rolesState;
  function onSearch(keyword) {
    fetchData(page, query);
  }
  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    setPage({ current, size: pageSize });
    fetchData({ current, size: pageSize }, query);
  }
  function renderAvatar(record) {
    if (record.headPortrait) {
      return (
        <Avatar size={64} shape="square">
          <img src={record.headPortrait} alt="" />
        </Avatar>
      );
    }
    return (
      <Avatar size={64} shape="square">
        {record.realName}
      </Avatar>
    );
  }

  function renderGender(record) {
    if (record.sex == '0') {
      return (
        <Tag color="orangered" icon={<IconMan/>} size="medium">
          男
        </Tag>
      );
    }
    if (record.sex == '1') {
      return (
        <Tag color="blue" size="medium" icon={<IconWoman/>}>
          女
        </Tag>
      );
    }
  }

  const columns = [
    {
      title: locale['user.nickname'],
      dataIndex: 'nickname',
    },
    {
      title: locale['user.realname'],
      dataIndex: 'realName',
    },
    {
      title: locale['user.gender'],
      dataIndex: 'sex',
      render: (_col, record) => renderGender(record),
    },
    {
      title: locale['user.status'],
      dataIndex: 'status',
    },
    {
      title: locale['user.avatar'],
      dataIndex: 'headPortrait',
      render: (_col, record) => renderAvatar(record),
    },
    {
      title: locale['user.addr'],
      dataIndex: 'addr',
    },
    {
      title: locale['user.createuser'],
      dataIndex: 'createUserName',
    },
    {
      title: locale['user.createtime'],
      dataIndex: 'createTime',
    },
    {
      title: locale['menu.Operations'],
      dataIndex: 'operations',
      render: (_col, record) => (
        <div>
          <Button type="text">{locale['menu.view']}</Button>
        </div>
      ),
    },
  ];
  function fetchData(page, params = {}) {
    userPage(page.current, page.size, params).then((res) => {
      dispatch({ type: UPDATE_LIST, payload: { data: res.data.records } });
      dispatch({
        type: UPDATE_PAGINATION,
        payload: {
          pagination: {
            ...pagination,
            current: page.current,
            pageSize: page.size,
            total: res.data.total,
          },
        },
      });
      dispatch({ type: UPDATE_LOADING, payload: { loading: false } });
      dispatch({ type: UPDATE_FORM_PARAMS, payload: { params } });
    });
  }
  useEffect(() => {
    fetchData(page, query);
  }, []);
  useEffect(() => {}, [page]);
  useEffect(() => {}, [query]);
  return (
    <div className={style.container}>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>{locale['menu.setting']}</Breadcrumb.Item>
        <Breadcrumb.Item>{locale['menu.setting.roles']}</Breadcrumb.Item>
      </Breadcrumb>
      <Card bordered={false}>
        <div className={style.toolbar}>
          <div>
            <Button type="primary" icon={<IconPlus/>}>{locale['menu.add']}</Button>
          </div>
          <div>
            <Input.Search
              style={{ width: 300, marginRight: 20 }}
              searchButton
              placeholder={locale['user.placeholder.roles']}
              onSearch={onSearch}
            />
            <Button icon={<IconRefresh />} />
          </div>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              console.log('onChange:', selectedRowKeys, selectedRows);
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
        />
      </Card>
    </div>
  );
}
export default SettingRoles;
