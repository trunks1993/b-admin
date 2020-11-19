/*
 * @Date: 2020-05-11 09:27:53
 * @LastEditTime: 2020-11-16 09:11:08
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/baseApi': {
      target: 'http://192.168.31.175:8000',
      changeOrigin: true,
      pathRewrite: { '^/baseApi': '' },
    },
    '/file': {
      target: 'http://192.168.31.64:9080/',
      changeOrigin: true,
      pathRewrite: {
        '^/file': '',
      },
    },
  },
  test: {
    '/baseApi': {
      target: 'http://101.132.39.136:9002',
      // target: 'http://192.168.28.18:9002',//朱琳琳
      // target: 'http://192.168.31.68:9002',//孙志伟
      changeOrigin: true,
      pathRewrite: { '^/baseApi': '' },
    },
    '/file': {
      target: 'http://101.132.39.136:9080/',
      changeOrigin: true,
      pathRewrite: {
        '^/file': '',
      },
    },
  },
};
