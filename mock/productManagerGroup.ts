/*
 * @Date: 2020-05-11 16:36:28
 * @LastEditTime: 2020-05-15 09:53:14
 */
import { Response, Request } from 'express';

const data = Array(20)
  .fill('')
  .map((item, index) => ({
    code: index,
    name: '生活服务' + index,
    status: 0,
    iconUrl: '',
    createTime: '2020-04-28T23:02:06.000+0000',
    goodsCount: index * 10,
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /category/getCategoryList': (req: Request, res: Response) => {
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
  'POST /category/addCategory': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 0);
  },

  // 删除
  'POST /category/deleteCategory': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 0);
  },

  // 获取详情
  'POST /category/loadCategoryInfo': (req: Request, res: Response) => {
    const { currPage, pageSize } = req.body;
    const list = !pageSize ? data : data.slice((currPage - 1) * pageSize, currPage * pageSize);
    setTimeout(() => {
      res.send({
        result: {
          id: 12,
          code: 100011,
          name: '生活服务子类目4',
          level: 2,
          isLeaf: 'Y',
          parentCode: 100001,
          status: 1,
          iconUrl: '/data/secret/excel/202004/0969cd45fb044d3d8dcd1404d45656d4_7_1.png',
          createTime: '2020-05-09T21:40:55.000+0000',
          modifyTime: '2020-05-09T21:40:55.000+0000',
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },

  'POST /category/getCategoryTree': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          id: 1,
          label: '分类',
          children: [
            {
              id: 100001,
              label: '生活服务',
              children: [
                {
                  id: 100008,
                  label: '生活服务子类目1',
                  children: null,
                  checkedKeyList: null,
                },
                {
                  id: 100009,
                  label: '生活服务子类目2',
                  children: null,
                  checkedKeyList: null,
                },
                {
                  id: 100010,
                  label: '生活服务子类目3',
                  children: null,
                  checkedKeyList: null,
                },
              ],
              checkedKeyList: null,
            },
            {
              id: 100002,
              label: '餐饮美食',
              children: [],
              checkedKeyList: null,
            },
            {
              id: 100003,
              label: '旅游出行',
              children: [],
              checkedKeyList: null,
            },
            {
              id: 100004,
              label: '视频会员',
              children: [],
              checkedKeyList: null,
            },
            {
              id: 100005,
              label: '音频娱乐',
              children: [],
              checkedKeyList: null,
            },
            {
              id: 100006,
              label: '游戏点卡',
              children: [],
              checkedKeyList: null,
            },
            {
              id: 100007,
              label: '话费流量',
              children: [],
              checkedKeyList: null,
            },
          ],
          checkedKeyList: null,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },
};
