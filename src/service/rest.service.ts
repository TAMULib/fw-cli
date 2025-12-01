/*
  Copyright (C) 2024-2025 Texas A&M University Libraries

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
const process = require('node:process');
const request = require('request');

import { config } from '../config';

export class RestService {

  /**
   * Build the access headers.
   *
   * @return The built access headers.
   */
  public buildAccessHeaders(): Record<string, any> {
    const auth: Record<string, any> = {};
    const accessToken: Record<string, any> = config.get('accessToken');
    const refreshToken: Record<string, any> = config.get('refreshToken');

    if (!refreshToken?.folioRefreshToken) {
      auth['X-Okapi-Token'] = accessToken?.folioAccessToken;
    } else {
      const cookie = [];

      for (let key in accessToken) {
        cookie.push(`${key}=${accessToken[key]}`);
      }

      auth['Cookie'] = cookie.join(';');
    }

    return auth;
  }

  /**
   * A wrapper to the request module's request().
   *
   * Note that this does not return a Promise and therefore cannot utilize `.catch()`.
   *
   * @return The reslts of the request() call.
   */
  public request(req: any, cb: any): any {
    return request(req, cb);
  }

  public get(url: string, contentType: string = 'application/json'): Promise<any> {
    return new Promise((resolve, reject) => {
      request.get({
        url,
        headers: {
          'Content-Type': contentType,
          'X-Okapi-Tenant': config.get('tenant'),
          ...this.buildAccessHeaders(),
        }
      }, (error: any, resp?: any, body?: any) => {
        if (resp?.statusCode >= 200 && resp?.statusCode <= 299) {
          resolve(JSON.parse(body));
        } else {
          this.serviceError('Error: Failed to GET.', url, reject, body, error, resp);
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
          'Content-Type': contentType,
          'X-Okapi-Tenant': config.get('tenant'),
          ...this.buildAccessHeaders(),
        }
      }, (error: any, resp?: any, body?: any) => {
        if (resp?.statusCode >= 200 && resp?.statusCode <= 299) {
          resolve(body);
        } else {
          this.serviceError('Error: Failed to POST.', url, reject, body, error, resp, json);
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
          'Content-Type': contentType,
          'X-Okapi-Tenant': config.get('tenant'),
          ...this.buildAccessHeaders(),
        }
      }, (error: any, resp: any, body?: any) => {
        if (resp?.statusCode >= 200 && resp?.statusCode <= 299) {
          resolve(body);
        } else {
          this.serviceError('Error: Failed to PUT.', url, reject, body, error, resp, json);
        }
      });
    });
  }

  public delete(url: string, contentType: string = 'application/json', accept: string = 'text/plain'): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = request.delete({
        url,
        headers: {
          'Accept': accept,
          'Content-Type': contentType,
          'X-Okapi-Tenant': config.get('tenant'),
          ...this.buildAccessHeaders(),
        }
      }, (error: any, resp?: any, body?: any) => {
        if (!!resp && resp?.statusCode >= 200 && resp?.statusCode <= 299) {
          console.log('Delete succeeded.', url);
          resolve(body);
        } else {
          this.serviceError('Error: Failed to DELETE.', url, reject, body, error, resp);
        }
      });
    });
  }

  /**
   * Helper function for rejecting on request error.
   *
   * @param status  - The status message.
   * @param url     - The URL.
   * @param reject  - The promise reject callback.
   * @param body    - The response body.
   * @param [error] - The error message.
   * @param [resp]  - The response data.
   * @param [json]  - The JSON request payload.
   */
  protected serviceError(status: string, url: string, reject: any, body: any, error?: any, resp?: any, json?: any) {
    process.exitCode = 2;

    const contentType = resp?.headers['content-type']?.toLowerCase();

    reject({
      status,
      url,
      payload: json,
      http: {
        code: resp?.statusCode,
        message: resp?.statusMessage,
      },
      error: !!error
        ? error
        : contentType == 'application/json' && typeof body == 'string'
          ? JSON.parse(body)
          : body,
    });
  }

}
