import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-20 21:57:24
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    code: 10000001 + index,
    modifyTime: '2020-03-21 17:03:31',
    createTime: '2020-03-21 17:03:28',
    name: '福禄',
    status: 1,
    id: index,
    mainTelephone: '1324143143',
    mainContactName: '1112143',
    minorContactName: '24314',
    minorTelephone: '142341431',
    amount: 12312,
    address: '测试地址',
    accountNo: 123213,
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};
export default {
  // 获取列表
  'POST /supplier/searchSupplierList': (req: Request, res: Response) => {
    const { currPage, pageSize } = req.body;
    const list = !pageSize ? data : data.slice((currPage - 1) * pageSize, currPage * pageSize);
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
    }, 1000);
  },

  // 删除
  'POST /supplier/deleteSupplier': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 修改
  'POST /supplier/modifySupplier': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 新增
  'POST /supplier/addSupplier': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 批量修改
  'POST /supplier/batchModifyStatus': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 批量修改余额
  'POST /supplier/batchModifyAmount': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },
};
