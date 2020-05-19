import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-19 22:55:41
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    merchantId: 10810902 + index,
    orderId: 118100279204 + index,
    custId: 10002722 + index,
    totalDerateFee: null,
    totalPay: 913500,
    realTotalPay: null,
    payStatus: 0,
    payMethod: null,
    merchantName: '湖南云金数科信息技术有 限公司（1800980912）',
    telephone: 18077778888,
    status: 1,
    completeTime: null,
    itemCount: 1,
    completeItemCount: 0,
    createTime: '2020-05-07T18:39:00.000+0000',
    modifyTime: '2020-05-07T18:39:00.000+0000',
    orderItemList: [
      {
        id: 9 + index,
        orderId: 118100279204 + index,
        code: 11810850246982 + index,
        goodsCode: 1000000159,
        brandCode: 10081,
        brandName: '哈根达斯',
        productSubCode: 100000119,
        productSubName: '哈根达斯代金券35元',
        productTypeCode: 101,
        typeLabel: '卡密',
        facePrice: 350000,
        price: 304500,
        iconUrl: '/data/brand/202004/c8896fbb23c74751b36bb1618052abaa_7_1.png',
        resume: null,
        purchaseNotes:
          '1、在您付款后系统会发二维码信息到接收人的手机上，凭收到的数字辅助码短信或者二维码彩信到哈根达斯门店提货的，2、您持兑换短信券码至哈根达斯指定门店，全国门店通用（不包含全国机场门店），3、在消费结账时，出示短信券码中的【卡密】，收银员验证无误后抵扣相应订单金额。，4、哈根达斯有效期为1年',
        usageIllustration:
          '1、在您付款后系统会发二维码信息到接收人的手机上，凭收到的数字辅助码短信或者二维码彩信到哈根达斯门店提货的，2、您持兑换短信券码至哈根达斯指定门店，全国门店通用（不包含全国机场门店），3、在消费结账时，出示短信券码中的【卡密】，收银员验证无误后抵扣相应订单金额。，4、哈根达斯有效期为1年',
        introduction: null,
        detailCount: 3,
        itemCount: null,
        successCount: 0,
        failedCount: 0,
        status: 1,
        batchFileUrl: null,
        remark: null,
        extracted: null,
        createTime: '2020-05-07T18:39:00.000+0000',
        modifyTime: '2020-05-07T18:39:00.000+0000',
      },
      {
        id: 9 + index,
        orderId: 118100279204 + index,
        code: 11810850246982 + index,
        goodsCode: 1000000159,
        brandCode: 10081,
        brandName: '哈根达斯',
        productSubCode: 100000119,
        productSubName: '哈根达斯代金券35元',
        productTypeCode: 101,
        typeLabel: '卡密',
        facePrice: 350000,
        price: 304500,
        iconUrl: '/data/brand/202004/c8896fbb23c74751b36bb1618052abaa_7_1.png',
        resume: null,
        purchaseNotes:
          '1、在您付款后系统会发二维码信息到接收人的手机上，凭收到的数字辅助码短信或者二维码彩信到哈根达斯门店提货的，2、您持兑换短信券码至哈根达斯指定门店，全国门店通用（不包含全国机场门店），3、在消费结账时，出示短信券码中的【卡密】，收银员验证无误后抵扣相应订单金额。，4、哈根达斯有效期为1年',
        usageIllustration:
          '1、在您付款后系统会发二维码信息到接收人的手机上，凭收到的数字辅助码短信或者二维码彩信到哈根达斯门店提货的，2、您持兑换短信券码至哈根达斯指定门店，全国门店通用（不包含全国机场门店），3、在消费结账时，出示短信券码中的【卡密】，收银员验证无误后抵扣相应订单金额。，4、哈根达斯有效期为1年',
        introduction: null,
        detailCount: 3,
        itemCount: null,
        successCount: 0,
        failedCount: 0,
        status: 1,
        batchFileUrl: null,
        remark: null,
        extracted: null,
        createTime: '2020-05-07T18:39:00.000+0000',
        modifyTime: '2020-05-07T18:39:00.000+0000',
      },
    ],
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /merchant/order/searchOrderList': (req: Request, res: Response) => {
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

  // 取消订单
  'POST /merchant/order/cancelOrder': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 0);
  },

  // 订单发货
  'POST /merchant/order/deliverOrder': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 0);
  },

  // 详情
  'POST /merchant/order/getOrderInfo': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          id: 1,
          merchantId: 10810902,
          orderId: 118100275159,
          custId: 10002722,
          totalDerateFee: null,
          totalPay: 70000,
          realTotalPay: 50000,
          payStatus: 0,
          payMethod: null,
          status: 5,
          completeTime: '2020-05-07T13:59:03.000+0000',
          createTime: '2020-05-06T23:09:47.000+0000',
          payTime: '2020-05-06T23:09:47.000+0000',
          deliverTime: '2020-05-06T23:09:47.000+0000',
          itemCount: 1,
          completeItemCount: 0,
          modifyTime: '2020-05-07T05:59:00.000+0000',
          orderItemList: [
            {
              id: 1,
              orderId: 118100275159,
              code: 11810850238793,
              goodsCode: 1000000077,
              brandCode: 10075,
              brandName: '爱奇艺',
              productSubCode: 100000065,
              productSubName: '爱奇艺视频黄金会员周卡',
              productTypeCode: 101,
              typeLabel: '卡密',
              facePrice: 100000,
              price: 70000,
              iconUrl: '/data/brand/202004/8a512f94069c41259c14494e82631a5c_1_1.png',
              resume: null,
              purchaseNotes:
                '卡密使用方法：网页版：1.官网http://www.iqiyi.com/-登陆自己的爱奇艺账号-立即开通-点击兑换代金券-输入兑换码即可，安卓：打开爱奇艺APP-我的-我的vip会员-立即续费-激活码兑换-输入激活码和验证码-提交-激活成功，Ios:  1.关注爱奇艺微信公众号，2.点击呼叫小秘-开通会员-代金券，3.点击兑换代金券-输入代金券兑换码',
              usageIllustration:
                '卡密使用方法：网页版：1.官网http://www.iqiyi.com/-登陆自己的爱奇艺账号-立即开通-点击兑换代金券-输入兑换码即可，安卓：打开爱奇艺APP-我的-我的vip会员-立即续费-激活码兑换-输入激活码和验证码-提交-激活成功，Ios:  1.关注爱奇艺微信公众号，2.点击呼叫小秘-开通会员-代金券，3.点击兑换代金券-输入代金券兑换码',
              introduction: null,
              detailCount: 1,
              itemCount: null,
              successCount: 0,
              failedCount: 0,
              status: 7,
              batchFileUrl: null,
              remark: null,
              extracted: null,
              createTime: '2020-05-06T23:09:48.000+0000',
              modifyTime: '2020-05-07T05:59:00.000+0000',
            },
          ],
          merchantName: '测试商户名称',
          telephone: 18077777777,
          payCode: 123124121231,
          deliverMethodCode: null,
          deliverMethod: '自动发货/人工配货',
          deliverUserId: null,
          deliverUserName: '测试配货员',
          completeType: null,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },
};
