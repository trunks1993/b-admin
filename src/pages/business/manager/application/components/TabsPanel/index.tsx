import React from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

interface TabsPanelProps {
  onChange?: (activeKey: string) => void;
}

const TabsPanel: React.FC<TabsPanelProps> = props => {
  const { onChange, children } = props;
  return (
    <Tabs onChange={onChange} type="card">
      <TabPane tab="接口配置" key="1">
        {children}
      </TabPane>
      <TabPane tab="异常监控" key="2">
        {children}
      </TabPane>
    </Tabs>
  );
};

export default TabsPanel;
