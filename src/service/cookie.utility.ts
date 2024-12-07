const EQUAL = '=';
const SEMICOLON = ';';

export const parseCookie = (cookie: string = ''): Map<string, string> => {
    const cookieMap = new Map<string, string>();
    const cookies = cookie.split(SEMICOLON);

    cookies.forEach((c: string) => {
        const keyValue = c.split(EQUAL);
        cookieMap.set(keyValue[0], keyValue[1]);
    });

    return cookieMap;
};
