import { SharedScheme } from "src/types/model";
import {
  SharedSchemeForGetByID,
  SharedSchemeForGetListByUserId,
  SharedSchemePayload,
  SharedSchemeWithUser,
} from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class SharedSchemeService extends BaseAPIService {
  static getSharedSchemeList = async (): Promise<SharedScheme[]> =>
    this.requestWithAuth(`/shared`, "GET");

  static getSharedSchemeListByUserID = async (
    userID: number
  ): Promise<SharedSchemeForGetListByUserId[]> =>
    this.requestWithAuth(`/shared/byUser/${userID}`, "GET");

  static getSharedSchemeListBySchemeID = async (
    schemeID: number
  ): Promise<SharedSchemeWithUser[]> =>
    this.requestWithAuth(`/shared/byScheme/${schemeID}`, "GET");

  static createSharedScheme = async (
    payload: SharedSchemePayload
  ): Promise<SharedSchemeForGetByID> =>
    this.requestWithAuth(`/shared`, "POST", payload);

  static getSharedScheme = async (
    schemeID: number
  ): Promise<SharedSchemeForGetByID> =>
    this.requestWithAuth(`/shared/${schemeID}`, "GET");

  static updateSharedScheme = async (
    schemeID: number,
    payload: Partial<SharedSchemePayload>
  ): Promise<SharedSchemeForGetByID> =>
    this.requestWithAuth(`/shared/${schemeID}`, "PUT", payload);

  static deleteSharedScheme = async (id: number) =>
    this.requestWithAuth(`/shared/${id}`, "DELETE");
}
