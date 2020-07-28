import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/log';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from '@/const';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import moment from 'moment';
const { CstInput } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);

  useEffect(() => {
    initList();
  }, [currPage]);

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    dispatch({
      type: 'sysManagerLog/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
      },
    });
  };

  /**
   * @name: 触发列表加载effect
   * @param {type}
   */
  const dispatchInit = (callback?: () => void) => {
    callback && callback();
    currPage === 1 ? initList() : setCurrPage(1);
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '操作时间',
      align: 'center',
      key: 'id',
    //   width: 250,
      render: record =>
        record.createTime && moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作人',
      dataIndex: 'operateName',
    //   width: 150,
      align: 'center',
    },
    {
      title: '操作模块',
      dataIndex: 'moudleName',
    //   width: 150,
      align: 'center',
    },
    {
      title: '操作内容',
      width: 500,
      align: 'center',
      dataIndex: 'content',
    },
  ];

  return (
    <div className={Styles.container}>
      <div className={Styles.filter}>
        <div className={Styles.filterBox}>
          <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
            <Row>
              <Col span={8}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="operateName"
                  label="操作人"
                  placeholder="输入操作人"
                />
              </Col>
              <Col span={8}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="moudle"
                  label="操作模块"
                  placeholder="输入操作模块"
                />
              </Col>
              <Col span={6} offset={2}>
                <Form.Item>
                  <Button type="primary" icon="search" onClick={() => dispatchInit()}>
                    筛选
                  </Button>
                  <Button
                    icon="undo"
                    style={{ marginLeft: '10px' }}
                    onClick={() => filterForm?.resetFields()}
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
        columns={columns}
        pagination={false}
        dataSource={list}
        rowKey={record => record.id.toString()}
      />
      <div className="global-pagination">
        <Pagination
          current={currPage}
          onChange={(currPage: number) => setCurrPage(currPage)}
          defaultPageSize={pageSize}
          total={total}
          showQuickJumper={true}
        />
        <span className="global-pagination-data">
          共 {total} 条 ,每页 {pageSize} 条
        </span>
      </div>
    </div>
  );
};

export default connect(({ sysManagerLog, loading }: ConnectState) => ({
  list: sysManagerLog.list,
  total: sysManagerLog.total,
  loading: loading.effects['sysManagerLog/fetchList'],
}))(Comp);
