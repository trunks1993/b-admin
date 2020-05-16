/*
 * @Date: 2020-05-09 21:49:31
 * @LastEditTime: 2020-05-16 16:54:40
 */
import { Response, Request } from 'express';

const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    code: index,
    brandCode: 10088,
    name: '滴滴打车快车券',
    resume: null,
    status: 1,
    createTime: '2020-04-30T03:27:54.000+0000',
    modifyTime: '2020-04-30T03:27:54.000+0000',
    introduction: null,
    brandName: '爱奇艺爱奇艺爱奇艺',
    iconUrl: '/data/brand/202004/fae975dc4be64c9d8e9bf1467fc65d8a_2_1.png'
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /goods/searchProductList': (req: Request, res: Response) => {
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
  'POST /goods/deleteProduct': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  //修改
  'POST /goods/modifyProduct': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 新增
  'POST goods/addProduct': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 查询详情
  'POST /goods/getProduct': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          id: 41,
          code: 100064,
          brandCode: 1,
          name: '测试1',
          resume: '',
          status: 1,
          createTime: '2020-05-09T22:46:33.000+0000',
          modifyTime: '2020-05-09T22:47:43.000+0000',
          introduction: '',
          brand: null,
          productSubs: [
            {
              id: 1,
              name: '爱奇艺黄金会员月卡',
              shortName: '月卡',
              iconUrl: '',
              facePrice: 12000,
            },
            {
              id: 2,
              name: '爱奇艺黄金会员季卡',
              shortName: '季卡',
              iconUrl: '',
              facePrice: 16000,
            },
            {
              id: 3,
              name: '爱奇艺黄金会员年卡',
              shortName: '年卡',
              iconUrl: '',
              facePrice: 18000
            }
          ],
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 1000);
  },

  // 新增子产品
  'POST /goods/addProductSub': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 修改子产品
  'POST /goods/modifyProductSub': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 子产品详情
  'POST /goods/getProductSub': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          id: 126,
          code: 100000146,
          productCode: 100063,
          name: '滴滴打车快车券30元',
          shortName: null,
          facePrice: 300000,
          iconUrl: null,
          resume: null,
          status: 1,
          purchaseNotes: '',
          usageIllustration: '',
          introduction: null,
          createTime: '2020-04-30T03:30:07.000+0000',
          modifyTime: '2020-04-30T03:30:07.000+0000',
          product: null,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 1000);
  },
  // 子产品列表
  'POST /goods/getProductSubList': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: [
          {
            id: 126,
            code: 100000146,
            productCode: 100063,
            name: '滴滴打车快车券30元',
            shortName: null,
            facePrice: 300000,
            iconUrl: null,
            resume: null,
            status: 1,
            purchaseNotes: '',
            usageIllustration: '',
            introduction: null,
            createTime: '2020-04-30T03:30:07.000+0000',
            modifyTime: '2020-04-30T03:30:07.000+0000',
            product: null,
          },
          {
            id: 125,
            code: 100000145,
            productCode: 100063,
            name: '滴滴打车快车券20元',
            shortName: null,
            facePrice: 200000,
            iconUrl: null,
            resume: null,
            status: 1,
            purchaseNotes: '',
            usageIllustration: '',
            introduction: null,
            createTime: '2020-04-30T03:29:34.000+0000',
            modifyTime: '2020-04-30T03:29:34.000+0000',
            product: null,
          },
          {
            id: 124,
            code: 100000144,
            productCode: 100063,
            name: '滴滴打车快车券15元',
            shortName: null,
            facePrice: 150000,
            iconUrl: null,
            resume: null,
            status: 1,
            purchaseNotes: '',
            usageIllustration: '',
            introduction: null,
            createTime: '2020-04-30T03:29:16.000+0000',
            modifyTime: '2020-04-30T03:29:16.000+0000',
            product: null,
          },
          {
            id: 123,
            code: 100000143,
            productCode: 100063,
            name: '滴滴打车快车券10元',
            shortName: null,
            facePrice: 100000,
            iconUrl: null,
            resume: null,
            status: 1,
            purchaseNotes: '',
            usageIllustration: '',
            introduction: null,
            createTime: '2020-04-30T03:29:03.000+0000',
            modifyTime: '2020-04-30T03:29:03.000+0000',
            product: null,
          },
        ],
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 1000);
  },

  'POST /goods/deleteProductSub': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    });
  },
};
