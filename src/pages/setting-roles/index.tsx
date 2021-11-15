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
  Drawer,
  Tree,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { useDispatch, useSelector } from 'react-redux';
import { IconPlus, IconRefresh } from '@arco-design/web-react/icon';
import * as IconList from '@arco-design/web-react/icon/index.js';
import useLocale from '../../utils/useLocale';
import style from './style/index.module.less';
import { ReducerState } from '../../redux';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import { rolesAdd, rolesDetail, rolesPage, rolesRemove, rolesUpdate, rolesTree } from './api';
import { menuPage } from '../setting-menulist/api';
import { isArray } from '../../utils/is';

function SettingRoles() {
  const locale = useLocale();
  const rolesState = useSelector((state: ReducerState) => state.roles);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [realKeys, setRealKeys] = useState([]);
  const [page, setPage] = useState({ current: 1, size: 10 });
  const [query, setQuery] = useState({ roleName: null });
  const [visible, setVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState('add');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const FormItem = Form.Item;
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const formRef = useRef<FormInstance>();
  const treeFormRef = useRef<FormInstance>();
  const { data, pagination, loading } = rolesState;
  const [checkedStrategy] = useState(Tree.SHOW_ALL);
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };
  const fieldNames = {
    key: 'id',
    title: 'name',
    icon: '',
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
    setType('add');
    setVisible(true);
  }
  async function handleSetMenu() {
    if (selectedRowKeys.length == 0) return Message.warning(locale['roles.configtip']);
    if (selectedRowKeys.length > 1) return Message.warning(locale['roles.configlength']);
    // 请求menu
    const res = await menuPage(1, 10000, {});
    const { records } = res.data;
    if (records.length != 0) {
      records.forEach((item) => {
        item.icon = React.createElement(IconList[item.icon]);
      });
    }
    setTreeData(records);
    setDrawerVisible(true);
    const result = await rolesTree(selectedRowKeys[0]);
    const TreecheckedKeys = FormatTreeData(result.data);
    setCheckedKeys(TreecheckedKeys);
  }
  function handleCheckKeys(value, extra) {
    let newsKeys = [];
    const pathParentKeys = extra.node.props.pathParentKeys;
    newsKeys = [...value, ...pathParentKeys];
    setRealKeys(newsKeys);
    setCheckedKeys(value);
  }
  function FormatTreeData(data) {
    const res = [];
    function travel(data) {
      data.forEach((item) => {
        if (item.parentId != '0') res.push(item.menuId);
        if (isArray(item.children) && item.children.length) travel(item.children);
      });
    }
    travel(data);
    return res;
  }
  function handleDel(ids: string) {
    rolesRemove(ids).finally(() => fetchData(page, query));
  }
  function handleView(id: string) {
    rolesDetail(id).then((res) => {
      setType('view');
      setVisible(true);
      formRef.current.setFieldsValue(res.data);
      setId(res.data.id);
    });
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
    rolesAdd(value)
      .then((res) => {
        if (res.code == 200) {
          Message.success(res.message);
          setVisible(false);
          formRef.current.resetFields();
          fetchData(page, query);
        } else {
          Message.error(res.message);
        }
      })
      .finally(() => {
        setConfirmLoading(false);
        setId(null);
      });
  }

  function handleCanel() {
    setVisible(false);
    formRef.current.resetFields();
    setId(null);
  }
  function unique(arr) {
    return Array.from(new Set(arr));
  }
  function handleUpdateTree() {
    const res = unique(realKeys);
    const umsRoleMenuList = [];
    if (res.length) {
      res.forEach((item) => {
        const menuObj = {
          menuId: item,
          roleId: selectedRowKeys[0],
        };
        umsRoleMenuList.push(menuObj);
      });
    }
    const model = {
      id: selectedRowKeys[0],
      umsRoleMenuList,
    };
    rolesUpdate(model).then((rt) => {
      rt.code==200? Message.success(rt.message) : Message.error(rt.message)
    }).finally(()=>{
      setDrawerVisible(false)
    })
  }
  function edit(value) {
    rolesUpdate({ id, ...value })
      .then((res) => {
        if (res.code == 200) {
          Message.success(res.message);
          setVisible(false);
          formRef.current.resetFields();
          fetchData(page, query);
        } else {
          Message.error(res.message);
        }
      })
      .finally(() => {
        setConfirmLoading(false);
        setId(null);
      });
  }

  function onOk() {
    formRef.current.validate().then((value) => {
      setConfirmLoading(true);
      if (type == 'add') {
        add(value);
      } else if (type == 'edit') {
        edit(value);
        1;
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
          <Button type="text" size="small" onClick={() => handleView(record.id)}>
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
  useEffect(() => {}, [treeData]);
  useEffect(() => {}, [checkedKeys]);
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
            <Space>
              <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
                {locale['menu.add']}
              </Button>
              <Button status="warning" onClick={handleSetMenu}>
                {locale['roles.permission']}
              </Button>
            </Space>
          </div>
          <div>
            <Input.Search
              style={{ width: 300, marginRight: 20 }}
              searchButton
              onClear={()=>fetchData(page)}
              allowClear
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
        okButtonProps={{ disabled: type == 'view' }}
        autoFocus={false}
        focusLock
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout} size="large" ref={formRef}>
          <FormItem
            label={locale['roles.name']}
            field="roleName"
            rules={[{ required: true, message: locale['menu.please'] + locale['roles.name'] }]}
          >
            <Input placeholder="" autoComplete="off" disabled={type == 'view'} />
          </FormItem>
          <FormItem
            label={locale['roles.code']}
            required
            field="roleCode"
            rules={[{ required: true, message: locale['menu.please'] + locale['roles.code'] }]}
          >
            <Input placeholder="" autoComplete="off" disabled={type == 'view'} />
          </FormItem>
          <FormItem
            label={locale['roles.remark']}
            required
            field="remark"
            rules={[{ required: true, message: locale['menu.please'] + locale['roles.remark'] }]}
          >
            <Input placeholder="" autoComplete="off" disabled={type == 'view'} />
          </FormItem>
        </Form>
      </Modal>
      {/* 权限 */}
      <Drawer
        width={432}
        title={<span>{locale['roles.permission']}</span>}
        visible={drawerVisible}
        onOk={() => {
          handleUpdateTree();
        }}
        onCancel={() => {
          setDrawerVisible(false);
        }}
      >
        <Form {...formItemLayout} ref={treeFormRef} size="large" layout="vertical">
          <FormItem>
            <Tree
              checkable
              multiple
              size="large"
              showLine
              checkedKeys={checkedKeys}
              checkedStrategy={checkedStrategy}
              fieldNames={fieldNames}
              treeData={treeData}
              selectedKeys={selectedKeys}
              onCheck={(value, extra) => {
                handleCheckKeys(value, extra);
              }}
            />
          </FormItem>
        </Form>
      </Drawer>
    </div>
  );
}
export default SettingRoles;
