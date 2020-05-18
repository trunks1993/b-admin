/*
 * @Date: 2020-05-09 21:49:31
 * @LastEditTime: 2020-05-18 14:13:24
 */
import { Response, Request } from 'express';

const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    merchantType: 1,
    merchantId: index,
    merchantName: 'string',
    telephone: 18077799999, // 联系方式
    email: '604725555@qq.com', // 邮箱
    contactName: '测试', // 联系人
    status: 2,
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /user/searchMerchantList': (req: Request, res: Response) => {
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

  //修改
  'POST /user/modifyMerchant': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 新增
  'POST /user/addMerchant': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },

  // 修改状态
  'POST /user/modifyGoodsStatus': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },

  // 查询详情
  'POST /user/getMerchant': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          id: 16,
          code: 1000000032,
          productSubCode: 100000146,
          productSubName: 'QQ音乐-绿钻豪华版12个月',
          productCode: 100025,
          productName: 'QQ音乐-绿钻豪华版',
          brandCode: 10066,
          brandName: 'QQ音乐',
          productTypeCode: 104,
          facePrice: 1800000,
          price: 1584000,
          iconUrl: null,
          resume: null,
          status: 2,
          isSpecial: null,
          rewardFee: null,
          stock: 100,
          purchaseNotes: '1、自动充值：充值请填写QQ号，暂不支持微信等第三方登陆账号',
          usageIllustration: '<p>自动充值：充值请填写QQ号，暂不支持微信等第三方登陆账号</p>',
          introduction: null,
          createTime: '2020-04-29T00:28:25.000+0000',
          modifyTime: '2020-04-29T00:28:25.000+0000',
          productSub: null,
          undisplayStock: 'Y',
          upType: 2,
          stockType: 1,
          upTime: '2020-04-29T00:28:25.000+0000',
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 1000);
  },
};
