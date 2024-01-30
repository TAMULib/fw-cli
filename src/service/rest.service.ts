const request = require('request');

import { config } from '../config';

export class RestService {

  public request(req: any, cb: any): any {
    return request(req, cb);
  }

  public get(url: string, json: any = null, contentType: string = 'application/json', accept: string | string[] = [ 'application/json', 'text/plain' ], redirectCount: number = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType,
          'Accept': accept
        }
      }, (error: any, response: any, body: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          resolve(JSON.parse(body));
        } else if (error) {
          // console.log('failed get', url, error);
          reject(error);
        } else {
          const promise = this.redirectRecurse(url, json, contentType, accept, response, this.get, redirectCount + 1);
          if (promise) {
            return this.resolveRedirectPromise(promise, resolve, reject);
          }

          // console.log('failed get', url);
          reject(body);
        }
      });
    });
  }

  public post(url: string, json: any, contentType: string = 'application/json', accept: string | string[] = [ 'application/json', 'text/plain' ], redirectCount: number = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      request.post({
        url,
        json,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType,
          'Accept': accept
        }
      }, (error: any, response: any, body: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          resolve(body);
        } else if (error) {
          console.log('failed post', url, error);
          reject(error);
        } else {
          const promise = this.redirectRecurse(url, json, contentType, accept, response, this.post, redirectCount + 1);
          if (promise) {
            return this.resolveRedirectPromise(promise, resolve, reject);
          }

          console.log('failed post', url, json);
          reject(body);
        }
      });
    });
  }

  public put(url: string, json: any, contentType: string = 'application/json', accept: string | string[] = [ 'application/json', 'text/plain' ], redirectCount: number = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      request.put({
        url,
        json,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType,
          'Accept': accept
        }
      }, (error: any, response: any, body: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          resolve(body);
        } else if (error) {
          console.log('failed put', url, error);
          reject(error);
        } else {
          const promise = this.redirectRecurse(url, json, contentType, accept, response, this.put, redirectCount + 1);
          if (promise) {
            return this.resolveRedirectPromise(promise, resolve, reject);
          }

          console.log('failed put', url, json);
          reject(body);
        }
      });
    });
  }

  public delete(url: string, json: any = null, contentType: string = 'application/json', accept: string | string[] = 'text/plain', redirectCount: number = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      request.delete({
        url,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType,
          'Accept': accept
        }
      }, (error: any, response: any, body: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          resolve(body);
        } else if (error) {
          // console.log('failed delete', url, error);
          reject(error);
        } else {
          const promise = this.redirectRecurse(url, json, contentType, accept, response, this.delete, redirectCount + 1);
          if (promise) {
            return this.resolveRedirectPromise(promise, resolve, reject);
          }

          // console.log('failed delete', url);
          reject(body);
        }
      });
    });
  }

  private redirectRecurse(url: string, json: any, contentType: string, accept: string | string[], response: any, callback: (url: string, json: any, contentType: string, accept: string | string[], redirectCount: number) => Promise<any>, redirectCount: number): Promise<any> | false {
    if (response.statusCode != 301 && response.statusCode != 302 || !response.headers || !response.headers.location) {
      return false;
    }

    if (redirectCount > 10) {
      console.error('ERROR: Max redirect reached on HTTP', response.statusCode, 'from', url, 'to', response.headers.location, '.');

      return false;
    }

    const logLevel: string = config.get('logLevel');
    if (logLevel.toLowerCase() == "debug") {
      console.debug('Redirecting (', redirectCount, 'times ) because of HTTP', response.statusCode, 'from', url, 'to', response.headers.location, '.');
    }

    return callback(response.headers.location, json, contentType, accept, redirectCount + 1);
  }

  private resolveRedirectPromise(promise: Promise<any>, resolve: any, reject: any): Promise<any> {
    promise.then((result) => {
      resolve(result);
    })
    .catch ((err) => {
      reject(err);
    });

    return promise;
  }

}
