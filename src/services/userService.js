import BaseAPIService from "./baseAPIService";

export default class UserService extends BaseAPIService {
  static getUserList = async () => this.requestWithAuth(`/user`, "GET");
  static getUserByID = async (id) => this.requestWithAuth(`/user/${id}`, "GET");
  static getPremiumUserByID = async (id) =>
    this.requestWithAuth(`/user/premium/${id}`, "GET");
}
