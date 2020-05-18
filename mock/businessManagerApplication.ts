/*
 * @Date: 2020-05-09 21:49:31
 * @LastEditTime: 2020-05-18 19:51:19
 */
import { Response, Request } from 'express';

const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    merchantId: 10816108 + index,
    code: 100088011326 + index,
    iconUrl: '/data/app/202005/8ee7dacd5c65469b814b325fb0d0efea_61_1.png',
    appKey: '5jJA1Ne0fS6X+xf1H15D8Q==',
    appSecret: '2dUNdNs013VucYNYGbxAK+JvLMYNcNX3nMKKSWATZBo=',
    appName: '11111',
    resume: '11111',
    industry: 100001 + index,
    nologinUrl: null,
    callbackUrl: ' https://xingjiaofei.com/api/v1.1.0/recharge',
    virtualRecharge: '',
    remark: '11111',
    status: 1,
    createTime: '2020-05-11T22:59:49.000+0000',
    modifyTime: '2020-05-11T23:48:17.000+0000',
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /application/searchApplication': (req: Request, res: Response) => {
    const { currPage, pageSize } = req.body;
    const list = data.slice((currPage - 1) * pageSize, currPage * pageSize);
    setTimeout(() => {
      res.send({
        result: {
          list,
          totalPage: 18,
          totalRecords: data.length,
          currPage: 1,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },

  // 详情
  'POST /application/getApplication': (req: Request, res: Response) => {
    const { currPage, pageSize } = req.body;
    const list = data.slice((currPage - 1) * pageSize, currPage * pageSize);
    setTimeout(() => {
      res.send({
        result: {
          id: 1,
          merchantId: 10810902,
          code: 100088011325,
          iconUrl: '/data/app/202005/fde9980391ef4c08a68fcd153e1665bb_36_1.png',
          appKey: 'R26pPsSJhjRUILnZjN344g==',
          appSecret: null,
          appName: '小戴啊',
          resume: '小戴Test',
          industry: 100001,
          nologinUrl: 123,
          callbackUrl: 123,
          virtualRecharge: 123,
          remark:
            '啊色大叔阿松大阿三啊asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
          status: 1,
          createTime: '2020-05-08T18:34:13.000+0000',
          modifyTime: '2020-05-13T07:03:17.000+0000',
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },

  // 删除
  'POST /application/disableApplication': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  //修改
  'POST /application/modifyApplication': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 新增
  'POST /application/addApplication': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
};
