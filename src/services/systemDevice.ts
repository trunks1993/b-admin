import request from '@/utils/request';
import { QueryBase } from './base';
import { string } from 'prop-types';

export interface QueryDeviceListParamsType extends QueryBase {
  roleId?: string; // 角色编号
  parentId?: string; // 角色名称
}
// 设备权限管理-分页查询
export async function applyDeviceLists(params: QueryDeviceListParamsType): Promise<any> {
  return request('/v1/role/roleDevicePower/allot', {
    method: 'get',
    params,
  });
}
export interface QueryDeviceTreeDataType {
  roleId: string; // 角色编号
}
// 设备权限管理- 树形结构数据
export async function applyDeviceTreeData(params: QueryDeviceTreeDataType): Promise<any> {
  return request('/v1/role/roleDevicePower/allot', {
    method: 'get',
    params,
  });
}
export interface QueryPostAddDevice {
  sreRoleId: number; // 角色编号
  roleDeviceIdList: []; //设备集合
}
// 设备权限管理新增
export async function postAddDevice(data: QueryPostAddDevice): Promise<any> {
  return request('/v1/role/roleDevicePower/add', {
    method: 'post',
    data,
  });
}

// 字典管理
// 带条件分页查询
export async function getDictDataList(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictData/list', {
    method: 'GET',
    params,
  });
}
// 修改字典数据
export async function putDictDataEdit(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictData/edit', {
    method: 'PUT',
    params,
  });
}
// 新增字典数据
export async function postDictDataAdd(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictData/add', {
    method: 'POST',
    params,
  });
}
// 删除字典数据（批量删除
export async function deleteDictDataRemove(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictData/remove', {
    method: 'DELETE',
    params,
  });
}
// 根据字典类型查询相关字典值数据
export async function getDictDataSelectByDictType(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictData/selectByDictType', {
    method: 'GET',
    params,
  });
}
// 字典数据类型
// 新增字典类型
export async function postDictTypeAdd(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictType/add', {
    method: 'POST',
    params,
  });
}
// 查询字典类型下拉框
export async function getDictTypeDown(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictType/down', {
    method: 'GET',
    params,
  });
}
// 修改字典类型
export async function putDictTypeEdit(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictType/edit', {
    method: 'PUT',
    params,
  });
}
// 带条件分页查询
export async function getDictTypeList(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictType/list', {
    method: 'GET',
    params,
  });
}
// 删除字典类型（批量删除）
export async function deleteDictTypeRemove(params: QueryPostAddDevice): Promise<any> {
  return request('/v1/dictionaries/dictType/remove', {
    method: 'DELETE',
    params,
  });
}

// 用户管理--用户状态
export async function userStatus(params: any): Promise<any> {
  return request('/v1/dictionaries/dictData/selectByDictType', {
    method: 'GET',
    params,
  });
}

// 用户管理--list
export async function userList(params: any): Promise<any> {
  return request('/v1/api/user/SysUser/list', {
    method: 'GET',
    params,
  });
}
// 用户管理--删除
export async function deleteUser(params: any): Promise<any> {
  return request('/v1/api/user/SysUser/remove', {
    method: 'delete',
    params,
  });
}
// 用户管理--新增
export async function addUser(params: any): Promise<any> {
  return request('/v1/api/user/SysUser/insertByUser', {
    method: 'post',
    params,
  });
}
// 用户管理--重置
export async function resetUserPwd(params: any): Promise<any> {
  return request('/v1/api/user/SysUser/resetPwd', {
    method: 'post',
    params,
  });
}
// 用户管理--修改
export async function updateSysUser(params: any): Promise<any> {
  return request('/v1/api/user/SysUser/updateSysUser', {
    method: 'put',
    params,
  });
}
// 部门管理--列表(用户新增下拉查询)
export async function deptListSelect(params: any): Promise<any> {
  return request('/v1/api/dept/SysDept/selectDeptAll', {
    method: 'get',
    params,
  });
}
// 部门管理--列表
export async function deptList(params: any): Promise<any> {
  return request('/v1/api/dept/SysDept/list', {
    method: 'get',
    params,
  });
}
// 部门管理--删除
export async function deleteDept(params: any): Promise<any> {
  return request('/v1/api/dept/SysDept/remove', {
    method: 'delete',
    params,
  });
}
// 部门管理--新增
export async function addDept(params: any): Promise<any> {
  return request('/v1/api/dept/SysDept/addSave', {
    method: 'post',
    params,
  });
}
// 部门管理--修改查询
export async function selectDept(params: any): Promise<any> {
  return request('/v1/api/user/SysUser/edit/{userId}', {
    method: 'get',
    params,
  });
}
// 部门管理--修改
export async function editDept(params: any): Promise<any> {
  return request('/v1/api/dept/SysDept/edit', {
    method: 'put',
    params,
  });
}

//角色管理
//查询角色条件约束
export interface RoleList {
  roleName: string; //角色名称
  status: number; //角色状态:0正常,1禁用
  roleKey: string; //角色权限字符串
  dataScope: string; //数据范围（1：所有数据权限；2：自定数据权限）
}
//查询角色
export async function queryRoleList(params: RoleList): Promise<any> {
  return request('/v1/role/list', {
    method: 'GET',
    params,
  });
}

export interface RoleInfo {
  roleId: number; //角色id
}
//根据角色id查询详情 /v1/role/queryByRoleId
export async function queryByRoleInfo(params: RoleInfo): Promise<any> {
  return request('/v1/role/queryByRoleId', {
    method: 'GET',
    params,
  });
}
//根据角色查询用户约束
export interface RoleUser {
  roleId: number; //角色id
  pageNum: number; //页码
  pageSize: number; //每页显示条数
}
//根据角色查询用户 v1/role/selectByUser
export async function queryByRoleUser(params: RoleUser): Promise<any> {
  return request('/v1/role/selectByUser', {
    method: 'GET',
    params,
  });
}
//新增角色用户约束
export interface InRoleUser {
  roleId: number; //角色id
  userIds: string;
}
//新增角色用户   v1/role/insertUserRole
export async function insertUserRole(params: InRoleUser): Promise<any> {
  return request('/v1/role/insertUserRole', {
    method: 'POST',
    params,
  });
}

//修改角色约束
export interface Role {
  roleId: number; //角色id
  userIds: string;
  menuIds: {}; //菜单id
  roleName: string;
  roleKey: string; //角色权限字符串
  roleSort: number; //显示顺序
  dataScope: string;
  status: string; //角色状态 0 正常,1禁用
  remark: string; //备注
}
//修改角色
export async function updateRole(params: Role): Promise<any> {
  return request('/v1/role/update', {
    method: 'POST',
    params,
  });
}

//新增角色   /v1/role/add
export async function insertRole(params: Role): Promise<any> {
  return request('/v1/role/add', {
    method: 'POST',
    params,
  });
}

//删除角色   RoleInfo

export async function deleteRole(params: RoleInfo): Promise<any> {
  return request('/v1/role/delete', {
    method: 'DELETE',
    params,
  });
}

//删除角色用户约束
export interface DeleteRoleUser {
  surRoleId: number; //角色id
  surUserIds: {};
}
//删除角色用户
export async function deleteRoleUser(params: DeleteRoleUser): Promise<any> {
  return request('/v1/role/deleteUserRole', {
    method: 'DELETE',
    params,
  });
}

//查询未分配用户角色列表约束
export interface unallocatedRoleUser {
  roleId: number; //角色id
  surLoginName?: string; //用户名称
  surPhoneNumber?: string; //手机号码
  pageNum: number; //页码
  pageSize: number; //每页显示条数
}
//查询未分配用户角色列表
export async function unallocatedList(params: unallocatedRoleUser): Promise<any> {
  return request('/v1/role/authUser/unallocatedList', {
    method: 'GET',
    params,
  });
}
//  查询已分配用户角色列表
export async function allocatedList(params: unallocatedRoleUser): Promise<any> {
  return request('/v1/role/authUser/allocatedList', {
    method: 'GET',
    params,
  });
}
//角色名称校验约束
export interface checkRoleName {
  roleId?: number; //角色id
  roleName: string; //角色名称
}
//角色名称校验
export async function checkRoleName(params: checkRoleName): Promise<any> {
  return request('/v1/role/checkRoleName', {
    method: 'GET',
    params,
  });
}

//
//菜单约束
export interface system {
  systemId: string; //系统ID
}
//菜单
export async function listBySystemId(params: system): Promise<any> {
  return request('/v1/menu/listBySystemId', {
    method: 'GET',
    params,
  });
}
//菜单
export async function menuListBySystemId(params: system): Promise<any> {
  return request('/v1/menu/list', {
    method: 'GET',
    params,
  });
}

//菜单管理--列表
export async function menuList(params: any): Promise<any> {
  return request('/v1/menu/queryByList', {
    method: 'get',
    params,
  });
}

//菜单管理--删除
export async function deleteMenu(params: any): Promise<any> {
  return request('/v1/menu/delete', {
    method: 'DELETE',
    params,
  });
}

//菜单管理--新增
export async function addMenu(params: any): Promise<any> {
  return request('/v1/menu/add', {
    method: 'put',
    params,
  });
}

//菜单管理--修改
export async function editorMenu(params: any): Promise<any> {
  return request('/v1/menu/edit', {
    method: 'put',
    params,
  });
}

//菜单管理--修改查询
export async function queryEditorMenu(params: any): Promise<any> {
  return request('/v1/menu/queryByMenuId', {
    method: 'get',
    params,
  });
}

export interface PostMenu {
  menuIds: Array<any>; //菜单id集合
  roleId: number; //角色编号
  bxMenuId: string;
}
export async function postAddMenu(params: PostMenu): Promise<any> {
  return request('/v1/role/inertRoleMenu', {
    method: 'POST',
    params,
  });
}


//设备权限--查询
export async function queryPower(params: any): Promise<any> {
  return request('/v1/role/roleDevicePower/select', {
    method: 'get',
    params,
  });
}
//设备权限--删除
export async function deletePower(params: any): Promise<any> {
  return request('/v1/role/roleDevicePower/remove', {
    method: 'delete',
    params,
  });
}
//设备权限--新增查询
export async function queryChildPower(params: any): Promise<any> {
  return request('/v1/role/roleDevicePower/allot', {
    method: 'get',
    params,
  });
}
//设备权限--添加
export async function addChildPower(data: any): Promise<any> {
  console.log(data)
  return request('/v1/role/roleDevicePower/add', {
    method: 'post',
    data,
  });
}

//分配角色--查询
export async function queryRole(params: any): Promise<any> {
  return request('/v1/userRole/list', {
    method: 'get',
    params,
  });
}
//分配角色--新增查询
export async function queryChildRole(params: any): Promise<any> {
  return request('/v1/userRole/listNoAuthorize', {
    method: 'get',
    params,
  });
}
