export default {
  'POST /baseApi/sys/login': (req: any, res: any) => {
    setTimeout(() => {
      res.send({
        code: '0',
        result: {
          token: 1,
          realname: '测试名字',
          headIcon: '/data/brand/202004/fae975dc4be64c9d8e9bf1467fc65d8a_2_1.png',
        },
        success: true,
      });
    }, 2000);
  },
};
