import React from 'react';
import dashboard from '@/assets/images/global/dashboard.png';

export default () => (
  <div
    style={{
      height: '100%',
      background: 'rgb(246, 245, 250)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <img src={dashboard} style={{ position: 'relative', top: '-50px' }} />
    <div
      style={{
        fontSize: '18px',
        color: '#313C8B',
        fontWeight: 'bold',
        position: 'relative',
        top: '-50px',
      }}
    >
      欢迎进入星权益业务运营系统！
    </div>
  </div>
);
