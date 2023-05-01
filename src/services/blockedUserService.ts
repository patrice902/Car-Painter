import { BlockedUser } from "src/types/model";
import { BlockedUserPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class BlockedUserService extends BaseAPIService {
  static getBlockedUserList = async (): Promise<BlockedUser[]> =>
    this.requestWithAuth(`/blockedUser`, "GET");

  static getBlockedUserListByBlocker = async (
    blockerID: number
  ): Promise<BlockedUser[]> =>
    this.requestWithAuth(`/blockedUser/blocker/${blockerID}`, "GET");

  static getBlockedUserListByBlockedUser = async (
    userID: number
  ): Promise<BlockedUser[]> =>
    this.requestWithAuth(`/blockedUser/blocked/${userID}`, "GET");

  static getBlockedUserRowByID = async (id: number): Promise<BlockedUser> =>
    this.requestWithAuth(`/blockedUser/${id}`, "GET");

  static createBlockedUserRow = async (
    payload: BlockedUserPayload
  ): Promise<BlockedUser> =>
    this.requestWithAuth(`/blockedUser`, "POST", payload);

  static updateBlockedUserRow = async (
    id: number,
    payload: BlockedUserPayload
  ): Promise<BlockedUser> =>
    this.requestWithAuth(`/blockedUser/${id}`, "PUT", payload);
}
