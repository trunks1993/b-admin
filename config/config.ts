import { IConfig } from 'umi-types';
import slash from 'slash2';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;

import { product, sys, business, stock, order, finance, service, market } from './routesConfig';

const path = require('path');

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  history: 'hash',
  alias: {
    '@': path.resolve(path.resolve(__dirname, 'src')),
  },
  theme: {
    'primary-color': '#1A61DC',
  },
  define: {
    'process.env.MAIN_TITLE': '星权益运营系统',
    'process.env.BASE_API': '/baseApi',
    'process.env.BASE_FILE_SERVER': '/file',
  },
  routes: [
    {
      path: '/login',
      component: './login',
      Routes: ['src/AuthRouter'],
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/',
      component: '../layouts',
      // Routes: ['src/AuthRouter'],
      routes: [
        {
          path: '/dashboard',
          component: './dashboard',
          Routes: ['src/AuthRouter'],
        },
        {
          path: '/changeUser',
          component: './sys/setting/changeUser',
          from: '/dashboard',
          Routes: ['src/AuthRouter'],
        },
        {
          path: '/changePassword',
          component: './sys/setting/changePassword',
          from: '/dashboard',
          Routes: ['src/AuthRouter'],
        },
        ...product,
        ...sys,
        ...business,
        ...stock,
        ...order,
        ...finance,
        ...service,
        ...market,
        {
          path: '/auth',
          component: './auth',
        },
        {
          path: '*',
          component: './404',
        },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          immer: true,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
        },
        dynamicImport: { webpackChunkName: true },
        title: '星权益运营系统',
        dll: true,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
};

export default config;
