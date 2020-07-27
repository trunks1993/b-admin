import React, {useEffect, useState} from 'react';
import Styles from './index.css';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { TableListData } from '@/pages/data';
import MapForm from '@/components/MapFormComponent';
import { ColumnProps } from 'antd/lib/table/interface';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import _ from 'lodash';

import { ListItemType } from '@/models/product';
import { Icon, Row, Col, Select, Form, Button, Table, Checkbox, Pagination, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, KEFU_VISIT, SOURCE, WAY_RETURN_ALL, addKEFU_VISIT } from '@/const';
import GlobalModal from '@/components/GlobalModal';
import moment from 'moment';

import { addReturnVisitRecord, addReturnVisitRecordParamsType, deleteSoldClues, addSoldClues, addSoldCluesParamsType } from '../services/salesLeads';
import { router } from 'umi';

const { CstInput, CstSelect, CstTextArea, CstDatePicker } = MapForm;

interface ServiceProps extends TableListData<ListItemType>{
    dispatch: Dispatch<AnyAction>;
    loading: boolean;
    realname: string;
}

const service: React.FC<ServiceProps>=({ dispatch, list, total, loading, realname }) => {
    const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
    const [addFormList, setAddFormList] = React.useState<FormComponentProps['form'] | null>(null);
    const [addForm, setAddForm] = React.useState<FormComponentProps['form'] | null>(null);
    const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [souceVisible, setSouceVisible] = useState(false);
    const [code, setCode] = useState<number>();
    const [cluesCode, setCluesCode] = useState();

    useEffect(() => {
        initList();
    }, []);

    useEffect(() => {
        initList();
    }, [currPage]);

    /**
     * @name 触发列表加载effect
     * @param {type}
     */
    const dispatchInit = (callback?:()=> void) => {
        callback && callback();
        currPage === 1 ? initList() : setCurrPage(1);
    }

    /**
     * @name: 列表加载
     */
    const initList = () => {
        const data = filterForm?.getFieldsValue();
        dispatch({
            type: 'serviceInfo/fetchList',
            queryParams: {
                currPage,
                pageSize,
                ...data,
            },
        });
    };

    /** table的多选框 */
    const rowSelection = {
        selectedRowKeys,
        hideDefaultSelections: true,
        onChange: (selectedRowKeys: string[] | number[], selectedRows: ListItemType[]) => {
          setSelectedRowKeys(selectedRowKeys);
        },
    };

    /**
     * @name: checkbox onChange 事件
     * @param {CheckboxChangeEvent} e
     */
    const handleSelectAll = (e: CheckboxChangeEvent) => {
        const checked = e.target.checked;
        const keys = _.map(list, item => item.code.toString());
        const selections =
        (selectedRowKeys.length > 0 || checked) && selectedRowKeys.length !== keys.length ? keys : [];
        setSelectedRowKeys(selections);
    };

    /** 表头 */
    const columns: ColumnProps<ListItemType>[] = [
        {
            title: '手机号码',
            align: 'center',
            width: 120,
            key: 'telephone',
            dataIndex:'telephone',
            fixed: 'left',
        },
        {
            title: '联系人姓名',
            align: 'center',
            key: 'name',
            width: 100,
            dataIndex:'name'
        },
        {
            title: '公司名称',
            align: 'center',
            width: 120,
            dataIndex: 'companyName',
        },
        {
            title: '邮箱',
            align: 'center',
            dataIndex: 'email',
        },
        {
            title: '线索来源',
            align: 'center',
            width: 100,
            dataIndex: 'clueSource',
        },
        {
            title: '回访状态',
            align: 'center',
            width: 80,
            render: record => KEFU_VISIT[record.status]
        },
        {
            title: '创建时间',
            align: 'center',
            render: record =>
            record?.createTime && moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '最后回访时间',
            align: 'center',
            render: record =>
            record?.custReturnVisitRecords[0]?.returnVisitTime && moment(record.custReturnVisitRecords[0]?.returnVisitTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '最后回访人员',
            align: 'center',
            render: record=>record?.custReturnVisitRecords[0]?.returnVisitPerson
        },
        {
            title: '操作',
            align: 'center',
            width: 180,
            fixed: 'right',
            render: record => (
                <>
                    <Button type="link" onClick={()=>{setModalVisible(true);setCode(record.code)}} style={{ width:40, color:'#1A61DC', padding:0 }}>
                        添加
                    </Button>
                    <Button type="link" onClick={()=> router.push(`/service/manager/salesLeads/edit?id=${record.code}`)} style={{ width:40, color: '#999999', padding:0 }}>
                        查看
                    </Button>
                    <Button type="link" onClick={()=>{setCluesCode(record.code);deleteList();}} style={{ width:40, color:'#999999', padding:0 }}>
                        删除
                    </Button>
                </>
            ),
        },
    ];

    /** 添加回访记录 */
    const handleSource = () => {
        addFormList?.validateFields(async (error, value: addReturnVisitRecordParamsType) => {
            if (error) return;
            const params = {...value,cluesCode:code};
            const [err, data, msg] = await addReturnVisitRecord(params);
            setModalVisible(false);
            initList();
            if (!err) {
              message.success('操作成功');
              return true;
            } else {
              message.error(msg);
              return false;
            }
        });
    }

    /** 删除回访记录 */
    const deleteList = async() =>{
        Modal.confirm({
            title: '提示',
            content: '是否删除',
            okText: '确定',
            cancelText: '取消',
            onOk:  async() => {
                const cluesCodes = [];
                cluesCodes.push(cluesCode);
                const params = {cluesCodes}
                const [err, data, msg] = await deleteSoldClues(params); 
                initList();
                if (!err) {
                    message.success('操作成功');
                    return true;
                }
            },
        });
    }

    /** 添加线索 */
    const addSource = async() => {
        addForm?.validateFields(async (error, value: addSoldCluesParamsType) => {
            if (error) return;
            const params = {...value};
            const [err, data, msg] = await addSoldClues(params);
            setSouceVisible(false);
            initList();
            if (!err) {
              message.success('操作成功');
              return true;
            } else {
              message.error(msg);
              return false;
            }
        });
    }

    return ( 
        <div className={Styles.container}>
            <div className={Styles.toolbar}>
                <div onClick={()=>setSouceVisible(true)}><Icon type="plus" />添加线索</div>
            </div>
            <div className={Styles.filter}>
                <div className={Styles.filterBox}>
                    <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
                        <Row>
                            <Col span={7} >
                                <CstSelect
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    name="clueSource"
                                    label="线索来源"
                                    placeholder="全部"
                                >
                                    {_.map(SOURCE, (item, key) => (
                                        <Select.Option key={key} value={key}>
                                            {item}
                                        </Select.Option>
                                    ))}
                                </CstSelect>
                            </Col>
                            <Col span={8} >
                                <CstSelect
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    name="status"
                                    label="回访状态"
                                    placeholder="全部"
                                >
                                    {_.map(KEFU_VISIT, (item, key) => (
                                        <Select.Option key={key} value={key}>
                                            {item}
                                        </Select.Option>
                                    ))}
                                </CstSelect>
                            </Col>
                            <Col span={8} >
                                <CstInput
                                  labelCol={{ span: 8 }}
                                  wrapperCol={{ span: 16 }}
                                  label="手机号码"
                                  name='telephone'
                                  placeholder='输入客户手机号'
                                />
                            </Col>
                            <Col span={5} offset={1}>
                                <Form.Item>
                                    <Button type="primary" icon="search" onClick={() => dispatchInit()}>
                                        筛选
                                    </Button>
                                    <Button icon="undo" onClick={() => filterForm?.resetFields()} style={{ marginLeft: '10px' }} >
                                        重置
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </MapForm>
                </div>
            </div>
            <div style={{ padding: '22px' }}>
                <span>
                    <Checkbox
                        indeterminate={list.length !== selectedRowKeys.length && selectedRowKeys.length > 0}
                        onChange={handleSelectAll}
                        checked={selectedRowKeys.length > 0}
                    >
                        当页全选
                    </Checkbox>
                </span>
            </div>
            <Table
                className="global-table"
                loading={loading}
                rowSelection={rowSelection}
                columns={columns}
                pagination={false}
                dataSource={list}
                scroll={{ x: 1400 }} 
                rowKey={record => record.code.toString()}
            />
            <div className="global-pagination">
                <Pagination
                    current={currPage}
                    
                    onChange={(currPage: number) => setCurrPage(currPage)}
                    defaultPageSize={DEFAULT_PAGE_SIZE}
                    total={total}
                    showQuickJumper={true}
                />
                <span className="global-pagination-data">
                    共 {total} 条 ,每页 {DEFAULT_PAGE_SIZE} 条
                </span>
            </div>
            <GlobalModal
                modalVisible={modalVisible}
                title='添加回访记录'
                width={600}
                onCancel={() => setModalVisible(false)}
                onOk={()=> handleSource()}
                confirmLoading={loading}
            >
                <MapForm className="filter-form" layout="horizontal" onCreate={setAddFormList}>
                    <CstSelect
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        name="status"
                        label="回访状态"
                        defaultValue={'2'}
                        rules={[
                            {
                                required: true,
                                message: '线索来源不能为空',
                            },
                        ]}
                    >
                        {_.map(addKEFU_VISIT, (item,key) => (
                                <Select.Option key={key} value={key}>
                                    {item}
                                </Select.Option>
                        ))}
                    </CstSelect>
                    <CstInput
                        label="回访人员"
                        placeholder="请输入"
                        name="returnVisitPerson"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        defaultValue={realname}
                        disabled={true}
                        rules={[
                            {
                                required: true,
                                message: '回访人员不能为空',
                            },
                        ]}
                    />
                    <CstDatePicker 
                        label='回访时间'
                        placeholder='选择时间'
                        showTime={true}
                        name='returnVisitTime'
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        defaultValue={moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}
                        rules={[
                            {
                                required: true,
                                message: '回访时间不能为空',
                            },
                        ]}
                    />
                    <CstSelect
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        name="returnVisitWay"
                        label="回访方式"
                        placeholder="全部"
                        rules={[
                            {
                                required: true,
                                message: '回访方式不能为空',
                            },
                        ]}
                    >
                        {_.map(WAY_RETURN_ALL, (item,key) => (
                            <Select.Option key={key} value={key}>
                                {item}
                            </Select.Option>
                        ))}
                    </CstSelect>
                    <CstTextArea
                        label="回访内容"
                        placeholder="请输入内容"
                        name="context"
                        autoSize={{ minRows: 4, maxRows: 5 }}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        rules={[
                            {
                                required: true,
                                message: '回访内容不能为空',
                            },
                        ]}
                    />
                </MapForm>
            </GlobalModal>
            <GlobalModal
                modalVisible={souceVisible}
                title='添加线索'
                width={600}
                onCancel={() => setSouceVisible(false)}
                onOk={()=> addSource()}
                confirmLoading={loading}
            >
                <MapForm className="filter-form" layout="horizontal" onCreate={setAddForm}>
                    <CstInput
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        name="companyName"
                        label="客户名称"
                        placeholder="请输入"
                        rules={[
                            {
                                required: true,
                                message: '客户名称不能为空',
                            },
                        ]}
                    />
                    <CstInput
                        label="联系人姓名"
                        placeholder="请输入"
                        name="name"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        rules={[
                            {
                                required: true,
                                message: '联系人姓名不能为空',
                            },
                        ]}
                    />
                    <CstInput
                        label="手机号码"
                        placeholder="请输入"
                        name="telephone"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        rules={[
                            {
                                required: true,
                                message: '手机号码不能为空',
                            },
                            {
                                pattern: /^[0-9]*$/,
                                message: '手机格式有误',
                            },
                        ]}
                    />
                    <CstInput
                        label="邮箱"
                        placeholder="请输入"
                        name="email"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        rules={[
                            {
                                required: true,
                                message: '邮箱不能为空',
                            },
                            {
                                pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                                message: '邮箱格式有误',
                            },
                        ]}
                    />
                    <CstSelect
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        name="clueSource"
                        label="线索来源"
                        placeholder="全部"
                        rules={[
                            {
                                required: true,
                                message: '线索来源不能为空',
                            },
                        ]}
                    >
                        {_.map(SOURCE, (item, key) => (
                            <Select.Option key={key} value={key}>
                                {item}
                            </Select.Option>
                        ))}
                    </CstSelect>
                </MapForm>
            </GlobalModal>
        </div>
    )
};

export default connect(({ serviceInfo, user,  loading }: ConnectState) => ({
    list: serviceInfo.list,
    total: serviceInfo.total,
    loading: loading.effects['serviceInfo/fetchList'],
    realname: user.user.realname,
  }))(service);
