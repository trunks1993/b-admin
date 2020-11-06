/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-10-10 16:29:58
 */ 
import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  outputPath: './dist',
  define: {
    'process.env.MAIN_TITLE': '星权益运营系统',
    'process.env.BASE_API': '/api',
    'process.env.BASE_FILE_SERVER': '/file',
  },
};

export default config;
