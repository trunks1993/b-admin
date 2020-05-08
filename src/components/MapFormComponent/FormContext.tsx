import { createContext } from 'react';

export interface FormContextProps {}

const LoginContext: React.Context<FormContextProps> = createContext({});

export default LoginContext;
