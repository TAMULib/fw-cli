const EQUAL = '=';
const SEMICOLON = ';';

export const parseCookie = (cookie: string = ''): Map<string, string> => {
    const cookieMap = new Map<string, string>();
    const cookies = cookie.split(SEMICOLON);

    for (let i = 0; i <= cookies.length; ++i) {
        const keyValue = cookies[i].split(EQUAL);
        cookieMap.set(keyValue[0], keyValue[1])
    }

    return cookieMap;
};
