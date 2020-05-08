import request from '@/utils/request';
import { QueryBase } from './base';
import { Moment } from 'moment';

export async function getDeviceManagerData(): Promise<any> {
  return request('/v1/device/selectAll', {
    method: 'GET',
  });
}

export interface DeviceParamsType {
  deviceId: string; // 设备编号
}

export interface CollectionParamsType extends QueryBase {
  deviceId?: string; // 设备编号
  deviceName?: string; // 设备名称
  serialNumber?: string; // 序列号
  brandNo?: string; // 品牌ID
  deviceTypeNo: number; // 资产子类
  readonly deviceTypeParentNo: number; // 父级资产子类
  deviceState?: number; // 设备状态
  stateCode?: number; // 在线状态
}

export async function getDeviceCollectionList(params: CollectionParamsType): Promise<any> {
  return request('/v1/device/list', {
    method: 'GET',
    params,
  });
}

export interface DeviceTypeParamsType {
  deviceTypeNo?: number; // 设备编号
}

// 根据设备获取设备种类
export async function getDeviceType(params: DeviceTypeParamsType): Promise<any> {
  return request('/v1/device/deviceType/queryByFatherNo', {
    method: 'GET',
    params,
  });
}

export async function deleteDevice(params: DeviceParamsType): Promise<any> {
  return request('/v1/device/delete', {
    method: 'DELETE',
    params,
  });
}

export interface AddDeviceParamsType {
  deviceId?: string; // 主键ID（新增时不传，修改时传）
  mainImage?: string; // 主图
  deviceTypeNo: number; // 设备类型编号
  firstTreeTypeId?: number; // 第一级安装位置ID
  treeTypeId?: number; // 安装位置ID
  positionDetails?: string; // 安装详细位置
  deviceTypeParentNo: number; // 父级设备类型
  deviceName: string; // 设备名称
  brandNo: string; // 品牌ID
  serialNumber: string; // 厂商唯一编号
  model?: string; // 型号
  specs?: string; // 规格
  productionCompany?: string; // 生产单位
  productionTime?: Moment; // 生产日期
  supplyCompany?: string; // 供货单位
  purchaseTime?: Moment; // 采购日期
  serviceLife?: string; // 使用年限
  maintenanceCycle?: string; // 维护周期
  useUser?: string; // 使用负责人
  departmentId?: number; // 所属部门
  unitNameId?: number; // 单位名称
  useTime?: Moment; // 投入使用日期 
  remarks?: string; // 备注
  deviceState?: number; // 设备状态
  stateCode?: number; // 在线状态
  sort: number; // 序号
  extendedField?: string; // 扩展字段（JSON）
  createId: number; // 创建人(不需要填)
  isFixedPosition: number; // 是否固定位置(0、否，1、是) ,
  groupId?: number; // 组ID
}

// 添加设备
export async function addDevice(data: AddDeviceParamsType): Promise<any> {
  return request('/v1/device/add', {
    method: 'POST',
    data,
  });
}

// 获取设备详情
export async function getDeviceDetail(params: DeviceParamsType): Promise<any> {
  return request(`/v1/device/${params.deviceId}`, {
    method: 'GET'
  });
}

export async function getAnalysisData(): Promise<any> {
  return request('/v1/device/monitorAnalyze/infos', {
    method: 'get'
  });
}
// 首页echarts柱状图
export async function getAnalysisAlamData(): Promise<any> {
  return request('/v1/device/monitorAnalyze/infosAlam', {
    method: 'get'
  });
}

// 导出设备
export interface exportParamsType {
  deviceId?: number;
  deviceName?: string;
  serialNumber?: string;
  brandNo?: number;
  deviceTypeNo?: number;
  deviceTypeParentNo: number;
  deviceState?: number;
  stateCode?: number;
}
// 远程操控
export interface remoteOperationAddParams {
  deviceId?: number;
  remoteControlCode?: number;
}

export interface pointDetail {
  id: string;
}
export interface parentChilds {
  deviceTypeNo: number;
}
// 设备导出
export async function exportDevice(params: exportParamsType): Promise<any> {
  return request('/v1/device/export', {
    method: 'GET',
    responseType: 'blob',
    params,
  });
}

// 二维码导出
export async function exportQr(params: exportParamsType): Promise<any> {
  return request('/v1/device/exportQrCode', {
    method: 'GET',
    params,
    responseType: 'blob',
  });
}

// 下载excel模板
export async function downloadExcel(): Promise<any> {
  return request('/v1/download/template/download', {
    method: 'GET',
    responseType: 'blob',
  });
}
// 故障点位详情
export async function problemPointDetails(params: pointDetail): Promise<any> {
  return request('/v1/device/selectDeviceInfo', {
    method: 'GET',
    params
  });
}

// 根据选择父级
export async function matchChildsByParents(params: parentChilds): Promise<any> {
  return request('/v1/device/deviceType/queryByFatherNo', {
    method: 'GET',
    params
  });
}

// POST /v1/introduce/importExcel/import
// 导入excel
export async function importExcel(data: File): Promise<any> {
  return request('/v1/introduce/importExcel/import', {
    method: 'POST',
    data
  });
}

// 远程操控
export async function remoteOperationAdd(params: remoteOperationAddParams): Promise<any> {
  return request('/v1/log/remoteOperation/add', {
    method: 'POST',
    params,
  });
}
// 远程操控查询
export async function remoteOperation(params: any): Promise<any> {
  return request(`/v1/log/remoteOperation/${params}`, {
    method: 'GET',
  });
}
