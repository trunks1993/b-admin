import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-23 17:28:02
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    code: index,
    supplierCode: 1,
    supplierName: '测试供应商',
    buynerType: null,
    bizType: 1,
    innerOrderId: 1,
    goodsCode: 1,
    reqUrl: '1',
    reqParam: '1',
    response: '1',
    reqMethod: '1',
    reqType: '1',
    orderId: '1',
    status: 8,
    retryTimes: 1,
    outerOrderStatus: '1',
    outerReturnCode: '1',
    outerReturnMessage: '1',
    processStartTime: '2020-05-20T07:33:23.000+0000',
    completeTime: '2020-05-20T07:33:27.000+0000',
    processType: 1,
    createTime: '2020-05-20T07:33:29.000+0000',
    modifyTime: '2020-05-20T07:33:32.000+0000',
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};
export default {
  // 获取列表
  'POST /goods/searchWorkorderList': (req: Request, res: Response) => {
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

  // 新增
  'POST /goods/batchImportGoodsInventory': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 获取商品数量
  'POST /goods/checkStockInQuantity': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          count: 4,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 2000);
  },

  // 详情
  'POST /goods/getWorkorder': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          baseInfo: {
            code: 1,
            bizType: 1,
            outerOrderStatus: '1',
            reqMethod: '1',
            orderId: '1',
            remark: null,
            supplierCode: 1,
            reqParam: '1',
            outerReturnCode: '1',
            outerReturnMessage: '1',
            modifyTime: '2020-05-20T07:33:32.000+0000',
            processStartTime: '2020-05-20T07:33:23.000+0000',
            id: 1,
            processType: 1,
            supplierName: null,
            buynerType: null,
            innerOrderId: 1,
            completeTime: '2020-05-20T07:33:27.000+0000',
            retryTimes: 1,
            reconciliationStatus: 1,
            createTime: '2020-05-20T07:33:29.000+0000',
            response: '1',
            reqType: '1',
            goodsCode: 1000000017,
            reqUrl: '1',
            status: 8,
          },
          goodsList: [
            {
              productSubCode: 100000021,
              code: 1000000017,
              lockedStock: null,
              rewardFee: null,
              productName: 'QQ音乐-付费音乐包',
              modifyTime: '2020-05-16T01:41:35.000+0000',
              isSpecial: null,
              price: 78400,
              stockStatus: null,
              id: 1,
              iconUrl: null,
              stock: 100,
              introduction: null,
              productSubName: 'QQ音乐-付费音乐包1个月',
              brandCode: 10066,
              resume: 'fsdfsa',
              brandName: 'QQ音乐',
              buyNumber: 100,
              taxRate: 5,
              purchasePrice: 1000,
              purchaseNotes: '自动充值：充值请填写QQ号，暂不支持微信等第三方登陆账号',
              isDelete: 'N',
              productSub: {
                resume: null,
                product: {
                  resume: null,
                  brandName: null,
                  code: 100024,
                  isDelete: 'N',
                  productSubList: null,
                  modifyTime: '2020-04-28T22:38:38.000+0000',
                  createTime: '2020-04-28T22:38:38.000+0000',
                  name: 'QQ音乐-付费音乐包',
                  id: 1,
                  iconUrl: null,
                  brand: {
                    resume: '腾讯公司推出的一款网络音乐服务产品',
                    code: 10066,
                    modifyTime: '2020-04-28T22:29:29.000+0000',
                    createTime: '2020-04-28T22:29:29.000+0000',
                    isDelete: null,
                    name: 'QQ音乐',
                    id: 1,
                    iconUrl: '/data/brand/202004/fae975dc4be64c9d8e9bf1467fc65d8a_2_1.png',
                    introduction:
                      '海量音乐在线试听、新歌热歌在线首发、歌词翻译、手机铃声下载、高品质无损音乐试听、海量无损曲库、正版音乐下载、空间背景音乐设置、MV观看等，是互联网音乐播放和下载的优选。',
                    status: 1,
                  },
                  introduction: null,
                  brandCode: 10066,
                  status: 1,
                },
                code: 100000021,
                purchaseNotes: '',
                isDelete: 'N',
                productCode: 100024,
                modifyTime: '2020-04-28T22:44:59.000+0000',
                createTime: '2020-04-28T22:44:59.000+0000',
                name: 'QQ音乐-付费音乐包1个月',
                facePrice: 80000,
                id: 1,
                iconUrl: null,
                shortName: '1个月',
                usageIllustration: '',
                introduction: null,
                status: 1,
              },
              productCode: 100024,
              createTime: '2020-04-28T23:02:06.000+0000',
              facePrice: null,
              productTypeCode: 104,
              usageIllustration: '自动充值：充值请填写QQ号，暂不支持微信等第三方登陆账号',
              status: 2,
            },
          ],
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 2000);
  },
};
