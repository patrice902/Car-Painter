import { FavoriteScheme } from "src/types/model";
import {
  FavoriteSchemeForGetByID,
  FavoriteSchemeForGetListByUserId,
  FavoriteSchemePayload,
  FavoriteSchemeWithUser,
} from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class FavoriteSchemeService extends BaseAPIService {
  static getFavoriteSchemeList = async (): Promise<FavoriteScheme[]> =>
    this.requestWithAuth(`/favorite`, "GET");

  static getFavoriteSchemeListByUserID = async (
    userID: number
  ): Promise<FavoriteSchemeForGetListByUserId[]> =>
    this.requestWithAuth(`/favorite/byUser/${userID}`, "GET");

  static getFavoriteSchemeListBySchemeID = async (
    schemeID: number
  ): Promise<FavoriteSchemeWithUser[]> =>
    this.requestWithAuth(`/favorite/byScheme/${schemeID}`, "GET");

  static createFavoriteScheme = async (
    payload: FavoriteSchemePayload
  ): Promise<FavoriteSchemeForGetByID> =>
    this.requestWithAuth(`/favorite`, "POST", payload);

  static getFavoriteScheme = async (
    schemeID: number
  ): Promise<FavoriteSchemeForGetByID> =>
    this.requestWithAuth(`/favorite/${schemeID}`, "GET");

  static updateFavoriteScheme = async (
    schemeID: number,
    payload: FavoriteSchemePayload
  ): Promise<FavoriteSchemeForGetByID> =>
    this.requestWithAuth(`/favorite/${schemeID}`, "PUT", payload);

  static deleteFavoriteScheme = async (id: number) =>
    this.requestWithAuth(`/favorite/${id}`, "DELETE");
}
