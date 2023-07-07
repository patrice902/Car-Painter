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
    this.requestWithAuth(`/favorite-scheme`, "GET");

  static getFavoriteSchemeListByUserID = async (
    userID: number
  ): Promise<FavoriteSchemeForGetListByUserId[]> =>
    this.requestWithAuth(`/favorite-scheme/byUser/${userID}`, "GET");

  static getFavoriteSchemeListBySchemeID = async (
    schemeID: number
  ): Promise<FavoriteSchemeWithUser[]> =>
    this.requestWithAuth(`/favorite-scheme/byScheme/${schemeID}`, "GET");

  static createFavoriteScheme = async (
    payload: FavoriteSchemePayload
  ): Promise<FavoriteSchemeForGetByID> =>
    this.requestWithAuth(`/favorite-scheme`, "POST", payload);

  static getFavoriteScheme = async (
    id: number
  ): Promise<FavoriteSchemeForGetByID> =>
    this.requestWithAuth(`/favorite-scheme/${id}`, "GET");

  static updateFavoriteScheme = async (
    id: number,
    payload: FavoriteSchemePayload
  ): Promise<FavoriteSchemeForGetByID> =>
    this.requestWithAuth(`/favorite-scheme/${id}`, "PUT", payload);

  static deleteFavoriteScheme = async (id: number) =>
    this.requestWithAuth(`/favorite-scheme/${id}`, "DELETE");
}
