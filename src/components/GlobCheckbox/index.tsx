import React from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import _ from 'lodash';

interface GlobalCheckboxProps {
  title: string;
  onChange?: (value: string | boolean) => void;
  keyMap?: [string, string];
  value?: string | boolean;
}

class GlobalCheckbox extends React.Component<GlobalCheckboxProps> {
  handleCheckChange = (e: CheckboxChangeEvent) => {
    const { onChange, keyMap } = this.props;
    let newVal =
      keyMap && keyMap.length === 2 ? (e.target.checked ? keyMap[0] : keyMap[1]) : e.target.checked;
      onChange && onChange(newVal);
  };
  render() {
    const { title, value, keyMap } = this.props;
    const type = typeof value;
    
    if (type === 'boolean' || type === 'undefined') {
      return (
        <Checkbox checked={!!value} onChange={this.handleCheckChange}>
          {title}
        </Checkbox>
      );
    } else {
      if (_.isUndefined(keyMap) || keyMap.length !== 2) {
        throw new Error('value type is not boolean but the keyMap is undefined');
      } else {
        const index = keyMap.findIndex(item => item === value);
        return (
          <Checkbox checked={index === 0 ? true : false} onChange={this.handleCheckChange}>
            {title}
          </Checkbox>
        );
      }
    }
  }
}

export default GlobalCheckbox;
