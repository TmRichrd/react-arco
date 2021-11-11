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
  Select,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { useDispatch, useSelector } from 'react-redux';
import { IconRefresh,IconSettings } from '@arco-design/web-react/icon';
import * as IconList from '@arco-design/web-react/icon/index.js';
import useLocale from '../../utils/useLocale';
import style from './style/index.module.less';
import { ReducerState } from '../../redux';
import MenuIcon from './components/MenuIcon';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import { menuAdd, menuDetail, menuList, menuPage, menuRemove, menuUpdate } from './api';

function SettingRoles() {
  const locale = useLocale();
  const rolesState = useSelector((state: ReducerState) => state.roles);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState({ current: 1, size: 10 });
  const [query, setQuery] = useState({ roleName: null });
  const [visible, setVisible] = useState(false);
  const [iconvisible, setIconVisible] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState('add');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const FormItem = Form.Item;
  const formRef = useRef<FormInstance>();
  const MenuIconRef  = useRef()
  const Option = Select.Option;
  const [parentMenu, setParentMenu] = useState([]);
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

  async function handleAdd() {
    setVisible(true);
    // 请求父级
    const res = await menuList({ parentId: '0' });
    const options = res.data;
    options.unshift({ id: '0', name: '无' });
    setParentMenu(options);
    setVisible(true);
    formRef.current.setFieldsValue({icon:"IconSetting"})
  }
  function handleDel(ids: string) {
    menuRemove(ids).finally(() => fetchData(page, query));
  }
  function handleEdit(id: string) {
    menuDetail(id).then((res) => {
      setType('edit');
      setVisible(true);
      formRef.current.setFieldsValue(res.data);
      setId(res.data.id);
    });
  }
  function add(value) {
    menuAdd(value).then((res) => {
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

  function renderIcon(value) {
    return value.icon ? React.createElement(IconList[value.icon]) : <span />;
  }

  function edit(value) {
    menuUpdate({ id, ...value }).then((res) => {
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
      title: locale['menulist.name'],
      dataIndex: 'name',
    },
    {
      title: locale['menulist.icon'],
      dataIndex: 'icon',
      render: (_col, record) => renderIcon(record),
    },
    {
      title: locale['menulist.alias'],
      dataIndex: 'router',
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
  function handleChangeIcon(){
    setIconVisible(true)
  }
  function fetchData(page, params = {}) {
    menuPage(page.current, page.size, params).then((res) => {
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
  useEffect(() => {
    console.log(parentMenu);
  }, [parentMenu]);
  return (
    <div className={style.container}>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>{locale['menu.setting']}</Breadcrumb.Item>
        <Breadcrumb.Item>{locale['menu.setting.menulist']}</Breadcrumb.Item>
      </Breadcrumb>
      <Card bordered={false}>
        <div className={style.toolbar}>
          <div>
            <Space>
              <Button type="primary" onClick={() => handleAdd()}>
                {locale['menu.add']}
              </Button>
            </Space>
          </div>
          <div>
            <Input.Search
              style={{ width: 300, marginRight: 20 }}
              searchButton
              placeholder={locale['menulist.placeholder.name']}
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
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout} ref={formRef}>
          <FormItem label={locale['menulist.superior']} field="parentId">
            <Select allowClear>
              {parentMenu.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label={locale['menulist.name']} field="name" rules={[{ required: true }]}>
            <Input placeholder="" autoComplete="off" />
          </FormItem>
          <FormItem
            label={locale['menulist.icon']}
            required
            field="icon"
            rules={[{ required: true }]}
          >
            <Input placeholder="" autoComplete="off" onClick={()=>handleChangeIcon()} readOnly addAfter={<IconSettings />}/>
          </FormItem>
          <FormItem
            label={locale['menulist.alias']}
            required
            field="router"
            rules={[{ required: true }]}
          >
            <Input placeholder="" autoComplete="off"/>
          </FormItem>
        </Form>
      </Modal>
      <Modal style={{width:"70%"}} title={locale['menulist.changeIcon']} visible={iconvisible} onCancel={() => setIconVisible(false)}>
                <MenuIcon MenuIconRef={MenuIconRef}/>
      </Modal>
    </div>
  );
}
export default SettingRoles;