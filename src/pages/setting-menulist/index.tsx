import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  InputNumber,
  Switch,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { useDispatch, useSelector } from 'react-redux';
import { IconRefresh, IconSettings } from '@arco-design/web-react/icon';
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
  const [showSelect, setShowSelect] = useState(true);
  const [page, setPage] = useState({ current: 1, size: 10 });
  const [query, setQuery] = useState({ name: '' });
  const [visible, setVisible] = useState(false);
  const [iconvisible, setIconVisible] = useState(false);
  const [icons, setIcons] = useState(<IconSettings />);
  const [id, setId] = useState(null);
  const [type, setType] = useState('add');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const FormItem = Form.Item;
  const formRef = useRef<FormInstance>();
  const MenuIconRef: any = useRef();
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
    setQuery({ name: keyword });
    fetchData(page, { name: keyword });
  }
  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    setPage({ current, size: pageSize });
    fetchData({ current, size: pageSize }, query);
  }

  function handleRefresh() {
    fetchData(page, query);
  }

  const handleGetIcon = useCallback(() => {
    formRef.current.setFieldsValue({ icon: MenuIconRef.current.icon });
    setIconVisible(false);
    setIcons(React.createElement(IconList[MenuIconRef.current.icon]));
  }, []);

  function handleCancel() {
    setVisible(false);
    formRef.current.setFieldsValue({ icon: 'IconSettings' });
    formRef.current.resetFields();
    setIcons(<IconSettings />);
  }

  async function handleAdd() {
    setType('add');
    const res = await menuList({ parentId: '0' });
    const options = res.data;
    options.unshift({ id: '0', name: '无' });
    setParentMenu(options);
    setVisible(true);
    formRef.current.resetFields();
    setShowSelect(true);
    formRef.current.setFieldsValue({ icon: 'IconSettings', parentId: '0' });
  }
  function handleDel(ids: string) {
    menuRemove(ids).finally(() => fetchData(page, query));
  }
  function handleClear() {
    fetchData(page);
  }
  async function handleEdit(id: string) {
    setType('edit');
    const res = await menuList({ parentId: '0' });

    const options = res.data;
    options.unshift({ id: '0', name: '无' });
    setParentMenu(options);
    menuDetail(id).then((res) => {
      if (res.data.parentId == '0') setShowSelect(true);
      setShowSelect(false);
      setType('edit');
      setVisible(true);
      formRef.current.setFieldsValue(res.data);
      setId(res.data.id);
    });
  }
  function handleChangeParent(e) {
    e == '0' ? setShowSelect(true) : setShowSelect(false);
  }
  function add(value) {
    menuAdd(value)
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

  function renderIcon(value) {
    return value.icon ? React.createElement(IconList[value.icon]) : <span />;
  }
  function renderSwitch(hideStatus: number) {
    return (
      <Switch
        type="round"
        checkedIcon={<IconList.IconCheck />}
        uncheckedIcon={<IconList.IconClose />}
        checked={hideStatus == 1}
      />
    );
  }

  function edit(value) {
    menuUpdate({ id, ...value })
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
      }
    });
  }

  function renderSelect() {
    if (showSelect) {
      return (
        <FormItem
          label={locale['menulist.icon']}
          required
          field="icon"
          rules={[{ required: true }]}
        >
          <Input
            placeholder=""
            autoComplete="off"
            onClick={() => handleChangeIcon()}
            readOnly
            addAfter={icons}
          />
        </FormItem>
      );
    }
  }
  function renderLink() {
    if (!showSelect) {
      return (
        <FormItem
          label={locale['menulist.link']}
          required
          field="link"
          rules={[{ required: true }]}
        >
          <Input placeholder="" autoComplete="off" />
        </FormItem>
      );
    }
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
      title: locale['menulist.sort'],
      dataIndex: 'orderNum',
    },
    {
      title: locale['menulist.link'],
      dataIndex: 'link',
    },
    {
      title: locale['menu.Operations'],
      dataIndex: 'operations',
      render: (_col, record) => (
        <div className={style.operations}>
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
  function handleChangeIcon() {
    setIconVisible(true);
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
  useEffect(() => {}, [parentMenu]);
  useEffect(() => {}, [icons]);
  useEffect(() => {}, [showSelect]);
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
              onClear={handleClear}
              allowClear
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
        />
      </Card>

      <Modal
        title={locale[`menu.${type}`]}
        visible={visible}
        onOk={onOk}
        onCancel={() => handleCancel()}
        autoFocus={false}
        focusLock
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout} ref={formRef}>
          <FormItem
            label={locale['menulist.superior']}
            field="parentId"
            rules={[{ required: true }]}
          >
            <Select allowClear onChange={handleChangeParent}>
              {parentMenu.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            label={locale['menulist.name']}
            field="name"
            rules={[{ required: true, message: locale['menu.please'] + locale['menulist.name'] }]}
          >
            <Input placeholder="" autoComplete="off" />
          </FormItem>
          {/* <FormItem
            label={locale['menulist.icon']}
            required
            field="icon"
            rules={[{ required: true }]}
          >
            <Input
              placeholder=""
              autoComplete="off"
              onClick={() => handleChangeIcon()}
              readOnly
              addAfter={icons}
            />
          </FormItem> */}
          {renderSelect()}
          {renderLink()}
          <FormItem
            label={locale['menulist.sort']}
            required
            field="orderNum"
            rules={[{ required: true }]}
          >
            <InputNumber placeholder="" min={1} />
          </FormItem>
          <FormItem
            label={locale['menulist.alias']}
            required
            field="router"
            rules={[{ required: true, message: locale['menu.please'] + locale['menulist.alias'] }]}
          >
            <Input placeholder="" disabled={type == 'edit'} autoComplete="off" />
          </FormItem>
        </Form>
      </Modal>
      <Modal
        style={{ width: '70%' }}
        onOk={handleGetIcon}
        title={locale['menulist.changeIcon']}
        visible={iconvisible}
        onCancel={() => setIconVisible(false)}
      >
        <MenuIcon ref={MenuIconRef} />
      </Modal>
    </div>
  );
}
export default SettingRoles;
