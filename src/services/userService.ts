import { User } from "src/types/model";
import { UserPayload, UserWithBlockedList } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class UserService extends BaseAPIService {
  static getUserList = async (): Promise<User[]> =>
    this.requestWithAuth(`/user`, "GET");

  static getUserByID = async (id: number): Promise<UserWithBlockedList> =>
    this.requestWithAuth(`/user/${id}`, "GET");

  static getPremiumUserByID = async (id: number): Promise<User> =>
    this.requestWithAuth(`/user/premium/${id}`, "GET");

  static updateUser = async (
    userID: number,
    payload: UserPayload
  ): Promise<User> => this.requestWithAuth(`/user/${userID}`, "PUT", payload);
}
