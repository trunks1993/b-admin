import React from 'react';
import { TreeSelect } from 'antd';
import { TreeDataItem2 } from '@/utils';
const { SHOW_PARENT } = TreeSelect;

interface GlobalTreeSelectProps {
  treeData: TreeDataItem2[];
  value: string[];
  onChange?: (value: string[]) => void;
}

class GlobalTreeSelect extends React.Component<GlobalTreeSelectProps> {
  handleChange = (value: string[]) => {
    const { onChange } = this.props;
    onChange && onChange(value);
  };

  render() {
    const { treeData, value, onChange } = this.props;
    const tProps = {
      treeData,
      value,
      onChange: this.handleChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '选择所属品牌',
    };
    return <TreeSelect getPopupContainer={triggerNode => triggerNode.parentNode} {...tProps} />;
  }
}

export default GlobalTreeSelect;
