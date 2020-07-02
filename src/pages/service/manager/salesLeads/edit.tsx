import React, {useEffect, useState} from 'react';
import Styles from './index.css';
import { Icon, Descriptions, Timeline, message, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { ListItemType } from '../models/salesLeads';
import { TableListData } from '@/pages/data';
import moment from 'moment';

import { Dispatch, AnyAction } from 'redux';
import { ConnectState } from '@/models/connect';
import MapForm from '@/components/MapFormComponent';
import { connect } from 'dva';
import GlobalModal from '@/components/GlobalModal';
import { KEFU_VISIT, WAY_RETURN_ALL } from '@/const';

const { CstInput, CstSelect, CstTextArea, CstDatePicker } = MapForm;
import { addReturnVisitRecord, addReturnVisitRecordParamsType } from '../services/salesLeads';

interface ServiceProps extends TableListData<ListItemType>{
    dispatch: Dispatch<AnyAction>;
    loading: boolean;
    id:string;
    detaillist:ListItemType;
    realname:string;
}

const Comp: React.FC<ServiceProps>=({ dispatch, detaillist, id, realname }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [addFormList, setAddFormList] = React.useState<FormComponentProps['form'] | null>(null);
    useEffect(() => {
        if (id) initList();
    }, []);
    
    /**
     * @name: 列表加载
     */
    const initList = () => {
        const params = {cluesCode:id}
        dispatch({
            type: 'serviceInfo/fetchListDetail',
            queryParams: {
                ...params,
            },
        });
    };

    /** 添加回访记录 */
    const handleSource = () => {
        addFormList?.validateFields(async (error, value: addReturnVisitRecordParamsType) => {
            if (error) return;
            const params = {...value,cluesCode:detaillist.code};
            const [err, data, msg] = await addReturnVisitRecord(params);
            if (!err) {
              setModalVisible(false);
              initList();
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
                <div onClick={()=>setModalVisible(true)}><Icon type="plus" />添加回访记录</div>
            </div>
            <div className={'kehufilter'}>
                <div className={Styles.filter} style={{ paddingTop:20 }}>
                    <div className={Styles.descTitle}>客户信息</div>
                    <Descriptions bordered={true} column={{ md: 2}}>
                        <Descriptions.Item label="手机号码">{detaillist?.telephone}</Descriptions.Item>
                        <Descriptions.Item label="回访状态">{KEFU_VISIT[detaillist?.status]}</Descriptions.Item>
                        <Descriptions.Item label="联系人">{detaillist?.name}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{detaillist?.createTime && moment(detaillist?.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="公司名称">{detaillist?.companyName}</Descriptions.Item>
                        <Descriptions.Item label="最后回访时间">{detaillist?.custReturnVisitRecords?.[0]?.returnVisitTime && moment(detaillist?.custReturnVisitRecords?.[0]?.returnVisitTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="邮箱">{detaillist?.email}</Descriptions.Item>
                        <Descriptions.Item label="最后回访人员">{detaillist?.custReturnVisitRecords?.[0]?.returnVisitPerson}</Descriptions.Item>
                        <Descriptions.Item label="线索来源">{detaillist?.clueSource}</Descriptions.Item>
                        <Descriptions.Item label={<div style={{ width:12,height:2,backgroundColor:'black',margin:'0 auto' }} />}>{detaillist?.unknow}</Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
            <div className={Styles.desc} >
                <div className={Styles.descTitle}>回访动态</div>
                <Timeline>
                    {
                        _.map(detaillist?.custReturnVisitRecords, (item)=> (
                            <Timeline.Item>
                                <div className={Styles.descBox}>
                                    <div className={Styles.context} >
                                        <Descriptions  column={6}>
                                            <Descriptions.Item label="回访人员">{item?.returnVisitPerson}</Descriptions.Item>
                                            <Descriptions.Item label="回访状态">{KEFU_VISIT[item?.status]}</Descriptions.Item>
                                            <Descriptions.Item label="回访方式"> {item?.returnVisitWay} </Descriptions.Item>
                                            <Descriptions.Item label="回访时间" span={2}>{item?.returnVisitTime && moment(item?.returnVisitTime).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions>
                                            <Descriptions.Item label="回访内容">{item?.context}</Descriptions.Item>
                                        </Descriptions>
                                    </div>
                                </div>
                            </Timeline.Item>
                        ))
                    }
                </Timeline>
            </div>
            <GlobalModal
                modalVisible={modalVisible}
                title='添加回访记录'
                width={600}
                onCancel={() => setModalVisible(false)}
                onOk={()=> handleSource()}
            >
                <MapForm className="filter-form" layout="horizontal" onCreate={setAddFormList}>
                    <CstSelect
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 12 }}
                        name="status"
                        label="回访状态"
                        placeholder="全部"
                        defaultValue={'2'}
                        rules={[
                            {
                                required: true,
                                message: '线索来源不能为空',
                            },
                        ]}
                    >
                        {_.map(KEFU_VISIT, (item,key) => (
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
                        style={{paddingBottom:60}}
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
        </div>
    )
};
export default connect(({ serviceInfo, user, routing }: ConnectState) => ({
    detaillist: serviceInfo.detaillist,
    id: routing.location.query.id,
    realname: user.user.realname,
  }))(Comp);
