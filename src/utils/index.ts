/*
 * @Date: 2020-05-05 15:29:43
 * @LastEditTime: 2020-05-08 15:30:11
 */
import { parse } from 'querystring';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

interface TreeDataItem {
  code: number;
  name: string;
  isLeaf: 'Y' | 'N';
  level: number;
  parentCode: number;
  children: TreeDataItem[];
  value: number;
  label: string;
}

/**
 * @name:
 * @param {type} arr
 * @param {type} callback
 */
export const listToTree = (arr: TreeDataItem[], callback: (item: TreeDataItem) => void) => {
  const tree = [];
  const setData = {};
  // 根据id建立索引
  const filterList = arr.filter(item => {
    const isNotRoot = item.parentCode;
    if (isNotRoot) setData[item.code] = item;
    return isNotRoot;
  });
  // 利用对象引用类型数据
  for (const val in setData) {
    var obj = setData[val];
    // 访问者模式
    callback(obj);
    const currentPid = obj.parentCode;
    const parent = setData[currentPid];
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(obj);
    } else {
      tree.push(obj);
    }
  }
  return tree;
};
