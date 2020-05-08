import Cookies from 'js-cookie';

const TokenKey: string = 'token';

export const getToken: () => string = () => Cookies.get(TokenKey);

export const setToken: (arg0: string) => void = token => Cookies.set(TokenKey, token);

export const removeToken: () => void = () => Cookies.remove(TokenKey);
