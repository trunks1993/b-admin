import React from 'react';
import { Tabs } from 'antd';
import { ORDER_STATUS_1, OrderStatus, ORDER_STATUS_2, ORDER_STATUS_4 } from '@/const';
const { TabPane } = Tabs;

interface TabsPanelProps {
  onChange?: (activeKey: string) => void;
}

const TabsPanel: React.FC<TabsPanelProps> = props => {
  const { onChange, children } = props;
  return (
    <Tabs onChange={onChange} type="card" defaultActiveKey="">
      <TabPane tab="全部" key="">
        {children}
      </TabPane>
      <TabPane tab={OrderStatus[ORDER_STATUS_1]} key={ORDER_STATUS_1.toString()}>
        {children}
      </TabPane>
      <TabPane tab={OrderStatus[ORDER_STATUS_2]} key={ORDER_STATUS_2.toString()}>
        {children}
      </TabPane>
      <TabPane tab={OrderStatus[ORDER_STATUS_4]} key={ORDER_STATUS_4.toString()}>
        {children}
      </TabPane>
    </Tabs>
  );
};

export default TabsPanel;
