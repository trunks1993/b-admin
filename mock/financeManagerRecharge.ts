import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-20 13:56:48
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    code: 11810881055141 + index,
    custId: 10003263 + index,
    merchantId: 10811113,
    bizType: 1,
    rechargeChannel: 101,
    amount: 68000000,
    balance: -3140496000,
    rechargeChannelName: '工商1232132',
    status: 1,
    receiptUrl: '/data/brand/202004/c8896fbb23c74751b36bb1618052abaa_7_1.png',
    accountNo: 123156456,
    auditId: null,
    auditName: null,
    completeTime: '2020-05-18T07:13:39.000+0000',
    createTime: '2020-05-18T07:13:39.000+0000',
    modifyTime: '2020-05-18T07:13:39.000+0000',
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};
export default {
  // 获取列表
  'POST /merchant/bankroll/searchRechargeWorkorderList': (req: Request, res: Response) => {
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
  // 修改
  'POST /merchant/bankroll/modifyRechargeWorkorder': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 0);
  },
};
