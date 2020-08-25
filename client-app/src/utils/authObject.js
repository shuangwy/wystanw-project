import jscookie from 'js-cookie';

export default () => {
    const cookieToken = jscookie.get('auth.token') || false;
    const cookieSysid = jscookie.get('auth.sysid') || false;
    const cookiePermit = jscookie.get('auth.permit') || false;

    return {
        'auth.token': cookieToken,
        'auth.sysid': cookieSysid,
        'auth.permit': cookiePermit
    };
};