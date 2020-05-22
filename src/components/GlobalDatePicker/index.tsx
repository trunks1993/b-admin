import React from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';

class GlobalDatePicker extends React.Component<{
  value?: string;
  onChange?: (t: string) => void;
}> {
  handleDateChange = (date: Moment | null, dateString: string) => {
    const { onChange } = this.props;
    onChange && onChange(dateString);
  };
  render() {
    const { value } = this.props;
    // 请注意，我们可能还会传递其他属性
    return (
      <DatePicker
        {...this.props}
        value={value ? moment(value) : null}
        onChange={this.handleDateChange}
      />
    );
  }
}

export default GlobalDatePicker;
