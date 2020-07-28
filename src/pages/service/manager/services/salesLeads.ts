import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
    clueSource?: string,
    telephone?: number,
    status?: number,
    startTime?: string,
    endTime?:string,
}
/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
    return request('/cust/searchSoldCluesList', {
      method: 'POST',
      data,
    });
}

export interface addReturnVisitRecordParamsType {
  status?:number,
  cluesCode?: number,
  returnVisitPerson?: string,
  returnVisitWay?: string,
  context?:string,
  returnVisitTime?:string,
}
/**
 * @name:  添加回访记录
 * @param {addReturnVisitRecordParamsType} data
 */
export async function addReturnVisitRecord(data: addReturnVisitRecordParamsType): Promise<any> {
    return request('/cust/addReturnVisitRecord', {
      method: 'POST',
      data,
    });
}

/**
 * @name: 查询列表
 * @param {addReturnVisitRecordParamsType} data
 */
export async function deleteSoldClues(data: addReturnVisitRecordParamsType): Promise<any> {
  return request('/cust/deleteSoldClues', {
    method: 'POST',
    data,
  });
}

export interface addSoldCluesParamsType {
  telephone?:number,
  name?: string,
  companyName?: string,
  email?: string,
  clueSource?:string,
}
/**
 * @name:  添加回访记录
 * @param {addSoldCluesParamsType} data
 */
export async function addSoldClues(data: addSoldCluesParamsType): Promise<any> {
    return request('/cust/addSoldClues', {
      method: 'POST',
      data,
    });
}

/**
 * @name:  查看明细
 * @param {number} data
 */
export async function selectByClueClues(data: number): Promise<any> {
  return request('/cust/selectByClueClues', {
    method: 'POST',
    data,
  });
}
