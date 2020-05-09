/*
 * @Date: 2020-05-09 21:49:31
 * @LastEditTime: 2020-05-09 22:28:58
 */
import { Response, Request } from 'express';

const data = Array(10)
  .fill('')
  .map((item, index) => ({
    id: 6,
    code: 1000000022,
    productSubCode: 100000022,
    productTypeCode: 101,
    price: 235200,
    iconUrl: null,
    resume: null,
    status: 2,
    isSpecial: null,
    rewardFee: null,
    stock: 0,
    purchaseNotes: '1.登陆APP或者官网之后选择激活码兑换-输入激活码即可 2.卡密有效期为半年',
    usageIllustration: '1.登陆APP或者官网之后选择激活码兑换-输入激活码即可 2.卡密有效期为半年',
    introduction: null,
    createTime: '2020-04-28T23:08:47.000+0000',
    modifyTime: '2020-04-28T23:08:47.000+0000',
    productSub: {
      id: 2,
      code: 100000022,
      productCode: 100024,
      name: 'QQ音乐-付费音乐包3个月',
      shortName: null,
      facePrice: 240000,
      iconUrl: null,
      resume: null,
      status: 1,
      purchaseNotes: '',
      usageIllustration: '',
      introduction: null,
      createTime: '2020-04-28T22:46:08.000+0000',
      modifyTime: '2020-04-28T22:46:08.000+0000',
      product: {
        id: 1,
        code: 100024,
        brandCode: 10066,
        name: 'QQ音乐-付费音乐包',
        resume: null,
        status: 1,
        createTime: '2020-04-28T22:38:38.000+0000',
        modifyTime: '2020-04-28T22:38:38.000+0000',
        introduction: null,
        brand: {
          id: 1,
          name: 'QQ音乐',
          code: 10066,
          iconUrl: '/data/brand/202004/fae975dc4be64c9d8e9bf1467fc65d8a_2_1.png',
          resume: '腾讯公司推出的一款网络音乐服务产品',
          status: 1,
          createTime: '2020-04-28T22:29:29.000+0000',
          modifyTime: '2020-04-28T22:29:29.000+0000',
          introduction:
            '海量音乐在线试听、新歌热歌在线首发、歌词翻译、手机铃声下载、高品质无损音乐试听、海量无损曲库、正版音乐下载、空间背景音乐设置、MV观看等，是互联网音乐播放和下载的优选。',
        },
      },
    },
  }));

const noDataRes = {
  result: {
    list: [],
    totalPage: 18,
    totalRecords: 173,
    currPage: 1,
  },
  code: '0',
  success: true,
  resultMsg: null,
};

export default {
  // 获取列表
  'POST /goods/searchGoodsList': (req: Request, res: Response) => {
    const { currPage, pageSize } = req.body;
    const list = !pageSize ? data : data.slice((currPage - 1) * pageSize, currPage * pageSize);
    setTimeout(() => {
      res.send({
        result: {},
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
};
