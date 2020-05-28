import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Tree, Table, Pagination, Col, Row, Form, Button, Checkbox } from 'antd';
import { queryList } from '@/pages/product/manager/services/group';
import { ListItemType } from '@/pages/product/manager/models/group';
import Styles from './index.css';
import {
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  StockStatus,
  TRANSTEMP,
  ProductStatusGU,
} from '@/const';
import { TableListData } from '@/pages/data';
import { Dispatch, AnyAction } from 'redux';
import { ColumnProps } from 'antd/lib/table/interface';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { FormComponentProps } from 'antd/es/form';

import MapForm from '@/components/MapFormComponent';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import _ from 'lodash';
import { getFloat } from '@/utils';
const { CstInput, CstCheckbox, CstSelect, CstPassword } = MapForm;

const { TreeNode } = Tree;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const Comp: React.FC<CompProps> = props => {
  const { dispatch, list, total, loading, myForwardedRef } = props;
  const [treeData, setTreeData] = useState<ListItemType[]>([]);
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(5);
  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    // setSelectedRowKeys([]);
    initList();
  }, [currPage]);

  useEffect(() => {
    initTreeData();
  }, []);

  useImperativeHandle(myForwardedRef, () => ({
    getSelectedGoods: () => {
      return _.map(selectedRowKeys, item => {
        const {
          productSubName,
          code,
          productTypeCode,
          productSub: { facePrice, shortName },
        } = JSON.parse(item);
        return {
          productName: productSubName,
          goodsCode: code,
          productTypeCode,
          facePrice,
          shortName,
        };
      });
    },
  }));

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    dispatch({
      type: 'productManagerList/fetchList',
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

  /**
   * @name: 请求分组数组
   * @param {type}
   */
  const initTreeData = async () => {
    const [err, data, msg] = await queryList({});
    if (!err) {
      setTreeData(data.list);
    }
  };

  /**
   * @name: 渲染树
   * @param {type}
   */
  const renderTreeNodes = (data: ListItemType[]) =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id.toString()} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.code.toString()} />;
    });

  /**
   * @name: 分组checkbox
   * @param {type}
   */
  const handleCheck = (categoryCodes: string[]) => {
    filterForm?.setFieldsValue({
      categoryCodes,
    });
    fetch();
  };

  let timeout: any;
  const fetch = async () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => dispatchInit(() => setSelectedRowKeys([])), 500);
  };

  // /**
  //  * @name: checkbox onChange 事件
  //  * @param {CheckboxChangeEvent} e
  //  */
  // const handleSelectAll = (e: CheckboxChangeEvent) => {
  //   const checked = e.target.checked;
  //   const keys = _.map(list, item => item.id.toString());
  //   const selections =
  //     (selectedRowKeys.length > 0 || checked) && selectedRowKeys.length !== keys.length ? keys : [];
  //   setSelectedRowKeys(selections);
  // };

  const rowSelection = {
    selectedRowKeys,
    hideDefaultSelections: true,
    onChange: (selectedRowKeys: string[] | number[], selectedRows: ListItemType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '商品名称',
      align: 'center',
      key: 'id',
      render: record => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img width="30" height="30" src={process.env.BASE_FILE_SERVER + record.iconUrl} />
          <span>{record.productSub.name}</span>
        </div>
      ),
    },
    {
      title: '状态',
      align: 'center',
      render: record => ProductStatusGU[record.status],
    },
    {
      title: '库存数量（件）',
      align: 'center',
      render: record => record.stock - record.lockedStock,
    },
    {
      title: '面值/规格',
      align: 'center',
      render: record =>
        getFloat(record.productSub.facePrice / TRANSTEMP, 4) + '/' + record.productSub.shortName,
    },
  ];

  return (
    <div className={Styles.box}>
      <div className={Styles.tree}>
        <Tree
          checkable
          // onExpand={this.onExpand}
          // expandedKeys={this.state.expandedKeys}
          // autoExpandParent={this.state.autoExpandParent}
          onCheck={handleCheck}
          // checkedKeys={this.state.checkedKeys}
          // onSelect={handleSelect}
          // selectedKeys={selectedKeys}
        >
          {renderTreeNodes(treeData)}
        </Tree>
      </div>
      <div className={Styles.table}>
        <div className={Styles.filter}>
          <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
            <CstInput name="categoryCodes" style={{ display: 'none' }} />
            <Row>
              <Col span={6}></Col>
              <Col span={2}></Col>
              <Col span={6}>
                <CstCheckbox
                  name="hasStock"
                  title="仅显示有库存"
                  keyMap={['Y', 'N']}
                  onChange={fetch}
                />
              </Col>
              <Col span={10}>
                <CstInput
                  name="name"
                  // labelCol={{ span: 8 }}
                  // wrapperCol={{ span: 16 }}
                  onChange={fetch}
                  placeholder="输入搜索关键词"
                />
              </Col>
            </Row>
          </MapForm>
        </div>
        <Table
          className="global-table"
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          pagination={false}
          dataSource={list}
          rowKey={record => JSON.stringify(record)}
        />
        {/* <div style={{ paddingLeft: '22px', marginTop: '10px' }}>
          <Checkbox
            // indeterminate={list.length !== selectedRowKeys.length && selectedRowKeys.length > 0}
            onChange={handleSelectAll}
            checked={selectedRowKeys.length > 0}
          >
            当页全选
          </Checkbox>
        </div> */}
        <div className="global-pagination">
          <Pagination
            current={currPage}
            onChange={(currPage: number) => setCurrPage(currPage)}
            defaultPageSize={DEFAULT_PAGE_SIZE}
            total={total}
            // showQuickJumper
          />
          {/* <span className="global-pagination-data">
            共 {total} 条 ,每页 {pageSize} 条
          </span> */}
        </div>
      </div>
    </div>
  );
};

const C = connect(
  ({ productManagerList, loading }: ConnectState) => ({
    list: productManagerList.list,
    total: productManagerList.total,
    loading: loading.effects['productManagerList/fetchList'],
  }),
  null,
  null,
  { withRef: true },
)(Comp);

export default React.forwardRef((props, ref) => <C {...props} myForwardedRef={ref} />);
