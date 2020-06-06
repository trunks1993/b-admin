import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/group';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from '@/const';
import { remove } from '../services/management';
import Styles from './index.css';

import { queryListSub, EditeItemSubType } from '../services/management';
import ExpandForm from './components/ExpandForm';
import _ from 'lodash';
import { guid } from '@/utils';
import router from 'umi/router';
import moment from 'moment';

const { confirm } = Modal;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

export interface ListItemSubType extends ListItemType {
  facePrice: number | string;
  shortName: string;
  productCode: number;
}

interface ExpandedRowType {
  code: string;
  loading: boolean;
  list: ListItemSubType[];
  addFormList?: EditeItemSubType[];
}

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  // 表格展开
  const [expandedRows, setExpandedRows] = useState<ExpandedRowType[]>([]);

  useEffect(() => {
    initList();
  }, [currPage]);

  /**
   * @name: 列表加载
   */
  const initList = () => {
    dispatch({
      type: 'productManagement/fetchList',
      queryParams: {
        currPage,
        pageSize,
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

  /**
   * @name: 删除
   * @param {number} id
   */
  const showConfirm = (id: number) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(id);
        if (!err) message.success('删除成功，即将刷新');
        else message.error(msg);
        dispatchInit();
      },
      onCancel() {},
    });
  };

  /**
   * @name: 加载子产品列表
   * @param {type}
   */
  const loadSubList = async (productCode: number, isAdd?: boolean) => {
    const code = productCode.toString();

    const isExpande = _.findIndex(expandedRows, item => item.code === code.toString()) > -1;

    const formData = {
      productCode,
      uuid: guid(),
      name: '',
      shortName: '',
      facePrice: '',
    };

    let newExpandedRows;
    // 如果已经展开 说明table该行已经加载过子列表
    // 将对应的loading设为true
    // 否则新增一个对应数据
    if (isExpande) {
      newExpandedRows = _.map(expandedRows, item => {
        if (item.code === code) {
          if (isAdd) item.addFormList?.push(formData);
          else item.loading = true;
        }
        return item;
      });
    } else {
      newExpandedRows = [
        ...expandedRows,
        { code, loading: true, list: [], addFormList: isAdd ? [formData] : [] },
      ];
    }
    setExpandedRows(newExpandedRows);

    if (isAdd && isExpande) return;

    const [err, data, msg] = await queryListSub(productCode);
    if (!err) {
      newExpandedRows = newExpandedRows.map(item => {
        if (item.code === code) {
          item.list = data;
          item.loading = false;
        }
        return item;
      });
      setExpandedRows(newExpandedRows);
    }
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '产品名称',
      align: 'left',
      key: 'name',
      width: 200,
      // ellipsis: true,
      render: record => {
        const code = record.code.toString();
        const hasLoaded = expandedRows.find(item => item.code === code && !item.loading);
        const hasKey = expandedRows.find(item => item.code === code);
        return (
          <span className={Styles.tdProductName}>
            <img
              width="30px"
              height="30px"
              style={{ marginRight: '5px' }}
              src={process.env.BASE_FILE_SERVER + record.iconUrl}
            />
            {record.name}
            {!hasLoaded && hasKey ? (
              <Icon type="loading" />
            ) : (
              <Icon
                style={{ transform: 'scale(0.8)' }}
                type={hasKey ? 'up' : 'down'}
                onClick={() => {
                  if (!hasKey) {
                    loadSubList(record.code);
                  } else {
                    setExpandedRows(expandedRows.filter(item => item.code !== code));
                  }
                }}
              />
            )}
          </span>
        );
      },
    },
    {
      title: '所属品牌',
      align: 'center',
      width: 150,
      ellipsis: true,
      dataIndex: 'brandName',
    },
    {
      title: '面值（元）/规格',
      align: 'center',
      width: 100,
      render: () => '--',
    },
    {
      title: '创建时间',
      align: 'center',
      width: 200,
      render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          <Button type="link" onClick={() => loadSubList(record.code, true)}>
            +子产品
          </Button>
          <Button
            type="link"
            onClick={() => router.push(`/product/manager/management/${record.id}`)}
          >
            编辑
          </Button>
          <Button type="link" onClick={() => showConfirm(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={Styles.container}>
      <div className={Styles.toolbar}>
        <Button
          type="link"
          icon="plus"
          onClick={() => router.push(`/product/manager/management/-1`)}
        >
          新增产品
        </Button>
      </div>
      <Table
        className="global-table"
        loading={loading}
        columns={columns}
        pagination={false}
        dataSource={list}
        rowKey={record => record.code.toString()}
        expandedRowRender={record => {
          const { list, addFormList } =
          expandedRows.find(item => item.code === record.code.toString()) || {};
          console.log("list", list)
          return (
            <ExpandForm
              reload={loadSubList.bind(null, record.code)}
              brandName={record.brandName}
              dataSource={list}
              addFormList={addFormList}
              handleAddInputChange={(value: string, index: number, key: string) => {
                const newExpandedRows = expandedRows.map(item => {
                  if (item.code === record.code.toString() && item.addFormList) {
                    item.addFormList[index][key] = value;
                  }
                  return item;
                });
                setExpandedRows(newExpandedRows);
              }}
              removeFormItem={async (index: number) => {
                let newExpandedRows = expandedRows.map(item => {
                  if (item.code === record.code.toString() && item.addFormList) {
                    item.addFormList.splice(index, 1);
                  }
                  return item;
                });
                setExpandedRows(newExpandedRows);
              }}
            />
          );
        }}
        expandedRowKeys={expandedRows.filter(item => !item.loading).map(item => item.code)}
        expandIcon={() => null}
      />
      <div className="global-pagination">
        <Pagination
          current={currPage}
          onChange={(currPage: number) => setCurrPage(currPage)}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          total={total}
          showQuickJumper
        />
        <span className="global-pagination-data">
          共 {total} 条 ,每页 {DEFAULT_PAGE_SIZE} 条
        </span>
      </div>
    </div>
  );
};

export default connect(({ productManagement, loading }: ConnectState) => ({
  list: productManagement.list,
  total: productManagement.total,
  loading: loading.effects['productManagement/fetchList'],
}))(Comp);
