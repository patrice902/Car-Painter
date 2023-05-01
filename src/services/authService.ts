import {
  AuthPayload,
  LoginResponse,
  UserWithBlockedList,
} from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class AuthService extends BaseAPIService {
  static signIn = async (payload: AuthPayload): Promise<LoginResponse> =>
    this.request(`/auth/login`, "POST", payload);

  static getMe = async (): Promise<UserWithBlockedList> =>
    this.requestWithAuth(`/auth/me`, "GET");
}
