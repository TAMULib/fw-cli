const request = require('request');

import { config } from '../config';

export class RestService {

  public request(req: any, cb: any): any {
    return request(req, cb);
  }

  public get(url: string, contentType: string = 'application/json'): Promise<any> {
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType
        }
      }, (error: any, response: any, body?: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          resolve(JSON.parse(body));
        } else if (error) {
          // console.log('failed get', url, error);
          reject(error);
        } else {
          // console.log('failed get', url);
          reject(body);
        }
      });
    });
  }

  public post(url: string, json: any, contentType: string = 'application/json'): Promise<any> {
    return new Promise((resolve, reject) => {
      request.post({
        url,
        json,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType
        }
      }, (error: any, response: any, body?: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          resolve(body);
        } else if (error) {
          console.log('failed post', url, error);
          reject(error);
        } else {
          console.log('failed post', url, json);
          reject(body);
        }
      });
    });
  }

  public put(url: string, json: any, contentType: string = 'application/json'): Promise<any> {
    return new Promise((resolve, reject) => {
      request.put({
        url,
        json,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType
        }
      }, (error: any, response: any, body?: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          resolve(body);
        } else if (error) {
          console.log('failed put', url, error);
          reject(error);
        } else {
          console.log('failed put', url, json);
          reject(body);
        }
      });
    });
  }

  public delete(url: string, contentType: string = 'application/json', accept: string = 'text/plain'): Promise<any> {
    return new Promise((resolve, reject) => {
      request.delete({
        url,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType,
          'Accept': accept
        }
      }, (error: any, response: any, body?: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          resolve(body);
        } else if (error) {
          console.log('failed delete', url, error);
          reject(error);
        } else {
          console.log('failed delete', url);
          reject(body);
        }
      });
    });
  }

}
