import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-19 10:49:40
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    orderId: 142141431 + index,
    merchantId: 10810902 + index,
    appCode: 100088011325 + index,
    bizType: 1,
    customerOrderNo: '2141432142',
    goodsCode: 1000000017 + index,
    goodsName: 'QQ音乐-付费音乐包1个月',
    rechargeAccount: null,
    buyNumber: 10,
    totalPay: 150000,
    payStatus: 1,
    payMethod: 1,
    status: 4,
    processStartTime: '2020-05-13T10:09:10.000+0000',
    completeTime: '2020-05-13T10:09:11.000+0000',
    processType: 1,
    workOrderNo: null,
    supplierCode: null,
    createTime: '2020-05-13T10:09:31.000+0000',
    modifyTime: '2020-05-13T10:09:35.000+0000',
    appInfo: null,
    orderDetailList: null,
  }));

export default {
  // 获取列表
  'POST /merchant/order/searchMerTradeOrderList': (req: Request, res: Response) => {
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
};
