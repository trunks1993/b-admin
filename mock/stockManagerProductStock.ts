import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-20 15:36:52
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    roleName: '商家管理员' + index,
    createTime: '2019-08-22 15:08:36',
    userId: index,
    userName: '18969952907',
    roleCode: 2,
    id: index,
    realname: '合作1',
    status: 0,
  }));

const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};
export default {

  // 批量修改用户状态
  'POST /goods/batchBuyGoods': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },
};
