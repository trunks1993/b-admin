import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-22 11:01:18
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    code: index,
    goodsCode: 1,
    goodsName: '1',
    type: 1,
    amount: 1,
    surplus: 1,
    orderNo: '1',
    operId: 1,
    operName: '1',
    createTime: '2020-05-21T14:27:34.000+0000',
    modifyTime: '2020-05-21T14:27:36.000+0000',
  }));
export default {
  // 获取列表
  'POST /goods/stock/searchGoodsStockTraceList': (req: Request, res: Response) => {
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
