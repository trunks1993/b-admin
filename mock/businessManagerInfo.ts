/*
 * @Date: 2020-05-09 21:49:31
 * @LastEditTime: 2020-05-23 20:02:43
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
  'POST /merchant/searchMerchantList': (req: Request, res: Response) => {
    const { currPage, pageSize } = req.body;
    const list = !pageSize ? data : data.slice((currPage - 1) * pageSize, currPage * pageSize);
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
  'POST /merchant/modifyMerchant': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 新增
  'POST /merchant/addMerchant': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },

  // 删除
  'POST /merchant/deleteMerchant': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },

  // 查询详情
  'POST /merchant/getMerchant': (req: Request, res: Response) => {
    const { merchantId } = req.body;
    setTimeout(() => {
      res.send({
        result: {
          isLongTerm: 'N',
          idCardValidity: null,
          address: null,
          data:
            '{"creditCode":"91430100MA4Q5W141P","contactTelephone":"13429990988","contactName":"刘庆","businessName":"湖南云金数科网络科技有限公司","identityPhoto":"/data/secret/identify/202005/80997ccd7e024e91b736e8eafefaea33_291_1.jpg"}',
          provinceCode: null,
          cityCode: null,
          idCard: null,
          contactName: null,
          remark: null,
          telephone: null,
          idCardFront: null,
          merchantName: null,
          realname: null,
          areaCode: null,
          idCardType: null,
          creditCode: null,
          modifyTime: '2020-05-16T00:10:23.000+0000',
          merchantId: 10817249,
          createTime: '2020-05-11T03:44:01.000+0000',
          identityPhoto: null,
          userType: null,
          merchantType: 2,
          idCardBack: null,
          status: 2,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 1000);
  },
};
