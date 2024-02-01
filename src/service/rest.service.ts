const fetch = require('node-fetch');

import { config } from '../config';

export class RestService {

  public request(url: string, options: any): any {
    return fetch(url, options);
  }

  public get(url: string, contentType: string = 'application/json', accept: string | string[] = [ 'application/json', 'text/plain' ]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(url, {
        method: 'get',
        redirect: 'follow',
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType,
          'Accept': accept
        }
      })
      .then(async (response: any) => {
        if (!!response && response.status >= 200 && response.status <= 299) {
          if (!!response.headers && response.headers.get('content-type') == 'application/json') {
            resolve(await response.json());
          } else {
            resolve(await response.text());
          }
        } else {
          let text = 'Response variable is undefined.';
          if (!!response) {
            if (!!response.headers && response.headers.get('content-type') == 'application/json') {
              text = await response.json();
            } else {
              text = await response.text();
              if (!!response.statusText) {
                text += ' ' + response.statusText;
              }
            }
          }
          console.log('failed get', url);
          reject(text);
        }
      }).catch((error: any) => {
        console.log('failed get', url);
        reject(error);
      });
    });
  }

  public post(url: string, json: any, contentType: string = 'application/json', accept: string | string[] = [ 'application/json', 'text/plain' ]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(url, {
        method: 'post',
        redirect: 'follow',
        body: json,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType,
          'Accept': accept
        }
      }).then(async (response: any) => {
        if (!!response && response.status >= 200 && response.status <= 299) {
          if (!!response.headers && response.headers.get('content-type') == 'application/json') {
            resolve(await response.json());
          } else {
            resolve(await response.text());
          }
        } else {
          let text = 'Response variable is undefined.';
          if (!!response) {
            if (!!response.headers && response.headers.get('content-type') == 'application/json') {
              text = await response.json();
            } else {
              text = await response.text();
              if (!!response.statusText) {
                text += ' ' + response.statusText;
              }
            }
          }
          console.log('failed post', url);
          reject(text);
        }
      }).catch((error: any) => {
        console.log('failed post', url);
        reject(error);
      });
    });
  }

  public put(url: string, json: any, contentType: string = 'application/json', accept: string | string[] = [ 'application/json', 'text/plain' ]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(url, {
        method: 'put',
        redirect: 'follow',
        body: json,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType,
          'Accept': accept
        }
      }).then(async (response: any) => {
        if (!!response && response.status >= 200 && response.status <= 299) {
          if (!!response.headers && response.headers.get('content-type') == 'application/json') {
            resolve(await response.json());
          } else {
            resolve(await response.text());
          }
        } else {
          let text = 'Response variable is undefined.';
          if (!!response) {
            if (!!response.headers && response.headers.get('content-type') == 'application/json') {
              text = await response.json();
            } else {
              text = await response.text();
              if (!!response.statusText) {
                text += ' ' + response.statusText;
              }
            }
          }
          console.log('failed put', url);
          reject(text);
        }
      }).catch((error: any) => {
        console.log('failed put', url);
        reject(error);
      });
    });
  }

  public delete(url: string, contentType: string = 'application/json', accept: string | string[] = 'text/plain'): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(url, {
        method: 'delete',
        redirect: 'follow',
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType,
          'Accept': accept
        }
      }).then(async (response: any) => {
        if (!!response && response.status >= 200 && response.status <= 299) {
          if (!!response.headers && response.headers.get('content-type') == 'application/json') {
            resolve(await response.json());
          } else {
            resolve(await response.text());
          }
        } else {
          let text = 'Response variable is undefined.';
          if (!!response) {
            if (!!response.headers && response.headers.get('content-type') == 'application/json') {
              text = await response.json();
            } else {
              text = await response.text();
              if (!!response.statusText) {
                text += ' ' + response.statusText;
              }
            }
          }
          console.log('failed delete', url);
          reject(text);
        }
      }).catch((error: any) => {
        console.log('failed delete', url);
        reject(error);
      });
    });
  }

}
