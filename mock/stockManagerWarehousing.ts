import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-22 02:15:48
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    code: index,
    supplierCode: 1,
    supplierName: '测试供应商',
    buynerType: null,
    bizType: 1,
    innerOrderId: 1,
    goodsCode: 1,
    reqUrl: '1',
    reqParam: '1',
    response: '1',
    reqMethod: '1',
    reqType: '1',
    orderId: '1',
    status: 8,
    retryTimes: 1,
    outerOrderStatus: '1',
    outerReturnCode: '1',
    outerReturnMessage: '1',
    processStartTime: '2020-05-20T07:33:23.000+0000',
    completeTime: '2020-05-20T07:33:27.000+0000',
    processType: 1,
    createTime: '2020-05-20T07:33:29.000+0000',
    modifyTime: '2020-05-20T07:33:32.000+0000',
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};
export default {
  // 获取列表
  'POST /goods/searchWorkorderList': (req: Request, res: Response) => {
    const { currPage, pageSize } = req.body;
    const list = data.slice((currPage - 1) * pageSize, currPage * pageSize);
    setTimeout(() => {
      res.send({
        result: {
          list: list,
          totalPage: 8,
          totalRecords: data.length,
          currPage: 1,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },

  // 新增
  'POST /goods/batchImportGoodsInventory': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 获取商品数量
  'POST /goods/checkStockInQuantity': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          count: 4,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 2000);
  },
};
