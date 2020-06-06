/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-05-28 16:02:30
 */ 
import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  outputPath: './app_test_110',
  define: {
    'process.env.MAIN_TITLE': '星权益运营系统',
    'process.env.BASE_API': '/api',
    'process.env.BASE_FILE_SERVER': '/file',
  },
};

export default config;
