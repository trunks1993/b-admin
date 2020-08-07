import React, { useEffect, useState } from 'react';
import Styles from './index.css';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { TableListData } from '@/pages/data';

import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ColumnProps } from 'antd/lib/table/interface';
import _ from 'lodash';

import { ListItemType as CategoryItemType } from '@/pages/product/manager/models/group';
import { ListItemType } from '@/models/product';

import { connect } from 'dva';
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, StockStatus, StockType } from '@/const';
import MapForm from '@/components/MapFormComponent';
import { Row, Col, Select, Form, Button, Table, Radio, message, Pagination, Checkbox, Switch, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';

import GlobalModal from '@/components/GlobalModal';
import { queryList as queryGroupList } from '@/pages/product/manager/services/group';


import { EditeItemType, setStockList, setStockRule, setButtonType, getButtonType, setStockLists } from '../services/earlyWarn';
const { CstInput, CstSelect, CstSwitch, CstRadio } = MapForm;
interface WarnProps extends TableListData<ListItemType> {
    dispatch: Dispatch<AnyAction>;
    loading: boolean;
}

const earlyWarn: React.FC<WarnProps> = ({ dispatch, list, total, loading }) => {
    const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
    const [categoryList, setCategoryList] = useState<CategoryItemType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [CloseModalRemind, setCloseModalRemind] = useState(false);
    const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
    const [code, setCode] = useState<string | []>('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
    const [butType, setButType] = useState<boolean>(true);
    const [FormCode, setFormCode] = useState<EditeItemType>({});
    const [formCodeList, setFormCodeList] = useState<EditeItemType>({});

    useEffect(() => {
        /** 页面初始化的时候调用一次getCategoryList 获取商品分组 */
        getCategoryList();
        initList();
        getButtonTypes();
    }, []);

    useEffect(() => {
        initList();
        setSelectedRowKeys([]);
    }, [currPage]);

    useEffect(() => {
        if (FormCode) {
            const { setType, lowerLimit, upLimit, leastDay, mostDay } = FormCode;
            if (FormCode !== '' && setType == 1) {
                form?.setFieldsValue({
                    setType,
                    lowerLimit,
                    upLimit
                });
            } else if (FormCode !== '' && setType == 2) {
                form?.setFieldsValue({
                    setType,
                    leastDay,
                    mostDay
                });
            }
        }
    }, [form])

    useEffect(() => {
        if (formCodeList?.forewarnCode) {
            setStockRoles();
        }
    }, [formCodeList])

    /**
     * @name: 获取商品分组
     */
    const getCategoryList = async () => {
        const [err, data] = await queryGroupList({});
        if (!err) setCategoryList(data.list);
    };

    /**
     * @name 触发列表加载effect
     * @param {type}
     */
    const dispatchInit = (callback?: () => void) => {
        callback && callback();
        currPage === 1 ? initList() : setCurrPage(1);
    }

    /**
     * @name 获取预警按钮状态
     */
    const getButtonTypes = async () => {
        const [err, data, msg] = await getButtonType();
        if (!err) {
            setButType(data == 'ON' ? true : false)
            return true;
        } else {
            message.error(msg);
            return false;
        }
    }

    /**
     * @name 设置预警值
     */
    const setWarnVal = () => {
        form?.validateFields(async (error, value: EditeItemType) => {
            if (error) return;
            const params = { ...value, goodsCode: code, goodsCodes: selectedRowKeys };
            let [err, data, msg] = '';
            if (typeof code === 'object') {
                console.log(1);
                /** 全选 */
                [err, data, msg] = await setStockLists(params);
            } else {
                console.log(2);
                /** 单选 */
                [err, data, msg] = await setStockList(params);
            }
            setCode('');
            if (!err) {
                setModalVisible(false);
                initList();
                return true;
            } else {
                message.error(msg);
                return false;
            }
        });
    }

    /**
     * @name 批量设置库存规则
     */
    const setStockRoles = async () => {
        const params = { forewarnCode: formCodeList?.forewarnCode, status: formCodeList?.status == '1' ? '2' : '1' }
        const [err, , msg] = await setStockRule(params);
        initList();
        if (!err) {
            return true;
        } else {
            message.error(msg);
            return false;
        }
    }

    /**
     * @name: 列表加载
     */
    const initList = () => {
        const data = filterForm?.getFieldsValue();
        dispatch({
            type: 'stockEarlyWarn/fetchList',
            queryParams: {
                currPage,
                pageSize,
                ...data,
                productTypeCodes: [101, 102, 103],
            },
        });
    };

    /** 编辑按钮 */
    const editList = (record: any) => {
        setCode(record.code);
        setFormCode(record.goodsInventoryForewarn);
        setModalVisible(true);
    }

    /** 预警开关修改状态 */
    const showDeleteConfirm = (record: any) => {
        Modal.confirm({
            title: '提示',
            content: '您确认关闭该商品的库存预警吗?',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                return setFormCodeList(record.goodsInventoryForewarn);
            },
        });
    }

    /** 表头 */
    const columns: ColumnProps<ListItemType>[] = [
        {
            title: '商品名称',
            align: 'center',
            width: 260,
            key: 'id',
            render: record => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                    <img width="30" height="30" src={process.env.BASE_FILE_SERVER + record.iconUrl} />
                    <span style={{ textAlign: 'left' }}>
                        <div style={{ marginLeft: '5px' }}>{record?.productSub?.name}</div>
                        <div style={{ marginLeft: '5px' }}>{record.code}</div>
                    </span>
                </div>
            ),
        },
        {
            title: '预警状态',
            align: 'center',
            render: record => StockStatus[record.stockStatus],
        },
        {
            title: '总库存(件)',
            align: 'center',
            dataIndex: 'stock',
        },
        {
            title: '预警类型',
            align: 'center',
            render: record => StockType[record?.goodsInventoryForewarn?.setType],
        },
        {
            title: '库存下限(件/天)',
            align: 'center',
            render: record => {
                if (record?.goodsInventoryForewarn?.setType == 2) {
                    return record?.goodsInventoryForewarn?.leastDay
                }
                return record?.goodsInventoryForewarn?.lowerLimit
            }
        },
        {
            title: '库存上限(件/天)',
            align: 'center',
            render: record => {
                if (record?.goodsInventoryForewarn?.setType == 2) {
                    return record?.goodsInventoryForewarn?.mostDay
                }
                return record?.goodsInventoryForewarn?.upLimit
            }
        },
        {
            title: '操作',
            align: 'center',
            render: record => (
                <>
                    <Button type="link" onClick={() => { setCode(''); editList(record) }}>
                        编辑
                </Button>
                    {
                        record?.goodsInventoryForewarn?.status == 1 ? (
                            <Switch checked={true} checkedChildren="开" onClick={() => { showDeleteConfirm(record) }} />
                        ) : (
                                <Switch checked={false} unCheckedChildren="关" onClick={() => { setFormCodeList(record.goodsInventoryForewarn); }} />
                            )
                    }
                </>
            ),
        },
    ];

    /** table的多选框 */
    const rowSelection = {
        selectedRowKeys,
        hideDefaultSelections: true,
        onChange: (selectedRowKeys: string[] | number[], selectedRows: ListItemType[]) => {
            setSelectedRowKeys(selectedRowKeys);
            setCode(selectedRowKeys);
        },
    };

    /** 预警库存预警总开关 */
    const modifyBut = (e: boolean) => {
        if (!e) {
            Modal.confirm({
                title: '提示',
                content: '您确认关闭库存预警总开关吗?',
                okText: '确定',
                cancelText: '取消',
                onOk: async () => {
                    modifyAllBut(e);
                },
            });
        } else {
            modifyAllBut(e);
        }
    }

    /** 库存预警总开关修改状态 */
    const modifyAllBut = async (e: boolean) => {
        const params = { value: e ? 'ON' : 'OFF' }
        const [err, , msg] = await setButtonType(params);
        if (!err) {
            setButType(e)
            return true;
        } else {
            message.error(msg);
            return false;
        }
    }

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

    return (
        <div className={Styles.container}>
            <div className={Styles.toolbar}>
                <div>库存预警</div>
            </div>
            <div className={Styles.filter}>
                <div className={Styles.filterBox}>
                    <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
                        <Row>
                            <Col span={6}>
                                <CstInput
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    name="goods"
                                    label="商品筛选"
                                    placeholder="输入商品名称/编码"
                                />
                            </Col>
                            <Col span={6}>
                                <CstSelect
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    name="categoryCode"
                                    label="商品分组"
                                    placeholder="全部"
                                >
                                    {_.map(categoryList, (item, key) => (
                                        <Select.Option key={key} value={item.code}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </CstSelect>
                            </Col>
                            <Col span={6}>
                                <CstSelect
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    name="stockStatus"
                                    label="预警状态"
                                    placeholder="全部"
                                >
                                    {_.map(StockStatus, (_, key) => (
                                        <Select.Option key={key} value={key}>
                                            {StockStatus[key]}
                                        </Select.Option>
                                    ))}
                                </CstSelect>
                            </Col>
                            <Col span={5} offset={1}>
                                <CstSwitch
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    name="but"
                                    label="预警总开关"
                                    checkedChildren="开"
                                    unCheckedChildren="关"
                                    checked={butType}
                                    onChange={modifyBut}
                                />
                            </Col>
                            <Col span={5} offset={2}>
                                <Form.Item>
                                    <Button type="primary" icon="search" onClick={() => dispatchInit()}>
                                        筛选
                                    </Button>
                                    <Button
                                        icon="undo"
                                        onClick={() => filterForm?.resetFields()}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        重置
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </MapForm>
                </div>
            </div>
            <Table
                className="global-table"
                loading={loading}
                rowSelection={rowSelection}
                columns={columns}
                pagination={false}
                dataSource={list}
                rowKey={record => record.code.toString()}
            />
            <Row>
                <Col span={5}>
                    <div style={{ padding: '22px' }}>
                        <span>
                            <Checkbox
                                indeterminate={list.length !== selectedRowKeys.length && selectedRowKeys.length > 0}
                                onChange={handleSelectAll}
                                checked={selectedRowKeys.length > 0}
                            >
                                当页全选
                            </Checkbox>
                            <span className={Styles.batchSet} onClick={() => { setModalVisible(true) }}>
                                批量设置
                            </span>
                        </span>
                    </div>
                </Col>
                <Col span={19}>
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
                </Col>
            </Row>
            <GlobalModal
                modalVisible={modalVisible}
                title='设置预警值'
                onCancel={() => {
                    setModalVisible(false); setCode(''); setFormCode({});
                }}
                onOk={setWarnVal}
                confirmLoading={loading}
            >
                <MapForm className="global-form" onCreate={setForm}>
                    <div style={{ width: 400, margin: '0 auto' }}>
                        <CstRadio name="setType" defaultValue={1} >
                            <Radio value={1} style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 16 }}>固定预警 </Radio>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={12}>
                                    <CstInput
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                        name="lowerLimit"
                                        label="库存下限"
                                    />
                                </Col>
                                <Col span={12}>
                                    <CstInput
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                        name="upLimit"
                                        label="库存上限"
                                    />
                                </Col>
                            </Row>
                            <Radio value={2} style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 16 }}>动态预警 </Radio>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={14}>
                                    <CstInput
                                        name="leastDay"
                                        labelCol={{ span: 17 }}
                                        wrapperCol={{ span: 6 }}
                                        label="库存下限: 最少可售"
                                    />
                                </Col>
                                <Col span={10} style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 16, marginTop: 7 }}>天 * 近15天日均销量</Col>
                            </Row>
                            <Row>
                                <Col span={14}>
                                    <CstInput
                                        name="mostDay"
                                        labelCol={{ span: 17 }}
                                        wrapperCol={{ span: 6 }}
                                        label="库存上限: 最多可售"
                                    />
                                </Col>
                                <Col span={10} style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 16, marginTop: 7 }}>天 * 近15天日均销量</Col>
                            </Row>
                        </CstRadio>
                    </div>
                </MapForm>
            </GlobalModal>
            <GlobalModal
                modalVisible={CloseModalRemind}
                title='关闭提示'
                width={360}
                onCancel={() => {
                    setCloseModalRemind(false);
                }}
                onOk={() => { setFormCodeList(FormCode); setCloseModalRemind(false); }}
                confirmLoading={loading}
            >
                <div>您确认关闭该商品的库存预警吗?</div>
            </GlobalModal>
        </div >
    )
};

export default connect(({ stockEarlyWarn, loading }: ConnectState) => ({
    list: stockEarlyWarn.list,
    total: stockEarlyWarn.total,
    loading: loading.effects['stockEarlyWarn/fetchList'],
}))(earlyWarn)
