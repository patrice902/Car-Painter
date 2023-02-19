import BaseAPIService from "./baseAPIService";

export default class AuthService extends BaseAPIService {
  static signIn = async (payload) =>
    this.request(`/auth/login`, "POST", payload);
  static getMe = async () => this.requestWithAuth(`/auth/me`, "GET");
}
