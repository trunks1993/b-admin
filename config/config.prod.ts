import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  outputPath: './app_prod_8',
  define: {
    "process.env.MAIN_TITLE": '星营销',
    "process.env.BASE_API":'http://10.161.81.8:9090/iotApi',
    'process.env.BASE_UPLOAD_URL': 'http://10.161.81.8:9090/iotApi',

  },
};

export default config;
