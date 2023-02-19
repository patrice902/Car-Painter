import axios from "axios";
import config from "config";
import https from "https";

import CookieService from "./cookieService";
const baseURL = config.apiURL || "";

export default class BaseAPIService {
  static request = (
    url,
    method,
    data,
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
    url,
    method,
    data,
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
    url,
    method,
    data,
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
    url,
    method,
    data,
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
