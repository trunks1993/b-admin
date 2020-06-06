import React from 'react';
import { Tabs } from 'antd';
import { RECHARGE_STATUS_1, RechargeStatus, RECHARGE_STATUS_2, RECHARGE_STATUS_3 } from '@/const';
const { TabPane } = Tabs;

interface TabsPanelProps {
  onChange?: (activeKey: string) => void;
}

const TabsPanel: React.FC<TabsPanelProps> = props => {
  const { onChange, children } = props;
  return (
    <Tabs className="global-tabs" onChange={onChange} type="card" defaultActiveKey="">
      <TabPane tab="全部" key="">
        {children}
      </TabPane>
      <TabPane tab={RechargeStatus[RECHARGE_STATUS_1]} key={RECHARGE_STATUS_1.toString()}>
        {children}
      </TabPane>
      <TabPane tab={RechargeStatus[RECHARGE_STATUS_2]} key={RECHARGE_STATUS_2.toString()}>
        {children}
      </TabPane>
      <TabPane tab={RechargeStatus[RECHARGE_STATUS_3]} key={RECHARGE_STATUS_3.toString()}>
        {children}
      </TabPane>
    </Tabs>
  );
};

export default TabsPanel;
