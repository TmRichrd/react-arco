import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Breadcrumb, Card } from '@arco-design/web-react';
import useLocale from '../../utils/useLocale';
import style from './style/index.module.less';
import { ReducerState } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { IconRefresh } from '@arco-design/web-react/icon';
// import axios from 'axios';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
function SettingRoles() {
  const locale = useLocale();
  const rolesState = useSelector((state: ReducerState) => state.roles);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [type, setType] = useState('checkbox');
  const { data, pagination, loading } = rolesState;
  function onSearch(keyword) {
    console.log('🚀 ~ file: index.tsx ~ line 16 ~ onSearch ~ keyword', keyword);
  }
  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    console.log(current, pageSize);
  }

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
  ];
  function fetchData(current = 1, pageSize = 10, params = {}) {
    dispatch({ type: UPDATE_LIST, payload: { data: [{ id: '1', name: '管理员' }] } });
    dispatch({
      type: UPDATE_PAGINATION,
      payload: { pagination: { ...pagination, current, pageSize, total: 1 } },
    });
    dispatch({ type: UPDATE_LOADING, payload: { loading: false } });
    dispatch({ type: UPDATE_FORM_PARAMS, payload: { params } });
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className={style.container}>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>{locale['menu.setting']}</Breadcrumb.Item>
        <Breadcrumb.Item>{locale['menu.setting.roles']}</Breadcrumb.Item>
      </Breadcrumb>
      <Card bordered={false}>
        <div className={style.toolbar}>
          <div>
            <Button type="primary">{locale['menu.add']}</Button>
          </div>
          <div>
            <Input.Search
              style={{ width: 300, marginRight: 20 }}
              searchButton
              placeholder={locale['roles.placeholder.roles']}
              onSearch={onSearch}
            />
            <Button icon={<IconRefresh />}></Button>
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
