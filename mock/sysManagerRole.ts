import { Response, Request } from "express";

/*
 * @Date: 2020-05-07 16:32:46
 * @LastEditTime: 2020-05-08 21:12:52
 */
const data = Array(20)
  .fill('')
  .map((item, index) => ({
    id: index,
    code: index,
    name: `管理员${index}`,
    isAdmin: 'Y',
    userNumber: 10088,
    remark: '具备“财务管理”，“查看订单”的相关权限',
  }));
export default {
  // 获取角色列表
  'POST /sys/searchSysRoleList': (req: Request, res: Response) => {
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

  // 删除角色
  'POST /sys/deleteSysRole': (req: Request, res: Response) => {
    const { code } = req.body;
    const list = data.filter(item => item.code !== code);
    setTimeout(() => {
      res.send({
        result: {},
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 2000);
  },

  // 查询角色对应权限
  // 查询所有权限
  // 新增角色
  // 编辑角色
  'POST /sys/modifySysRole': (req: Request, res: Response) => {
    const { code } = req.body;
    const list = data.filter(item => item.code !== code);
    setTimeout(() => {
      res.send({
        result: {},
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 2000);
  },
  'POST /sys/addSysRole': (req: Request, res: Response) => {
    const { code } = req.body;
    const list = data.filter(item => item.code !== code);
    setTimeout(() => {
      res.send({
        result: {},
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 2000);
  },
  'POST /sys/searchSysAuthorityList': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: [
          {
            id: 1,
            code: 1,
            parentCode: null,
            name: 'Root',
            type: 1,
            level: 0,
            isLeaf: 'N',
            uri: '1',
            createTime: '2019-06-03T10:10:01.000+0000',
            modifyTime: '2019-06-03T10:10:04.000+0000',
          },
          {
            id: 2,
            code: 2,
            parentCode: 1,
            name: '商品管理',
            type: 1,
            level: 1,
            isLeaf: 'N',
            uri: '2',
            createTime: '2019-06-03T15:11:01.000+0000',
            modifyTime: '2019-06-03T15:11:04.000+0000',
          },
          {
            id: 3,
            code: 3,
            parentCode: 2,
            name: '产品管理',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
          {
            id: 4,
            code: 4,
            parentCode: 2,
            name: '商品列表',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
          //
          {
            id: 41,
            code: 41,
            parentCode: 4,
            name: '发布',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
          {
            id: 42,
            code: 42,
            parentCode: 4,
            name: '删除',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
          {
            id: 43,
            code: 43,
            parentCode: 4,
            name: '上架',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
          {
            id: 44,
            code: 44,
            parentCode: 4,
            name: '下架',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
          {
            id: 45,
            code: 45,
            parentCode: 4,
            name: '编辑',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
          {
            id: 46,
            code: 46,
            parentCode: 4,
            name: '新增',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
          //
          {
            id: 5,
            code: 5,
            parentCode: 1,
            name: '系统管理',
            type: 1,
            level: 1,
            isLeaf: 'N',
            uri: '2',
            createTime: '2019-06-03T15:11:01.000+0000',
            modifyTime: '2019-06-03T15:11:04.000+0000',
          },
          {
            id: 6,
            code: 6,
            parentCode: 5,
            name: '用户管理',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
          {
            id: 7,
            code: 7,
            parentCode: 5,
            name: '角色管理',
            type: 1,
            level: 2,
            isLeaf: 'Y',
            uri: '/productmgr',
            createTime: '2019-06-03T15:12:04.000+0000',
            modifyTime: '2019-06-03T15:12:08.000+0000',
          },
        ],
        code: '0',
        success: true,
        resultMsg: null,
      });
    });
  },
  'POST /sys/getSysRoleInfo': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        result: {
          sysRole: {
            id: 2,
            code: 2,
            name: '商家管理员',
            isAdmin: 'N',
            remark: null,
            createTime: '2019-06-03T15:20:12.000+0000',
            modifyTime: '2019-06-03T15:20:15.000+0000',
          },
          sysAuthorityList: [2, 3],
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    });
  },
};
