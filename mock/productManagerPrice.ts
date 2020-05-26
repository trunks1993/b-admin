/*
 * @Date: 2020-05-09 21:49:31
 * @LastEditTime: 2020-05-22 22:08:04
 */
import { Response, Request } from 'express';

const data = Array(20)
  .fill('')
  .map((item, index) => ({
    merchantId: 10809871 + index,
    goodsTypeCode: 104,
    price: 64000,
    goodsTypeName: '直充',
    facePrice: 80000,
    id: index,
    goodsCode: 1000000017,
    shortName: '1个月',
    goodsName: 'QQ音乐-付费音乐包1个月',
    status: 1,
    iconUrl: '/data/brand/202004/c8896fbb23c74751b36bb1618052abaa_7_1.png',
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /goods/searchMerGoodsPriceList': (req: Request, res: Response) => {
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
  'POST /goods/batchDeleteMerGoodsPrice': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  //修改
  'POST /goods/modifyMerGoodsPrice': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 新增
  'POST /goods/batchAddMerGoodsPrice': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
  // 查询详情
  'POST /goods/getMerGoodsPrice': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          merchantId: 10809871,
          goodsTypeCode: 104,
          price: 56000,
          goodsTypeName: '直充',
          facePrice: 80000,
          id: 1,
          goodsCode: 1000000017,
          shortName: '1个月',
          goodsName: 'QQ音乐-付费音乐包1个月',
          status: 1,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 1000);
  },

  // 批量修改状态
  'POST /goods/batchModifyMerGoodsPriceStatus': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
};
