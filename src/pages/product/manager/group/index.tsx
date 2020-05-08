import React from 'react';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';

const Comp:React.FC = () => <div>Comp</div>
export default connect(({}: ConnectState) => ({}))(Comp);