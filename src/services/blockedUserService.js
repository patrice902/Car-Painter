import BaseAPIService from "./baseAPIService";

export default class BlockedUserService extends BaseAPIService {
  static getBlockedUserList = async () =>
    this.requestWithAuth(`/blockedUser`, "GET");
  static getBlockedUserListByBlocker = async (blockerID) =>
    this.requestWithAuth(`/blockedUser/blocker/${blockerID}`, "GET");
  static getBlockedUserListByBlockedUser = async (userID) =>
    this.requestWithAuth(`/blockedUser/blocked/${userID}`, "GET");
  static getBlockedUserRowByID = async (id) =>
    this.requestWithAuth(`/blockedUser/${id}`, "GET");
  static createBlockedUserRow = async (payload) =>
    this.requestWithAuth(`/blockedUser`, "POST", payload);
  static updateBlockedUserRow = async (id, payload) =>
    this.requestWithAuth(`/blockedUser/${id}`, "PUT", payload);
}
