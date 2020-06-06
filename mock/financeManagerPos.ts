import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-06-04 20:22:45
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    merchantId: 10823626 + index,
    accountNo: 10064972 + index,
    type: 1,
    amount: 0,
    frozeAmount: 0,
    doorsillAmount: 0,
    status: 1,
    createTime: '2020-05-18T01:45:28.000+0000',
    modifyTime: '2020-05-18T01:45:28.000+0000',
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /merchant/searchMerchantAccount': (req: Request, res: Response) => {
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
  'POST /merchant/adjustBalance': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
};
