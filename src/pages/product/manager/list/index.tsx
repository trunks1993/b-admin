import React from 'react';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';

const Comp:React.FC = ({test}) => <div>{test}</div>
export default connect(({ role }: ConnectState) => ({
    test: role.test
}))(Comp);