/*
  Copyright (C) 2024  William Stanley Welling

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
          console.log('delete succeeded', url);
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
