import { COOKIE_SESSION_SECRET_KEYS } from '../helpers/constant.helper';

const cookieOptions: CookieSessionInterfaces.CookieSessionOptions = {
  name: 'session',
  keys: COOKIE_SESSION_SECRET_KEYS.split(','),
  maxAge: 24 * 60 * 60 * 1000,
};

export default cookieOptions;
