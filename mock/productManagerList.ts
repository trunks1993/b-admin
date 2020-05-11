/*
 * @Date: 2020-05-09 21:49:31
 * @LastEditTime: 2020-05-11 14:50:33
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
    usageIllustration: '自动充值：充值请填写QQ号，暂不支持微信等第三方登陆账号',
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
  'POST /goods/searchGoodsList': (req: Request, res: Response) => {
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

  // 删除
  'POST /sys/deleteGoods': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  //修改
  'POST /sys/modifyGoods': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 新增
  'POST /goods/addGoods': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },

  // 修改状态
  'POST /goods/modifyGoodsStatus': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
};
