import request from '@/utils/request';

export interface DictParamsType {
  dictType: string;
}

// 获取设备详情
export async function getDictType(params: DictParamsType): Promise<any> {
  return request('/v1/dictionaries/dictData/selectByDictType', {
    method: 'GET',
    params,
  });
}

// 获取部门信息
export async function getDept(): Promise<any> {
  return request('/v1/api/dept/SysDept/selectDeptAll', {
    method: 'GET',
  });
}

// 获取部门信息
export async function getAreaOptions(): Promise<any> {
  return request('/v1/device/treeType/selectByParent', {
    method: 'GET',
  });
}
