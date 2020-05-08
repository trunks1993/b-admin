export default {
  // 获取用户信息
  'POST /sys/loadUserMenu': (req: any, res: any) => {
    setTimeout(() => {
      res.send({
        result: {
          menuData: [
            {
              code: 2,
              parentCode: 1,
              name: '商户',
              level: 1,
              isLeaf: 'N',
              uri: '/business',
              children: [
                {
                  code: 21,
                  parentCode: 2,
                  name: '商户管理',
                  level: 2,
                  isLeaf: 'N',
                  uri: '/business/manager',
                  children: [
                    {
                      code: 211,
                      parentCode: 21,
                      name: '商户资料',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/business/manager/info',
                      children: null,
                    },
                    {
                      code: 212,
                      parentCode: 21,
                      name: '商户认证',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/business/manager/auth',
                      children: null,
                    },
                    {
                      code: 213,
                      parentCode: 21,
                      name: '商户应用',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/business/manager/application',
                      children: null,
                    },
                    {
                      code: 214,
                      parentCode: 21,
                      name: '账号设置',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/business/manager/setting',
                      children: null,
                    },
                  ],
                },
              ],
            },
            {
              code: 3,
              parentCode: 1,
              name: '商品',
              level: 1,
              isLeaf: 'N',
              uri: '/product',
              children: [
                {
                  code: 31,
                  parentCode: 3,
                  name: '商品管理',
                  level: 2,
                  isLeaf: 'N',
                  uri: '/product/manager',
                  children: [
                    {
                      code: 311,
                      parentCode: 31,
                      name: '商品列表',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/product/manager/list',
                      children: null,
                    },
                    {
                      code: 312,
                      parentCode: 31,
                      name: '商品分组',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/product/manager/group',
                      children: null,
                    },
                    {
                      code: 313,
                      parentCode: 31,
                      name: '品牌管理',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/product/manager/brand',
                      children: null,
                    },
                    {
                      code: 314,
                      parentCode: 31,
                      name: '产品管理',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/product/manager/management',
                      children: null,
                    },
                    {
                      code: 315,
                      parentCode: 31,
                      name: '商品定价',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/product/manager/price',
                      children: null,
                    },
                  ],
                },
              ],
            },
            {
              code: 4,
              parentCode: 1,
              name: '系统',
              level: 1,
              isLeaf: 'N',
              uri: '/sys',
              children: [
                {
                  code: 41,
                  parentCode: 4,
                  name: '系统管理',
                  level: 2,
                  isLeaf: 'N',
                  uri: '/sys/manager',
                  children: [
                    {
                      code: 411,
                      parentCode: 41,
                      name: '基础数据',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/sys/manager/base',
                      children: null,
                    },
                    {
                      code: 412,
                      parentCode: 41,
                      name: '用户管理',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/sys/manager/user',
                      children: null,
                    },
                    {
                      code: 413,
                      parentCode: 41,
                      name: '角色管理',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/sys/manager/role',
                      children: null,
                    },
                    {
                      code: 414,
                      parentCode: 41,
                      name: '操作记录',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/sys/manager/log',
                      children: null,
                    },
                  ],
                },
              ],
            },
          ],
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },

  'POST /sys/getLoginInfo': (req: any, res: any) => {
    setTimeout(() => {
      res.send({
        result: {
          realname: '测试用户名',
          headIcon: '/data/brand/202004/fae975dc4be64c9d8e9bf1467fc65d8a_2_1.png',
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },
};
