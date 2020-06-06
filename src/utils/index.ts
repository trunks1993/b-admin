/*
 * @Date: 2020-05-05 15:29:43
 * @LastEditTime: 2020-06-04 19:53:27
 */
import { parse } from 'querystring';
import _ from 'lodash';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export interface TreeDataItem {
  code: number;
  name: string;
  isLeaf: 'Y' | 'N';
  level: number;
  parentCode: number;
  children: TreeDataItem[];
  value: number;
  label: string;
}

export interface TreeDataItem2 {
  id: number;
  key: number;
  title: string;
  children: TreeDataItem2[];
  value: number;
  label: string;
}

/**
 * @name:
 * @param {type} arr
 * @param {type} callback
 */
export const listToTree = (arr: TreeDataItem[], callback?: (item: TreeDataItem) => void) => {
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
    callback && callback(obj);
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

export const loopTree = (arr: TreeDataItem2[], callback?: (item: TreeDataItem2) => void) => {
  return _.map(arr, item => {
    callback && callback(item);
    if (item.children && item.children.length > 0) loopTree(item.children, callback);
    return item;
  });
};

export const getSonsTree = (arr: TreeDataItem[], code: number) => {
  var temp = [],
    lev = 0;

  var forFn = function(arr, code, lev) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.parentCode == code) {
        item.lev = lev;
        temp.push(item.code);
        forFn(arr, item.code, lev + 1);
      }
    }
  };

  forFn(arr, code, lev);

  return temp;
};

export const getFather = (arr: TreeDataItem[], code: number) => {
  return arr.find(item => item.code === code)?.parentCode;
};

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getFloat = (number: string | number, n?: number) => {
  let num = parseFloat(number);
  n = n ? n : 0;
  if (n <= 0) {
    return Math.round(number);
  }
  num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
  num = parseFloat(num).toFixed(n); //补足位数
  return num;
};
