/*
 * @Date: 2020-05-11 16:36:28
 * @LastEditTime: 2020-05-11 23:16:17
 */
import { Response, Request } from 'express';

const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    name: '滴滴',
    code: index,
    iconUrl: '/data/brand/202004/cfd207e1121640cd9970d48155723fc3_16_1.png',
    resume: '全球卓越的移动出行平台',
    status: 1,
    createTime: '2020-04-30T03:27:09.000+0000',
    modifyTime: '2020-04-30T03:27:09.000+0000',
    introduction:
      '滴滴出行是全球卓越的移动出行平台;为超过4.5亿用户提供出租车、专车、快车、顺风车、豪华车、公交、小巴、代驾、租车、企业级、共享单车等全面的出行服务。',
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /brand/searchBrandList': (req: Request, res: Response) => {
    const { currPage, pageSize } = req.body;
    const list = !pageSize ? data : data.slice((currPage - 1) * pageSize, currPage * pageSize);
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
  'POST /brand/addBrand': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 0);
  },

  // 修改
  'POST /brand/modifyBrand': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 0);
  },

  // 删除
  'POST /brand/deleteBrand': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 0);
  },

  // 获取详情
  'POST /brand/getBrand': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          id: 24,
          name: '杜卡迪',
          code: 10089,
          iconUrl: '',
          resume: '杜卡迪V4S',
          status: 1,
          createTime: '2020-05-09T21:57:44.000+0000',
          modifyTime: '2020-05-09T21:57:44.000+0000',
          introduction: '杜卡迪一百八飙就完了',
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },

  // 保存分组信息
  'POST /brand/saveBrandCategory': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 0);
  },
};
