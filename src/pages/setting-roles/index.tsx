import React, { useEffect, useRef, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Breadcrumb,
  Card,
  Modal,
  Form,
  Message,
  Popconfirm,
  Space,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { useDispatch, useSelector } from 'react-redux';
import { IconRefresh } from '@arco-design/web-react/icon';
import useLocale from '../../utils/useLocale';
import style from './style/index.module.less';
import { ReducerState } from '../../redux';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import { rolesAdd, rolesDetail, rolesPage, rolesRemove, rolesUpdate } from './api';

function SettingRoles() {
  const locale = useLocale();
  const rolesState = useSelector((state: ReducerState) => state.roles);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState({ current: 1, size: 10 });
  const [query, setQuery] = useState({ roleName: null });
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState('add');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const FormItem = Form.Item;
  const formRef = useRef<FormInstance>();

  const { data, pagination, loading } = rolesState;
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };
  function onSearch(keyword) {
    setQuery({ roleName: keyword });
    fetchData(page, { roleName: keyword });
  }
  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    setPage({ current, size: pageSize });
    fetchData({ current, size: pageSize }, query);
  }

  function handleRefresh() {
    fetchData(page, query);
  }

  function handleAdd() {
    setType('add')
    setVisible(true);
  }
  function handleDel(ids: string) {
    rolesRemove(ids).finally(() => fetchData(page, query));
  }
  function handleEdit(id: string) {
    rolesDetail(id).then((res) => {
      setType('edit');
      setVisible(true);
      formRef.current.setFieldsValue(res.data);
      setId(res.data.id);
    });
  }
  function add(value) {
    rolesAdd(value).then((res) => {
      if (res.code == 200) {
        Message.success(res.message);
        setVisible(false);
        setConfirmLoading(false);
        formRef.current.resetFields();
        fetchData(page, query);
      } else {
        setConfirmLoading(false);
        Message.error(res.message);
      }
    });
  }

  function handleCanel() {
    setVisible(false);
    formRef.current.resetFields();
    setId(null);
  }

  function edit(value) {
    rolesUpdate({ id, ...value }).then((res) => {
      if (res.code == 200) {
        Message.success(res.message);
        setVisible(false);
        setConfirmLoading(false);
        formRef.current.resetFields();
        fetchData(page, query);
      } else {
        setConfirmLoading(false);
        Message.error(res.message);
      }
    });
  }

  function onOk() {
    formRef.current.validate().then((value) => {
      setConfirmLoading(true);
      if (type == 'add') {
        add(value);
      } else if (type == 'edit') {
        edit(value);
      }
    });
  }

  const columns = [
    {
      title: locale['roles.name'],
      dataIndex: 'roleName',
    },
    {
      title: locale['roles.code'],
      dataIndex: 'roleCode',
    },
    {
      title: locale['roles.remark'],
      dataIndex: 'remark',
    },
    {
      title: locale['menu.Operations'],
      dataIndex: 'operations',
      render: (_col, record) => (
        <div className={style.operations}>
          <Button type="text" size="small">
            {locale['menu.view']}
          </Button>
          <Button type="text" size="small" onClick={() => handleEdit(record.id)}>
            {locale['menu.edit']}
          </Button>
          <Popconfirm title={locale['menu.deletetip']} onOk={() => handleDel(record.id)}>
            <Button type="text" status="danger" size="small">
              {locale['menu.delete']}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  function fetchData(page, params = {}) {
    rolesPage(page.current, page.size, params).then((res) => {
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
  return (
    <div className={style.container}>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>{locale['menu.setting']}</Breadcrumb.Item>
        <Breadcrumb.Item>{locale['menu.setting.roles']}</Breadcrumb.Item>
      </Breadcrumb>
      <Card bordered={false}>
        <div className={style.toolbar}>
          <div>
            <Space>
              <Button type="primary" onClick={handleAdd}>
                {locale['menu.add']}
              </Button>
              <Button type="default" onClick={handleAdd}>
                {locale['roles.permission']}
              </Button>
            </Space>
          </div>
          <div>
            <Input.Search
              style={{ width: 300, marginRight: 20 }}
              searchButton
              placeholder={locale['roles.placeholder.roles']}
              onSearch={onSearch}
            />
            <Button icon={<IconRefresh />} onClick={handleRefresh} />
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
            onChange: (selectedRowKeys) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
        />
      </Card>

      <Modal
        title={locale[`menu.${type}`]}
        visible={visible}
        onOk={onOk}
        onCancel={() => handleCanel()}
        autoFocus={false}
        focusLock
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout} ref={formRef}>
          <FormItem label={locale['roles.name']} field="roleName" rules={[{ required: true }]}>
            <Input placeholder="" autoComplete="off" />
          </FormItem>
          <FormItem
            label={locale['roles.code']}
            required
            field="roleCode"
            rules={[{ required: true }]}
          >
            <Input placeholder="" autoComplete="off" />
          </FormItem>
          <FormItem
            label={locale['roles.remark']}
            required
            field="remark"
            rules={[{ required: true }]}
          >
            <Input placeholder="" autoComplete="off" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
export default SettingRoles;
