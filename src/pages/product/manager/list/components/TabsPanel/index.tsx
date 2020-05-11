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
      <TabPane tab="全部" key="1">
        {children}
      </TabPane>
      <TabPane tab="销售中" key="2">
        {children}
      </TabPane>
      <TabPane tab="已售罄" key="3">
        {children}
      </TabPane>
      <TabPane tab="仓库中" key="4">
        {children}
      </TabPane>
    </Tabs>
  );
};

export default TabsPanel;
