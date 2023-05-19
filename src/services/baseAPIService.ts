import axios, { Method } from "axios";
import https from "https";
import config from "src/config";

import CookieService from "./cookieService";
const baseURL = config.apiURL || "";

export default class BaseAPIService {
  static request = (
    url: string,
    method: Method,
    data: unknown = {},
    timeout = 0,
    contentType = "application/json"
  ) =>
    axios
      .request({
        url: baseURL + url,
        headers: {
          "Content-Type": contentType,
        },
        method,
        data,
        timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then((res) => res.data);

  static requestWithAuth = (
    url: string,
    method: Method,
    data: unknown = {},
    timeout = 0,
    contentType = "application/json"
  ) =>
    axios
      .request({
        url: baseURL + url,
        headers: {
          Authorization: JSON.stringify(CookieService.getSiteLogin()),
          "Content-Type": contentType,
        },
        method,
        data,
        timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then((res) => res.data);

  static directRequest = (
    url: string,
    method: Method,
    data: unknown = {},
    timeout = 0,
    contentType = "application/json"
  ) =>
    axios
      .request({
        url,
        headers: {
          "Content-Type": contentType,
        },
        method,
        data,
        timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then((res) => res.data);

  static directRequestWithAuth = (
    url: string,
    method: Method,
    data: unknown = {},
    timeout = 0,
    contentType = "application/json"
  ) =>
    axios
      .request({
        url,
        headers: {
          Authorization: JSON.stringify(CookieService.getSiteLogin()),
          "Content-Type": contentType,
        },
        method,
        data,
        timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then((res) => res.data);
}
