const request = require('request');

import { config } from '../config';

export class RestService {

  public get(url: string, contentType: string = 'application/json'): Promise<any> {
    return new Promise((resolve, reject) => {
      request.get({
        url: url,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType
        }
      }, (error: any, response: any, body: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          resolve(JSON.parse(body));
        } else {
          reject(body);
        }
      });
    });
  }

  public post(url: string, body: any, contentType: string = 'application/json'): Promise<any> {
    return new Promise((resolve, reject) => {
      request.post({
        url: url,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType
        },
        json: body
      }, (error: any, response: any, body: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          const token = response.headers['x-okapi-token'];
          if (token && config.has('token') && config.get('token') !== token) {
            config.set('token', token)
            resolve(body);
          } else {
            resolve(body);
          }
        } else {
          reject(body);
        }
      });
    });
  }

  public put(url: string, body: any, contentType: string = 'application/json'): Promise<any> {
    return new Promise((resolve, reject) => {
      request.put({
        url: url,
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Content-Type': contentType
        },
        json: body
      }, (error: any, response: any, body: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          const token = response.headers['x-okapi-token'];
          if (token && config.has('token') && config.get('token') !== token) {
            config.set('token', token)
            resolve(body);
          } else {
            resolve(body);
          }
        } else {
          reject(body);
        }
      });
    });
  }

}