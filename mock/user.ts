const noDataRes = {
  result: {},
  code: '0',
  success: true,
  resultMsg: null,
};
export default {
  // 获取菜单
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
                  ],
                },
              ],
            },

            {
              code: 5,
              parentCode: 1,
              name: '库存',
              level: 1,
              isLeaf: 'N',
              uri: '/stock',
              children: [
                {
                  code: 51,
                  parentCode: 5,
                  name: '库存管理',
                  level: 2,
                  isLeaf: 'N',
                  uri: '/stock/manager',
                  children: [
                    {
                      code: 511,
                      parentCode: 51,
                      name: '商品库存',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/stock/manager/productStock',
                      children: null,
                    },
                    {
                      code: 512,
                      parentCode: 51,
                      name: '商品入库',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/stock/manager/warehousing',
                      children: null,
                    },
                    {
                      code: 513,
                      parentCode: 51,
                      name: '商品出库',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/stock/manager/outOfStock',
                      children: null,
                    },
                    {
                      code: 514,
                      parentCode: 51,
                      name: '库存流水',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/stock/manager/stockWater',
                      children: null,
                    },
                    {
                      code: 515,
                      parentCode: 51,
                      name: '供应商管理',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/stock/manager/suppliers',
                      children: null,
                    },
                  ],
                },
              ],
            },

            {
              code: 6,
              parentCode: 1,
              name: '订单',
              level: 1,
              isLeaf: 'N',
              uri: '/order',
              children: [
                {
                  code: 61,
                  parentCode: 6,
                  name: '订单管理',
                  level: 2,
                  isLeaf: 'N',
                  uri: '/order/manager',
                  children: [
                    {
                      code: 611,
                      parentCode: 61,
                      name: '交易订单',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/order/manager/transaction',
                      children: null,
                    },
                    {
                      code: 612,
                      parentCode: 61,
                      name: '采购订单',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/order/manager/purchase',
                      children: null,
                    },
                    // {
                    //   code: 613,
                    //   parentCode: 61,
                    //   name: '售后订单',
                    //   level: 3,
                    //   isLeaf: 'Y',
                    //   uri: '/order/manager/service',
                    //   children: null,
                    // },
                  ],
                },
              ],
            },

            {
              code: 7,
              parentCode: 1,
              name: '财务',
              level: 1,
              isLeaf: 'N',
              uri: '/finance',
              children: [
                {
                  code: 71,
                  parentCode: 7,
                  name: '财务管理',
                  level: 2,
                  isLeaf: 'N',
                  uri: '/finance/manager',
                  children: [
                    {
                      code: 711,
                      parentCode: 71,
                      name: '商户账户',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/finance/manager/pos',
                      children: null,
                    },
                    // {
                    //   code: 712,
                    //   parentCode: 71,
                    //   name: '对账单',
                    //   level: 3,
                    //   isLeaf: 'Y',
                    //   uri: '/finance/manager/statementOfAccount',
                    //   children: null,
                    // },
                    {
                      code: 713,
                      parentCode: 71,
                      name: '账户明细',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/finance/manager/details',
                      children: null,
                    },
                    {
                      code: 714,
                      parentCode: 71,
                      name: '账户充值',
                      level: 3,
                      isLeaf: 'Y',
                      uri: '/finance/manager/recharge',
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

  // 获取用户信息
  'POST /sys/getLoginInfo': (req: any, res: any) => {
    setTimeout(() => {
      res.send({
        result: {
          realname: '测试用户名',
          headIcon: '/data/brand/202004/fae975dc4be64c9d8e9bf1467fc65d8a_2_1.png',
          userId: 1,
        },
        code: '0',
        success: true,
        resultMsg: null,
      });
    }, 0);
  },

  // 修改密码
  'POST /sys/modifyPassword': (req: any, res: any) => {
    setTimeout(() => {
      res.send(noDataRes);
    }, 1000);
  },
};
