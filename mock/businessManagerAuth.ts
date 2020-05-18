/*
 * @Date: 2020-05-09 21:49:31
 * @LastEditTime: 2020-05-16 17:40:17
 */
import { Response, Request } from 'express';

const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    code: 1000000017 + index,
    productSubCode: 100000021 + index,
    productSubName: 'QQ音乐-付费音乐包1个月',
    productCode: 100024 + index,
    productName: 'QQ音乐-付费音乐包',
    brandCode: 10066,
    brandName: 'QQ音乐',
    productTypeCode: 104,
    price: 78400,
    iconUrl: null,
    resume: null,
    soldNum: index * 10,
    status: 2,
    isSpecial: null,
    rewardFee: null,
    stock: 0,
    purchaseNotes: '自动充值：充值请填写QQ号，暂不支持微信等第三方登陆账号',
    usageIllustration: '<p>自动充值：充值请填写QQ号，暂不支持微信等第三方登陆账号</p>',
    introduction: null,
    createTime: '2020-04-28T23:02:06.000+0000',
    modifyTime: '2020-04-28T23:02:06.000+0000',
    productSub: null,
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
    }, 1000);
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
          createTime: '2020-04-25T19:25:07.000+0000',
          modifyTime: '2020-05-11T06:58:04.000+0000',
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 1000);
  },
};
