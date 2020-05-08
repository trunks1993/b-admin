import request from '@/utils/request';
import { QueryBase } from './base';

//设备日志统计字段
export interface QueryLogDeviceStatisVo extends QueryBase {
  dayCount?: number; // 今日 统计
  everyCount?: number | null; //  所有统计
  monthCount?: number; //  近一月 统计
  weekCount?: number; //  近一周 统计
}
//设备日志查询字段
export interface QueryLogDeviceVoList extends QueryBase {
  createTime?: string; // 发生时间 ,
  deviceId?: number; // 设备ID ,
  logData?: string; // 返回参数 ,
  logDeviceId?: number; //  主键ID ,
  logType?: number; //  日志类型(1、上报，2、操作)
}
//平台日志统计字段
export interface QueryOperLogStatisVo extends QueryBase {
  dayCount?: number; // 今日 统计
  monthCount?: number; //  近一月 统计
  weekCount?: number; //  近一周 统计
}
//平台日志查询字段
export interface QueryOperLogPage extends QueryBase {
  businessType?: number; // 业务类型 ,
  deptName?: string; // 部门名称 ,
  errorMsg?: string; // 错误消息 ,
  methodName?: string; // 方法名称 ,
  moduleTitle?: string; // 模块标题 ,
  operId?: number; // 主键ID ,
  operIp?: string; // 主机地址 ,
  operName?: string; // 登录账号 ,
  operParam?: string; // 请求参数 ,
  operStatus?: number; // 操作状态(0正常,1异常) ,
  operTime?: string; // 操作时间 ,
  operUrl?: string; // 请求URL ,
  operatorType?: number; // 操作人类别
}
// 设备日志统计(今日、一周、一个月)
export async function logDeviceStatisVo(params: QueryLogDeviceStatisVo): Promise<any> {
  return request('/v1/log/logDevice/count', {
    method: 'GET',
    data: params,
  });
}
// 实时报文查询
export async function logDeviceList(params: QueryLogDeviceVoList): Promise<any> {
  return request('/v1/log/logDevice/list', {
    method: 'GET',
    params,
  });
}
// 设备报警日志查询
export async function logdeviceAlamList(params: QueryLogDeviceVoList): Promise<any> {
  return request('/v1/device/deviceAlam/list', {
    method: 'GET',
    params,
  });
}
// 设备日志查询
export async function logDeviceStateList(params: QueryLogDeviceVoList): Promise<any> {
  return request('/v1/log/logDeviceState/list', {
    method: 'GET',
    params,
  });
}
// 平台日志统计(今日、一周、一个月)
export async function operLogStatisVo(params: QueryOperLogStatisVo): Promise<any> {
  return request('/v1/operLog/count', {
    method: 'GET',
    data: params,
  });
}
// 平台日志查询
export async function operLogPage(params: QueryOperLogPage): Promise<any> {
  return request('/v1/operLog/queryByPage', {
    method: 'GET',
    params,
  });
}
//平台日志查询字段
export interface QueryByDeviceTypeCondition extends QueryBase {
  deviceTypeNo?: number; // 业务类型 ,
}
// 平台日志查询
export async function queryByDeviceType(params: QueryByDeviceTypeCondition): Promise<any> {
  return request('/v1/device/deviceType/queryByTypeNo', {
    method: 'GET',
    params,
  });
}
