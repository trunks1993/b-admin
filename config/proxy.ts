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
      target: 'http://172.20.10.9:8000',
      changeOrigin: true,
      pathRewrite: { '^/baseApi': '' },
    },
  },
  test: {
    '/baseApi': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
