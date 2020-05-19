import { Response, Request } from 'express';

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-09 22:23:16
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
  // 获取列表
  'POST /sys/searchSysUserList': (req: Request, res: Response) => {
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

  // 删除
  'POST /sys/deleteSysUser': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 修改
  'POST /sys/modifySysUser': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 新增
  'POST /sys/addSysUser': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 批量修改用户状态
  'POST /sys/batchModifySysUserStatus': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 2000);
  },

  // 获取详情
  'POST /sys/getSysUserInfo': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          createTime: '2020-05-07T20:28:53.000+0000',
          roleCode: 1,
          roleName: '系统管理员',
          remark: '备注信息修改',
          id: 6,
          userName: '18273459183',
          userId: 11079155,
          realname: '贺旭修改',
          status: 0,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    });
  },
};
