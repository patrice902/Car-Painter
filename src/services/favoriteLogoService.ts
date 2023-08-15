import { FavoriteLogo } from "src/types/model";
import { FavoriteLogoPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class FavoriteLogoService extends BaseAPIService {
  static getFavoriteLogoList = async (): Promise<FavoriteLogo[]> =>
    this.requestWithAuth(`/favorite-logo`, "GET");

  static getFavoriteLogoListByUserID = async (
    userID: number
  ): Promise<FavoriteLogo[]> =>
    this.requestWithAuth(`/favorite-logo/byUser/${userID}`, "GET");

  static getFavoriteLogoListByLogoID = async (
    logoID: number
  ): Promise<FavoriteLogo[]> =>
    this.requestWithAuth(`/favorite-logo/byLogo/${logoID}`, "GET");

  static createFavoriteLogo = async (
    payload: FavoriteLogoPayload
  ): Promise<FavoriteLogo> =>
    this.requestWithAuth(`/favorite-logo`, "POST", payload);

  static getFavoriteLogo = async (id: number): Promise<FavoriteLogo> =>
    this.requestWithAuth(`/favorite-logo/${id}`, "GET");

  static updateFavoriteLogo = async (
    id: number,
    payload: FavoriteLogoPayload
  ): Promise<FavoriteLogo> =>
    this.requestWithAuth(`/favorite-logo/${id}`, "PUT", payload);

  static deleteFavoriteLogo = async (id: number) =>
    this.requestWithAuth(`/favorite-logo/${id}`, "DELETE");
}
