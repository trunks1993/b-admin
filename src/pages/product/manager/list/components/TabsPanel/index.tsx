import React from 'react';
import { Tabs } from 'antd';
import { PRODUCT_STATUS_1, ProductStatus, PRODUCT_STATUS_2, PRODUCT_STATUS_3 } from '@/const';
const { TabPane } = Tabs;

interface TabsPanelProps {
  onChange?: (activeKey: string) => void;
}

const TabsPanel: React.FC<TabsPanelProps> = props => {
  const { onChange, children } = props;
  return (
    <Tabs className="global-tabs" onChange={onChange} type="card">
      <TabPane tab="全部" key="">
        {children}
      </TabPane>
      <TabPane tab={ProductStatus[PRODUCT_STATUS_1]} key={PRODUCT_STATUS_1.toString()}>
        {children}
      </TabPane>
      <TabPane tab={ProductStatus[PRODUCT_STATUS_2]} key={PRODUCT_STATUS_2.toString()}>
        {children}
      </TabPane>
      <TabPane tab={ProductStatus[PRODUCT_STATUS_3]} key={PRODUCT_STATUS_3.toString()}>
        {children}
      </TabPane>
    </Tabs>
  );
};

export default TabsPanel;
