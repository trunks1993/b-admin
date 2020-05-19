import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-20 00:31:52
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    code: 1180000010000013800 + index,
    accountNo: 10054441 + index,
    destAccountNo: '10000000',
    type: 1,
    changeAmount: 237120000,
    amount: 11185600000,
    bizType: 3,
    orderNo: '118100237467',
    remark: null,
    createTime: '2020-04-16T00:51:02.000+0000',
    modifyTime: '2020-04-16T00:51:02.000+0000',
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};
export default {
  // 获取列表
  'POST /merchant/searchMerchantAccountTrace': (req: Request, res: Response) => {
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
