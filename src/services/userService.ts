import { UserMin } from "src/types/model";
import { UserMinWithBlockedList, UserPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class UserService extends BaseAPIService {
  static getUserList = async (): Promise<UserMin[]> =>
    this.requestWithAuth(`/user`, "GET");

  static getUserByID = async (id: number): Promise<UserMinWithBlockedList> =>
    this.requestWithAuth(`/user/${id}`, "GET");

  static getPremiumUserByID = async (
    id: number
  ): Promise<UserMinWithBlockedList> =>
    this.requestWithAuth(`/user/premium/${id}`, "GET");

  static updateUser = async (
    userID: number,
    payload: UserPayload
  ): Promise<UserMinWithBlockedList> =>
    this.requestWithAuth(`/user/${userID}`, "PUT", payload);
}
