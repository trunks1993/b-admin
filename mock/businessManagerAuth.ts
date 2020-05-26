/*
 * @Date: 2020-05-09 21:49:31
 * @LastEditTime: 2020-05-22 12:43:25
 */
import { Response, Request } from 'express';

const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    code: 11810881014385 + index,
    custId: 10003263 + index,
    merchantId: 10811113 + index,
    merchantName: '刘庆',
    telephone: '18611891120',
    identifyType: 2,
    status: 2,
    data:
      '{"realName":"刘庆","idCard":"431224198301082898","idCardFront":"/data/secret/identify/202005/6b1159d13dc44290bdb801e345ccf42e_288_1.jpg","idCardBack":"/data/secret/identify/202005/00937749a1f344c490b745df2b5787be_289_1.jpg"}',
    rejectText: '请填写真实姓名',
    rejectTime: '2020-05-16T07:40:20.000+0000',
    auditId: null,
    auditName: null,
    completeTime: null,
    createTime: '2020-05-15T23:38:00.000+0000',
    modifyTime: '2020-05-16T00:09:35.000+0000',
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /merchant/searchIdentifyWorkorder': (req: Request, res: Response) => {
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
  // 审批认证
  'POST /merchant/audit': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },
  // 查询详情
  'POST /merchant/getIdentifyWorkorder': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          id: 1,
          code: 11810881001321,
          custId: 10002722,
          merchantId: 10810902,
          merchantName: null,
          telephone: '13397527281',
          identifyType: 2,
          status: 1,
          data:
            '{"realName":"小戴","idCard":"11231231211","idCardFront":"/data/secret/identify/202005/99e640ebbd97495b9281dd04282a3300_49_1.png","idCardBack":"/data/secret/identify/202005/13597269b05f431a9d239d399736e5a5_50_1.png"}',
          rejectText: null,
          rejectTime: null,
          auditId: null,
          auditName: null,
          completeTime: null,
          remark: '测试',
          createTime: '2020-04-25T19:25:07.000+0000',
          modifyTime: '2020-05-11T06:58:04.000+0000',
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 1000);
  },
  // 删除
  'POST /merchant/batchDeleteIdentifyWorkorder': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },
};
