import request from '@/utils/request';
import { QueryBase } from './base';

export interface QueryPoliceListParamsType extends QueryBase {
    deviceId: number; // 资产编号
    deviceName?: string; // 设备名称
    deviceFuTypeNo?: string; // 设备资产类型编号
    deviceTypeNo?: string; // 设备资产类型编号
    startTime?: string; // 开始采集时间
    endTime?: string; // 结束采集时间
    pageNum: number;
    pageSize: number;
}
export async function deviceWarnedTimes(): Promise<any> {
    return request('/v1/device/deviceAlam/count', {
        method: 'GET',
    });
}
export async function deviceWarnedList(params: QueryPoliceListParamsType): Promise<any> {
    return request('/v1/device/deviceAlam/selectAll', {
        method: 'GET',
        params
    });
}
