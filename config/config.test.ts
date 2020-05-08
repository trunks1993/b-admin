import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  outputPath: './app_test_110',
  define: {
    'process.env.MAIN_TITLE': '星营销',
    'process.env.BASE_API': 'http://192.168.0.110:9999/iotApi',
    'process.env.BASE_UPLOAD_URL': 'http://192.168.0.110:9999/iotApi',
  },
};

export default config;
