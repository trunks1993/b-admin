import request from '@/utils/request';
import { QueryBase } from './base';

export interface QueryListParamsType extends QueryBase {
  deviceId: number; // 资产编号
  deviceName?: string; // 设备名称
  deviceFuTypeNo?: string; // 设备资产类型编号
  deviceTypeNo?: string; // 设备资产类型编号
  startTime?: string; // 开始采集时间
  endTime?: string; // 结束采集时间
}

export interface QueryStatisticsParamsType {
  deviceTypeNo: string; // 设备资产类型编号
}


// 设备类型父类查询
export async function deviceType(): Promise<any> {
  return request('/v1/device/deviceType/selectDeviceTypeByDict', {
    method: 'GET',
  });
}
export async function longDeviceType(): Promise<any> {
  return request('/v1/device/deviceType/selectDeviceParentType', {
    method: 'GET',
  });
}
// 统计报表-环境信息
export interface EnvironmentDetailParamsType extends QueryBase {
  deviceId: number; // 资产编号
  startTime?: string; // 开始采集时间
  endTime?: string; // 结束采集时间
}

export async function environmentDetail(params: EnvironmentDetailParamsType): Promise<any> {
  return request('/v1/log/environmentInfo/lookByEnvironmentInfo', {
    method: 'GET',
    params,
  });
}

export async function environmentList(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/environmentInfo/queryByEnvironmentInfo', {
    method: 'GET',
    params,
  });
}

export async function environmentStatistics(params: QueryStatisticsParamsType): Promise<any> {
  return request('/v1/log/environmentInfo/selectByEnvironmentInfo', {
    method: 'GET',
    params,
  });
}
// 环境信息列表-导出Excel
export async function environmentInfoExport(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/environmentInfo/export', {
    method: 'GET',
    params,
  });
}
// 环境信息详情-导出Excel
export async function environmentInfoExportInfo(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/environmentInfo/exportInfo', {
    method: 'GET',
    params,
  });
}
// 统计报表-戒毒医疗
export interface DrugMedicalDetailParamsType extends QueryBase {
  deviceId: number; // 资产编号
  checkObject?: string; // 监测对象
  checkUserName?: string; // 人员姓名
  checkSex?: string; // 人员性别
  operateName?: string; // 操作人员姓名
  startTime?: string; // 开始采集时间
  endTime?: string; // 结束采集时间
}

export async function drugMedicalDetail(params: DrugMedicalDetailParamsType): Promise<any> {
  return request('/v1/log/drugMedical/lookByDrugMedical', {
    method: 'GET',
    params,
  });
}

export async function drugMedicalList(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/drugMedical/queryByDrugMedical', {
    method: 'GET',
    params,
  });
}

export async function drugMedicalStatistics(params: QueryStatisticsParamsType): Promise<any> {
  return request('/v1/log/drugMedical/selectByDrugMedical', {
    method: 'GET',
    params,
  });
}
// 戒毒医疗列表-导出Excel
export async function drugListEx(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/drugMedical/export', {
    method: 'GET',
    params,
  });
}
// 戒毒医疗详情-导出Excel
export async function drugMedicalExportInfo(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/drugMedical/exportInfo', {
    method: 'GET',
    params,
  });
}
// 统计报表-能耗监测
export interface ByenergyConsumptionDetailParamsType extends QueryBase {
  deviceId: number; // 资产编号
  treeTypeName?: string; // 安装区域
  startTime?: string; // 开始采集时间
  endTime?: string; // 结束采集时间
}

export async function byenergyConsumptionDetail(
  params: ByenergyConsumptionDetailParamsType,
): Promise<any> {
  return request('/v1/log/energyConsumption/lookByenergyConsumption', {
    method: 'GET',
    params,
  });
}

export async function byenergyConsumptionList(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/energyConsumption/queryByEnergyConsumption', {
    method: 'GET',
    params,
  });
}

export async function byenergyConsumptionStatistics(
  params: QueryStatisticsParamsType,
): Promise<any> {
  console.log(params);
  return request('/v1/log/energyConsumption/selectByEnergyConsumption', {
    method: 'GET',
    params,
  });
}
// 能耗监测列表导出
export async function energyConsumptionExport(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/energyConsumption/export', {
    method: 'GET',
    params,
  });
}
// 能耗监测详情导出
export async function energyConsumptionExportInfo(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/energyConsumption/exportInfo', {
    method: 'GET',
    params,
  });
}
// 统计报表-生命体征
export interface VitalSignsDetailParamsType extends QueryBase {
  deviceId: number; // 资产编号
  userName?: string; // 测试人员姓名
  startTime?: string; // 开始采集时间
  endTime?: string; // 结束采集时间
}

export async function vitalSignsDetail(params: VitalSignsDetailParamsType): Promise<any> {
  return request('/v1/log/vitalSigns/lookByVitalSigns', {
    method: 'GET',
    params,
  });
}

export async function vitalSignsList(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/vitalSigns/queryByVitalSigns', {
    method: 'GET',
    params,
  });
}

export async function vitalSignsStatistics(params: QueryStatisticsParamsType): Promise<any> {
  return request('/v1/log/vitalSigns/selectByVitalSigns', {
    method: 'GET',
    params,
  });
}
// 生命体征列表导出
export async function vitalSignsExport(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/vitalSigns/export', {
    method: 'GET',
    params,
  });
}
// 生命体征详情导出
export async function vitalSignsExportInfo(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/vitalSigns/exportInfo', {
    method: 'GET',
    params,
  });
}
// 统计报表-位置信息
export interface PositionDetailParamsType extends QueryBase {
  deviceId: number; // 资产编号
  userName?: string; // 测试人员姓名
  startTime?: string; // 开始采集时间
  endTime?: string; // 结束采集时间
}

export async function positionDetail(params: PositionDetailParamsType): Promise<any> {
  return request('/v1/log/positionInfo/lookByPositionInfo', {
    method: 'GET',
    params,
  });
}

export async function positionList(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/positionInfo/queryByPositionInfo', {
    method: 'GET',
    params,
  });
}

export async function positionStatistics(params: QueryStatisticsParamsType): Promise<any> {
  return request('/v1/log/positionInfo/selectByPositionInfo', {
    method: 'GET',
    params,
  });
}
// 能耗监测列表导出
export async function positionInfoExport(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/positionInfo/export', {
    method: 'GET',
    params,
  });
}
// 能耗监测详情导出
export async function positionInfoExportInfo(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/positionInfo/exportInfo', {
    method: 'GET',
    params,
  });
}
// 统计报表-物品信息
export interface GoodsDetailParamsType extends QueryBase {
  deviceId: number; // 资产编号
  goodsName?: string; // 物品名称
  goodsType?: string; // 物品种类
  goodsState?: string; // 物品状态
  startTime?: string; // 开始采集时间
  endTime?: string; // 结束采集时间
}

export async function goodsDetail(params: GoodsDetailParamsType): Promise<any> {
  return request('/v1/log/goodsInfo/lookByGoodsInfo', {
    method: 'GET',
    params,
  });
}

export async function goodsList(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/goodsInfo/queryByGoodsInfo', {
    method: 'GET',
    params,
  });
}

export async function goodsStatistics(params: QueryStatisticsParamsType): Promise<any> {
  return request('/v1/log/goodsInfo/selectByGoodsInfo', {
    method: 'GET',
    params,
  });
}
// 物品信息列表导出
export async function goodsInfoExport(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/goodsInfo/export', {
    method: 'GET',
    params,
  });
}
// 物品信息详情导出
export async function goodsInfoExportInfo(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/goodsInfo/exportInfo', {
    method: 'GET',
    params,
  });
}
// 统计报表-运动康复
export interface SportsRecoveryDetailParamsType extends QueryBase {
  deviceId: number; // 资产编号
  goodsName?: string; // 物品名称
  goodsType?: string; // 物品种类
  goodsState?: string; // 物品状态
  startTime?: string; // 开始采集时间
  endTime?: string; // 结束采集时间
}

export async function sportsRecoveryDetail(params: GoodsDetailParamsType): Promise<any> {
  return request('/v1/log/sportsRecovery/lookBySportsRecovery', {
    method: 'GET',
    params,
  });
}

export async function sportsRecoveryList(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/sportsRecovery/queryBySportsRecovery', {
    method: 'GET',
    params,
  });
}

export async function sportsRecoveryStatistics(params: QueryStatisticsParamsType): Promise<any> {
  return request('/v1/log/sportsRecovery/selectBySportsRecovery', {
    method: 'GET',
    params,
  });
}
// 运动康复列表导出
export async function sportsRecoveryExport(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/sportsRecovery/export', {
    method: 'GET',
    params,
  });
}
// 运动康复详情导出
export async function sportsRecoveryExportInfo(params: QueryListParamsType): Promise<any> {
  return request('/v1/log/sportsRecovery/exportInfo', {
    method: 'GET',
    params,
  });
}
// 统计报表-设备
export interface DeviceStatisticsParamsType extends QueryBase {
  deviceTypeId: number; // 资产编号
  deviceSonTypeId: number; // 物品名称
}

export interface DeviceListParamsType extends QueryBase {
  deviceId: number; // 资产编号
  deviceName?: string; // 设备名称
  deviceTypeId?: number; // 资产类别
  deviceSonTypeId?: number; // 资产子类
  deviceState?: number; // 设备状态
  stateCode?: number; // 在线状态
  startTime?: string; // 开始采集时间
  endTime?: string; // 结束采集时间
}

// 设备统计分页查询
export async function deviceList(params: DeviceStatisticsParamsType): Promise<any> {
  return request('/v1/statistical/Statistical/selectByDc', {
    method: 'GET',
    params,
  });
}
export async function deviceStatistics(params: DeviceStatisticsParamsType): Promise<any> {
  return request('/v1/statistical/Statistical/selectCountsVo', {
    method: 'GET',
    params,
  });
}
// 设备明细查询
export async function deviceDetail(params: DeviceListParamsType): Promise<any> {
  return request('/v1/statistical/Statistical/selectByInfo', {
    method: 'GET',
    params,
  });
}

// 设备统计-导出Excel
export async function deviceStatisticsEx(params: DeviceStatisticsParamsType): Promise<any> {
  return request('/v1/statistical/Statistical/exportDc', {
    method: 'GET',
    params,
  });
}
// 设备明细-导出Excel
export async function deviceListEx(params: DeviceListParamsType): Promise<any> {
  return request('/v1/statistical/Statistical/exportInfo', {
    method: 'GET',
    params,
  });
}
//资产种类
export async function deviceKinds(params: QueryListParamsType): Promise<any> {
  return request('/v1/device/deviceType/queryByFatherNo', {
    method: 'GET',
    params,
  });
}
// 设备统计 设备-近12个月设备统计分析
export async function infosDevice(params: QueryListParamsType): Promise<any> {
  return request('/v1/device/monitorAnalyze/infosDevice', {
    method: 'GET',
    params,
  });
}
// 设备统计 设备-设备统计分析
export async function infosDeviceCounts(params: QueryListParamsType): Promise<any> {
  return request('/v1/device/monitorAnalyze/infosDeviceCounts', {
    method: 'GET',
    params,
  });
}
// 设备统计 设备-设备统计分析
export async function infosDevices(params: QueryListParamsType): Promise<any> {
  return request('/v1/device/monitorAnalyze/infosDevices', {
    method: 'GET',
    params,
  });
}
// 树形表
export async function treeTypeSelectAll(params: QueryListParamsType): Promise<any> {
  return request('/v1/device/treeType/selectAll', {
    method: 'GET',
    params,
  });
}



