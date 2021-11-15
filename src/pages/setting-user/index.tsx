import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  Button,
  Input,
  Breadcrumb,
  Card,
  Avatar,
  Space,
  Switch,
  Message,
  Popconfirm,
  Drawer,
  Form,
  Select,
  Upload,
  Modal,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { useDispatch, useSelector } from 'react-redux';
import { IconCheck, IconClose, IconPlus, IconRefresh } from '@arco-design/web-react/icon';
import useLocale from '../../utils/useLocale';
import style from './style/index.module.less';
import { ReducerState } from '../../redux';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import { userAdd, userDetail, userPage, userRemove, userUpdate } from './api';
import { uploadUrl } from '../../config';
import { validatePhone } from '../../utils/util';
import { isArray } from '../../utils/is';
import { rolesByUser, rolesList, rolesSubmit } from '../setting-roles/api';

function SettingRoles() {
  const locale = useLocale();
  const formRef = useRef<FormInstance>();
  const rolesRef = useRef<FormInstance>();
  const FormItem = Form.Item;
  const Option = Select.Option;
  const options = [
    {
      label: 'menu.man',
      value: 0,
    },
    {
      label: 'menu.woman',
      value: 1,
    },
  ];
  const rolesState = useSelector((state: ReducerState) => state.roles);
  const dispatch = useDispatch();
  const [page, setPage] = useState({ current: 1, size: 10 });
  const [query, setQuery] = useState({});
  const [file, setFile] = useState([]);
  const [rolesConfig,setRolesConfig] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const {data, pagination, loading } = rolesState;
  const [visible, setVisible] = useState(false);
  const [rolesVisible, setRolesVisible] = useState(false);
  const [type, setType] = useState('add');
  const [id, setId] = useState(null);
  var defaultSelectRoles =[]
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

  function onSearch(keyword) {
    setQuery({ nickname: keyword });
    fetchData(page, { nickname: keyword });
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
        {record.nickname}
      </Avatar>
    );
  }
  async function handleChangeStatus(id, e) {
    const res = await userUpdate({ id, status: Number(e) });
    res.code == 200 ? Message.success(res.message) : Message.error(res.message);
    fetchData(page, query);
  }

  function renderGender(record) {
    return record.sex == '0' ? <span>男</span> : <span>女</span>;
  }
  function renderStatus(id: string, status: number) {
    return (
      <Switch
        type="round"
        onChange={(e) => handleChangeStatus(id, e)}
        checkedIcon={<IconCheck />}
        uncheckedIcon={<IconClose />}
        checked={status == 1}
      />
    );
  }

  async function handleDel(id: string): Promise<any> {
    const res = await userRemove(id);
    res.code == 200 ? Message.success(res.message) : Message.error(res.message);
    fetchData(page, query);
  }
  async function handleEdit(id: string): Promise<any> {
    const res = await userDetail(id);
    setId(res.data.id);
    setType('edit');
    setVisible(true);
    formRef.current.setFieldsValue(res.data);
    if (res.data.headPortrait)
      setFile([{ uid: res.data.id, name: res.data.id, url: res.data.headPortrait }]);
  }
  function handleChangeRoles(){
    let model ={
      umsUserRoleList:[],
      userId:selectedRowKeys[0]
    }
    rolesRef.current.validate().then(async value=>{
      value.umsUserRoleList.forEach(item=>{
        let uArr = {
          roleId:item,
          userId:selectedRowKeys[0]
        }
        model.umsUserRoleList.push(uArr)
      })
      const res= await rolesSubmit(model)
      res.code==200? Message.success(res.message) : Message.error(res.message)
      rolesRef.current.resetFields()
      setRolesVisible(false)
    })
  }
  function renderPwd() {
    if (type == 'add') {
      return (
        <FormItem label={locale['user.password']} rules={[{ required: true,message:locale['menu.please'] + locale['user.password'] }]} field="password">
          <Input type="password" allowClear />
        </FormItem>
      );
    }
  }

  const columns = [
    {
      title:locale['user.username'],
      dataIndex:"userName"
    },
    {
      title: locale['user.nickname'],
      dataIndex: 'nickname',
    },
    // {
    //   title: locale['user.realname'],
    //   dataIndex: 'realName',
    // },
    {
      title: locale['user.gender'],
      dataIndex: 'sex',
      render: (_col, record) => renderGender(record),
    },

    {
      title: locale['user.avatar'],
      dataIndex: 'headPortrait',
      render: (_col, record) => renderAvatar(record),
    },
    {
      title: locale['user.phone'],
      dataIndex: 'phone',
    },
    {
      title: locale['user.status'],
      dataIndex: 'status',
      render: (_col, record) => renderStatus(record.id, record.status),
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
  async function add(value): Promise<any> {
    if (isArray(value.headPortrait) && value.headPortrait.length) {
      value.headPortrait = value.headPortrait[0].response.data.fileUrl;
    }
    const res = await userAdd(value);
    res.code == 200 ? Message.success(res.message) : Message.error(res.message);
    fetchData(page, query);
  }
  async function edit(value): Promise<any> {
    value.id = id;
    if (isArray(value.headPortrait) && value.headPortrait.length) {
      value.headPortrait = value.headPortrait[0].response.data.fileUrl;
    }
    const res = await userUpdate(value);
    res.code == 200 ? Message.success(res.message) : Message.error(res.message);
    fetchData(page, query);
  }
  function handleAdd() {
    setVisible(true);
    setType('add');
    setId(null);
    setTimeout(() => {
      formRef.current.setFieldsValue({ sex: 0 });
    }, 80);
  }
  function handleSubmitForm() {
    formRef.current.validate().then((value) => {
      id ? edit(value) : add(value);
      setVisible(false);
    });
  }
 async function handleConfigRoles(){
    if (selectedRowKeys.length == 0) return Message.warning(locale['user.configtip']);
    if (selectedRowKeys.length > 1) return Message.warning(locale['user.configlength']);
    const {data} = await rolesList()
    const res= await rolesByUser(selectedRowKeys[0])
    if(res.data.length) {
      res.data.forEach(item=>{
        defaultSelectRoles.push(item.roleId)
      })
    }
    setRolesVisible(true)
    setRolesConfig(data)
    rolesRef.current.setFieldsValue({umsUserRoleList:defaultSelectRoles})
  }
  useEffect(() => {
    fetchData(page, query);
  }, []);
  useEffect(() => {}, [page]);
  useEffect(() => {}, [id]);
  useEffect(() => {}, [query]);
  useEffect(() => {}, [rolesConfig]);
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
              <Button type="default" status="warning" onClick={handleConfigRoles}>
                {locale['user.permission']}
              </Button>
            </Space>
          </div>
          <div>
            <Input.Search
              style={{ width: 300, marginRight: 20 }}
              searchButton
              onClear={() => fetchData(page)}
              allowClear
              placeholder={locale['user.placeholder.roles']}
              onSearch={onSearch}
            />
            <Button icon={<IconRefresh />} onClick={() => fetchData(page, query)} />
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
        <Drawer
          width={332}
          title={<span>{locale[`menu.${type}`] + locale['menu.setting.roles']}</span>}
          visible={visible}
          onOk={() => {
            handleSubmitForm();
          }}
          onCancel={() => {
            setVisible(false);
            formRef.current.resetFields();
            setFile([]);
          }}
        >
          <Form ref={formRef} {...formItemLayout} size="large" layout="vertical">
            <FormItem label={locale['user.username']} rules={[{required:true,message:locale['menu.please'] + locale['user.username']}]} field="userName">
              <Input allowClear autoComplete="off" />
            </FormItem>
            <FormItem label={locale['user.nickname']} rules={[{ required: true,message:locale['menu.please'] + locale['user.username'] }]} field="nickname">
              <Input allowClear autoComplete="off" />
            </FormItem>
            {renderPwd()}
            <FormItem
              label={locale['user.phone']}
              required
              rules={[
                {
                  validator(value, cb) {
                    if (!value) {
                      return cb(locale['user.phone.validate']);
                    }
                    if (!validatePhone(value)) {
                      return cb('请输入正确的手机号');
                    }
                    return cb();
                  },
                },
              ]}
              field="phone"
            >
              <Input allowClear autoComplete="off" />
            </FormItem>
            <FormItem label={locale['user.gender']} field="sex">
              <Select>
                {options.map((option, index) => {
                  return (
                    <Option key={index} value={option.value}>
                      {locale[option.label]}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
            <FormItem label={locale['user.avatar']} field="headPortrait">
              <Upload
                limit={1}
                fileList={file}
                listType="picture-card"
                action={uploadUrl}
                onExceedLimit={() => {
                  Message.warning('超过上传数量限制！最多上传1个');
                }}
                onPreview={(file) => {
                  Modal.info({
                    title: '预览',
                    content: (
                      <div style={{ textAlign: 'center' }}>
                        <img
                          style={{ maxWidth: '100%' }}
                          src={file.url || URL.createObjectURL(file.originFile)}
                        />
                      </div>
                    ),
                  });
                }}
                onChange={(fileList) => {
                  setFile(fileList);
                }}
                onRemove={(_file, fileList) => {
                  setFile(fileList);
                }}
              />
            </FormItem>
          </Form>
        </Drawer>
        <Modal title={locale['user.permission']} onOk={handleChangeRoles} visible={rolesVisible} focusLock autoFocus={false} onCancel={()=>setRolesVisible(false)}>
                <Form {...formItemLayout} ref={rolesRef}>
                  <FormItem label={locale['user.permissionlist']} field="umsUserRoleList" rules={[{required:true,message:locale['user.changeroles']}]}>
                    <Select mode='multiple' allowClear maxTagCount={2}>
                    {
                      rolesConfig.map(item=> <Option key={item.id} value={item.id}>{item.roleName}</Option>)
                    }
                    </Select>
                  </FormItem>
                </Form>
        </Modal>
      </Card>
    </div>
  );
}
export default SettingRoles;
